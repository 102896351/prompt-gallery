#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { spawn } from 'node:child_process';
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const SOURCE_HOST = 'img1.aiart.pics';
const SOURCE_PREFIX = '/images/prompts/';
const DEFAULT_PUBLIC_BASE = 'https://media.aiartspell.art';
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = Number(process.env.R2_MAX_IMAGE_BYTES || 10 * 1024 * 1024);
const REQUEST_TIMEOUT_MS = Number(process.env.R2_REQUEST_TIMEOUT_MS || 30_000);
const MAX_RETRIES = Number(process.env.R2_MAX_RETRIES || 3);
const CONCURRENCY = Math.max(1, Math.min(Number(process.env.R2_CONCURRENCY || 4), 8));
const CACHE_CONTROL = 'public, max-age=31536000, immutable';
const CURL_BIN = process.env.R2_CURL_BIN || (process.platform === 'win32' ? 'curl.exe' : '/usr/bin/curl');
const TEMP_ROOT = process.env.R2_TEMP_DIR || join(process.env.RUNNER_TEMP || process.env.TMPDIR || '/tmp', 'prompt-gallery-r2');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i].replace(/^--/, '');
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function asDataset(raw) {
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return { wrapper: 'array', candidates: parsed };
  if (parsed && Array.isArray(parsed.candidates)) return { wrapper: 'candidates', candidates: parsed.candidates, meta: parsed };
  throw new Error('Input must be an array or an object with a candidates array');
}

function sourceUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function normalizeSource(value) {
  const url = sourceUrl(value);
  if (!url || url.protocol !== 'https:' || url.hostname !== SOURCE_HOST || !url.pathname.startsWith(SOURCE_PREFIX)) {
    throw new Error(`Unsupported image URL: ${value}`);
  }
  if (url.username || url.password || url.port || url.pathname.includes('..')) {
    throw new Error(`Unsafe image URL: ${value}`);
  }
  return url;
}

function extensionFor(type, originalPath) {
  const ext = extname(originalPath).toLowerCase();
  if (ext !== '.xx') return ext || (type === 'image/png' ? '.png' : '.jpg');
  return type === 'image/png' ? '.png' : type === 'image/webp' ? '.webp' : type === 'image/gif' ? '.gif' : '.jpg';
}

function keyFor(url, contentType = 'image/jpeg') {
  const normalized = normalizeSource(url);
  const path = normalized.pathname.slice(1);
  const file = path.split('/').at(-1) || '';
  if (!file || /[\u0000-\u001f\u007f]/.test(path) || file === '.' || file === '..') throw new Error(`Unsafe image key path: ${url}`);
  const ext = extensionFor(contentType, path);
  if (path.endsWith('.xx')) return `${path.slice(0, -3)}${ext}`;
  return path;
}

function publicUrlFor(key, base = process.env.R2_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE) {
  return `${base.replace(/\/$/, '')}/${key}`;
}

function isLocalImage(value) {
  return typeof value === 'string' && value.startsWith('/prompts/') && !value.includes('..');
}

function isR2Image(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === new URL(process.env.R2_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE).hostname;
  } catch {
    return false;
  }
}

async function withTimeout(promiseFactory, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await promiseFactory(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

function retryable(error) {
  const message = String(error?.message || error);
  return /aborted|timeout|fetch failed|ECONNRESET|ETIMEDOUT|429|408|5\d\d/i.test(message);
}

async function retry(fn, label) {
  let last;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      last = error;
      if (attempt >= MAX_RETRIES || !retryable(error)) break;
      const delay = Math.min(8_000, 500 * 2 ** attempt) + Math.floor(Math.random() * 250);
      console.warn(`[r2] retry ${label} in ${delay}ms (${attempt + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw last;
}

function detectType(buffer) {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  if (buffer.subarray(0, 6).toString() === 'GIF87a' || buffer.subarray(0, 6).toString() === 'GIF89a') return 'image/gif';
  return null;
}

async function downloadWithCurl(url, target) {
  return new Promise((resolve, reject) => {
    const child = spawn(CURL_BIN, [
      '--http1.1', '--fail', '--silent', '--show-error', '--location',
      '--retry', String(MAX_RETRIES),
      '--connect-timeout', '15', '--max-time', String(Math.ceil(REQUEST_TIMEOUT_MS / 1000)),
      '-A', 'prompt-gallery-r2-migrator/1.0',
      '--output', target,
      '--write-out', '\\n%{content_type}\\n%{size_download}',
      url,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`curl download timed out after ${REQUEST_TIMEOUT_MS}ms for ${url}`));
    }, REQUEST_TIMEOUT_MS + 1_000);
    child.stdout.on('data', (data) => { stdout += data; });
    child.stderr.on('data', (data) => { stderr += data; });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', async (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr.trim() || `curl exited ${code} for ${url}`));
        return;
      }
      try {
        const lines = stdout.trim().split(/\r?\n/);
        const reportedType = (lines.at(-2) || '').split(';')[0].trim().toLowerCase();
        const reportedBytes = Number(lines.at(-1) || 0);
        const file = await readFile(target);
        const bytes = file.length;
        if (!bytes || bytes > MAX_BYTES || (reportedBytes && reportedBytes !== bytes)) {
          throw new Error(`Invalid source size ${bytes} for ${url}`);
        }
        const type = detectType(file);
        if (!type || !ALLOWED_TYPES.has(type)) throw new Error(`Unsupported or invalid image data for ${url}`);
        if (reportedType && ALLOWED_TYPES.has(reportedType) && reportedType !== type) {
          throw new Error(`Image signature/type mismatch ${type}/${reportedType} for ${url}`);
        }
        await writeFile(target, file);
        resolve({ type, bytes, sha256: createHash('sha256').update(file).digest('hex') });
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function downloadWithFetch(url, target) {
  const response = await withTimeout((signal) => fetch(url, {
    signal,
    headers: { 'user-agent': 'prompt-gallery-r2-migrator/1.0' },
  }));
  if (!response.ok) throw new Error(`Source returned ${response.status} for ${url}`);
  const type = (response.headers.get('content-type') || '').split(';')[0].toLowerCase();
  if (!ALLOWED_TYPES.has(type)) throw new Error(`Unsupported source content type ${type} for ${url}`);
  const length = Number(response.headers.get('content-length') || 0);
  if (length > MAX_BYTES) throw new Error(`Source image exceeds ${MAX_BYTES} bytes: ${url}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (!data.length || data.length > MAX_BYTES) throw new Error(`Invalid source size ${data.length} for ${url}`);
  const detected = detectType(data);
  if (!detected || detected !== type) throw new Error(`Image signature/type mismatch ${detected}/${type} for ${url}`);
  await writeFile(target, data);
  return { type, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') };
}

async function download(url, target) {
  return retry(async () => {
    let curlError;
    try {
      return await downloadWithCurl(url, target);
    } catch (error) {
      curlError = error;
      console.warn(`[r2] curl download failed for ${url}: ${error?.message || error}; trying fetch`);
    }
    try {
      return await downloadWithFetch(url, target);
    } catch (fetchError) {
      const combined = new Error(`curl: ${curlError?.message || curlError}; fetch: ${fetchError?.message || fetchError}`);
      combined.cause = fetchError;
      throw combined;
    }
  }, `download ${url}`);
}

function createClient() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) throw new Error('R2 credentials are required unless --dry-run is used');
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function headPublic(url) {
  return retry(async () => {
    const response = await withTimeout((signal) => fetch(url, { method: 'HEAD', signal, headers: { 'user-agent': 'prompt-gallery-r2-migrator/1.0' } }));
    return {
      ok: response.ok,
      status: response.status,
      contentType: (response.headers.get('content-type') || '').split(';')[0].toLowerCase(),
      bytes: Number(response.headers.get('content-length') || 0),
    };
  }, `verify ${url}`);
}

async function uploadOne(client, bucket, key, data, metadata) {
  if (client) {
    try {
      const existing = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      if (existing.ContentLength === metadata.bytes && (!existing.ContentType || existing.ContentType === metadata.type)) return 'exists';
      throw new Error(`R2 object exists with different metadata; refusing to overwrite ${key}`);
    } catch (error) {
      if (error?.$metadata?.httpStatusCode !== 404 && error?.name !== 'NotFound') throw error;
    }
    await retry(() => client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: metadata.type,
      CacheControl: CACHE_CONTROL,
    })), `upload ${key}`);
    return 'uploaded';
  }
  return 'dry-run';
}

function walkImages(value, onImage, path = []) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) walkImages(value[i], onImage, [...path, i]);
  } else if (value && typeof value === 'object') {
    if (typeof value.src === 'string' && path.includes('images')) onImage(value, path, 'src');
    if (typeof value.image === 'string' && path.includes('prompts')) onImage(value, path, 'image');
    if (typeof value.cover === 'string') onImage(value, path, 'cover');
    for (const [key, child] of Object.entries(value)) walkImages(child, onImage, [...path, key]);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const input = args.input;
  const output = args.output;
  if (!input || !output) throw new Error('--input and --output are required');
  const dataset = asDataset(await readFile(input, 'utf8'));
  const dryRun = Boolean(args['dry-run']) || process.env.R2_DRY_RUN === '1';
  const bucket = process.env.R2_BUCKET || 'aiartspell';
  const base = process.env.R2_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE;
  let client = null;
  const manifestPath = args.manifest;
  let manifest = { schemaVersion: 1, bucket, publicBaseUrl: base, assets: {} };
  if (manifestPath) {
    try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch {}
    manifest.assets ||= {};
  }
  await rm(TEMP_ROOT, { recursive: true, force: true });
  await mkdir(TEMP_ROOT, { recursive: true });
  const failures = [];
  const records = new Map();
  const tasks = [];
  walkImages(dataset.candidates, (image, path, field) => {
    tasks.push({ image, path, field });
  });
  const unique = new Map();
  for (const task of tasks) unique.set(task.image.src || task.image.image || task.image.cover, task);
  const queue = [...unique.values()];
  if (!dryRun && queue.length > 0) client = createClient();
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const task = queue[cursor++];
      const value = task.image[task.field];
      try {
        if (isLocalImage(value)) { records.set(value, { src: value, status: 'skipped-local' }); continue; }
        if (isR2Image(value)) {
          const publicCheck = await headPublic(value);
          if (!publicCheck.ok || !ALLOWED_TYPES.has(publicCheck.contentType)) throw new Error(`R2 public check failed ${publicCheck.status}: ${value}`);
          records.set(value, { src: value, status: 'verified', r2Url: value, contentType: publicCheck.contentType, bytes: publicCheck.bytes });
          continue;
        }
        const url = normalizeSource(value);
        const placeholderKey = keyFor(value);
        const target = join(TEMP_ROOT, `${createHash('sha1').update(value).digest('hex')}${extname(placeholderKey)}`);
        const metadata = await download(url.toString(), target);
        const key = keyFor(value, metadata.type);
        const r2Url = publicUrlFor(key, base);
        const uploadStatus = await uploadOne(client, bucket, key, await readFile(target), metadata);
        const publicCheck = dryRun ? { ok: true, status: 200, contentType: metadata.type, bytes: metadata.bytes } : await headPublic(r2Url);
        if (!publicCheck.ok || publicCheck.contentType !== metadata.type || (publicCheck.bytes && publicCheck.bytes !== metadata.bytes)) throw new Error(`R2 public check failed for ${r2Url}`);
        const record = { sourceUrl: value, r2Url, key, sha256: metadata.sha256, bytes: metadata.bytes, contentType: metadata.type, status: 'verified', checkedAt: new Date().toISOString(), uploadStatus };
        records.set(value, record);
        manifest.assets[value] = record;
      } catch (error) {
        failures.push({ value, error: String(error?.message || error), path: task.path });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
  if (failures.length) console.error(`[r2] ${failures.length} image failures; affected candidates will be removed`);
  const failedValues = new Set(failures.map((failure) => failure.value));
  const goodCandidates = dataset.candidates.filter((candidate) => {
    const candidateValues = [];
    walkImages(candidate, (image, _path, field) => candidateValues.push(image[field]));
    return candidateValues.every((value) => !failedValues.has(value));
  });
  function rewrite(value) {
    const record = records.get(value);
    return record?.r2Url || value;
  }
  function rewriteImages(value) {
    if (Array.isArray(value)) return value.map(rewriteImages);
    if (value && typeof value === 'object') {
      const out = { ...value };
      if (typeof out.src === 'string' && records.has(out.src)) out.src = rewrite(out.src);
      if (typeof out.image === 'string' && records.has(out.image)) out.image = rewrite(out.image);
      if (typeof out.cover === 'string' && records.has(out.cover)) out.cover = rewrite(out.cover);
      for (const [key, child] of Object.entries(out)) {
        if (child && typeof child === 'object') out[key] = rewriteImages(child);
      }
      return out;
    }
    return value;
  }
  const rewritten = { ...dataset.meta, candidates: goodCandidates.map(rewriteImages) };
  if (dataset.wrapper === 'array') await writeFile(output, JSON.stringify(rewritten.candidates, null, 2) + '\n');
  else await writeFile(output, JSON.stringify(rewritten, null, 2) + '\n');
  if (manifestPath) await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  if (args.report) await writeFile(args.report, JSON.stringify({ input, selected: dataset.candidates.length, output: goodCandidates.length, migratedImages: records.size, failures }, null, 2) + '\n');
  console.error(`[r2] candidates ${dataset.candidates.length} -> ${goodCandidates.length}; images ${queue.length}; failures ${failures.length}; dryRun=${dryRun}`);
  if (failures.length && !goodCandidates.length) process.exitCode = 2;
}

main().catch((error) => { console.error('[r2] Fatal:', error); process.exit(1); });
