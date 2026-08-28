#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env.local');
try {
  const envText = await readFile(envPath, 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
} catch {
  // .env.local is optional for health and validation tests.
}

const HOST = process.env.AGNES_LOCAL_HOST || '127.0.0.1';
const PORT = Number(process.env.AGNES_LOCAL_PORT || 8787);
const ORIGIN = process.env.AGNES_LOCAL_ORIGIN || 'http://localhost:4321';
if (!['127.0.0.1', 'localhost'].includes(HOST)) {
  throw new Error('AGNES_LOCAL_HOST must be localhost or 127.0.0.1');
}
const ALLOWED_ORIGINS = new Set([
  ORIGIN,
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);
const API_BASE = (process.env.AGNES_API_BASE_URL || 'https://apihub.agnes-ai.com/v1').replace(/\/$/, '');
const API_BASE_URL = new URL(API_BASE);
if (API_BASE_URL.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(API_BASE_URL.hostname)) {
  throw new Error('AGNES_API_BASE_URL must use HTTPS');
}
const MODEL_REGISTRY = Object.freeze({
  'agnes-image-2.1-flash': {
    providerModel: 'agnes-image-2.1-flash',
    label: 'Agnes Image 2.1 Flash',
    supports: { image: true, ratio: true, size: false },
  },
});
const DEFAULT_MODEL_ID = process.env.AGNES_IMAGE_MODEL || 'agnes-image-2.1-flash';
if (!MODEL_REGISTRY[DEFAULT_MODEL_ID]) {
  throw new Error(`AGNES_IMAGE_MODEL is not registered: ${DEFAULT_MODEL_ID}`);
}
const MODEL = MODEL_REGISTRY[DEFAULT_MODEL_ID].providerModel;
const TIMEOUT_MS = Math.min(Math.max(Number(process.env.AGNES_REQUEST_TIMEOUT_MS || 90_000), 5_000), 300_000);
const MAX_PROMPT_LENGTH = 4_000;
const MAX_IMAGES = 4;
const MAX_TOTAL_BODY_BYTES = 20 * 1024 * 1024;
const MAX_DATA_URI_BYTES = 5 * 1024 * 1024;
const MAX_UPSTREAM_RESPONSE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_RATIOS = new Set(['1:1', '16:9', '9:16']);

function corsHeaders(request) {
  const requestOrigin = request.headers.origin;
  const headers = {
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'Origin',
  };
  if (!requestOrigin || ALLOWED_ORIGINS.has(requestOrigin)) headers['access-control-allow-origin'] = requestOrigin || ORIGIN;
  return headers;
}

function sendJson(request, response, status, payload) {
  response.writeHead(status, {
    ...corsHeaders(request),
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

function publicError(status, code, message) {
  return { error: { code, message } , status };
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body, 'utf8') > MAX_TOTAL_BODY_BYTES) throw Object.assign(new Error('request too large'), { code: 'request_too_large', status: 413 });
  }
  try {
    const parsed = JSON.parse(body || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid object');
    return parsed;
  } catch {
    throw Object.assign(new Error('invalid json'), { code: 'invalid_json', status: 400 });
  }
}

const TRUSTED_IMAGE_ORIGIN = 'https://media.aiartspell.art/';

function validateDataUriImage(value, index) {
  const match = value.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match || !ALLOWED_MIME.has(match[1].toLowerCase())) {
    throw Object.assign(new Error(`image[${index}] must be a JPEG, PNG, or WebP Data URI`), { code: 'invalid_image', status: 400 });
  }
  const clean = match[2].replace(/\s+/g, '');
  let decoded;
  try {
    decoded = Buffer.from(clean, 'base64');
  } catch {
    throw Object.assign(new Error(`image[${index}] contains invalid base64`), { code: 'invalid_image', status: 400 });
  }
  if (!decoded.length || decoded.length > MAX_DATA_URI_BYTES) {
    throw Object.assign(new Error(`image[${index}] exceeds the 5MB decoded limit`), { code: 'invalid_image', status: 400 });
  }
  const signatures = {
    'image/jpeg': decoded.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
    'image/png': decoded.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/webp': decoded.subarray(0, 4).toString('ascii') === 'RIFF' && decoded.subarray(8, 12).toString('ascii') === 'WEBP',
  };
  if (!signatures[match[1].toLowerCase()]) {
    throw Object.assign(new Error(`image[${index}] content does not match its MIME type`), { code: 'invalid_image', status: 400 });
  }
}

function validateImage(value, index) {
  if (typeof value !== 'string') throw Object.assign(new Error(`image[${index}] must be a string`), { code: 'invalid_image', status: 400 });
  if (value.startsWith('data:')) {
    validateDataUriImage(value, index);
    return;
  }
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' || parsed.origin !== 'https://media.aiartspell.art' || !parsed.pathname.startsWith('/')) throw new Error('untrusted image URL');
  } catch {
    throw Object.assign(new Error(`image[${index}] must be a trusted R2 URL or image Data URI`), { code: 'invalid_image', status: 400 });
  }
}

async function callAgnes(prompt, { image, size, ratio, modelConfig } = {}) {
  if (!process.env.AGNES_API_KEY) {
    throw Object.assign(new Error('AGNES_API_KEY is not configured'), { code: 'missing_configuration', status: 503 });
  }
  const payload = { model: modelConfig.providerModel, prompt };
  if (size) payload.size = size;
  if (ratio) payload.ratio = ratio;
  if (Array.isArray(image) && image.length > 0) {
    payload.extra_body = { image, response_format: 'url' };
  } else {
    payload.extra_body = { response_format: 'url' };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.AGNES_API_KEY}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = response.ok ? await readUpstreamJson(response, controller.signal) : null;
    return { response, result };
  } finally {
    clearTimeout(timeout);
  }
}

async function readUpstreamJson(response, signal) {
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > MAX_UPSTREAM_RESPONSE_BYTES) {
    throw Object.assign(new Error('upstream response too large'), { code: 'provider_response_too_large', status: 502 });
  }
  const reader = response.body?.getReader();
  if (!reader) return response.json();
  const chunks = [];
  let total = 0;
  while (true) {
    if (signal.aborted) throw Object.assign(new Error('upstream response timed out'), { name: 'AbortError' });
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_UPSTREAM_RESPONSE_BYTES) {
      await reader.cancel();
      throw Object.assign(new Error('upstream response too large'), { code: 'provider_response_too_large', status: 502 });
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  chunks.forEach(chunk => { merged.set(chunk, offset); offset += chunk.byteLength; });
  return JSON.parse(new TextDecoder().decode(merged));
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, corsHeaders(request));
    response.end();
    return;
  }
  const url = new URL(request.url || '/', `http://${HOST}:${PORT}`);
  if (url.pathname === '/health' && request.method === 'GET') {
    sendJson(request, response, 200, {
      ok: true,
      provider: 'agnes',
      model: MODEL,
      defaultModel: DEFAULT_MODEL_ID,
      models: Object.entries(MODEL_REGISTRY).map(([id, config]) => ({ id, label: config.label, supports: config.supports })),
      configured: Boolean(process.env.AGNES_API_KEY),
      localOnly: HOST === '127.0.0.1' || HOST === 'localhost',
    });
    return;
  }
  if (url.pathname !== '/v1/generate-image') {
    sendJson(request, response, 404, publicError(404, 'not_found', 'Local Agnes endpoint not found'));
    return;
  }
  if (request.method !== 'POST') {
    sendJson(request, response, 405, publicError(405, 'method_not_allowed', 'Use POST for image generation'));
    return;
  }
  const started = Date.now();
  try {
    const body = await readJson(request);
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) {
      sendJson(request, response, 400, publicError(400, 'invalid_prompt', 'Prompt is required'));
      return;
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      sendJson(request, response, 400, publicError(400, 'prompt_too_long', `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer`));
      return;
    }
    const images = Array.isArray(body.image) ? body.image : (body.image ? [body.image] : []);
    const modelId = typeof body.model === 'string' && body.model.trim() ? body.model.trim() : DEFAULT_MODEL_ID;
    const modelConfig = MODEL_REGISTRY[modelId];
    if (!modelConfig) {
      sendJson(request, response, 400, publicError(400, 'unsupported_model', 'The selected image model is not available'));
      return;
    }
    if (images.length > MAX_IMAGES) {
      sendJson(request, response, 400, publicError(400, 'too_many_images', `At most ${MAX_IMAGES} images allowed`));
      return;
    }
    for (let i = 0; i < images.length; i += 1) {
      validateImage(images[i], i);
    }
    const size = typeof body.size === 'string' && body.size.trim() ? body.size.trim() : undefined;
    const ratio = typeof body.ratio === 'string' && body.ratio.trim() ? body.ratio.trim() : undefined;
    if (ratio && !ALLOWED_RATIOS.has(ratio)) {
      sendJson(request, response, 400, publicError(400, 'invalid_ratio', 'Unsupported aspect ratio'));
      return;
    }
    if (ratio && !modelConfig.supports.ratio) {
      sendJson(request, response, 400, publicError(400, 'unsupported_capability', 'The selected model does not support aspect ratios'));
      return;
    }
    if (size && !modelConfig.supports.size) {
      sendJson(request, response, 400, publicError(400, 'unsupported_capability', 'The selected model does not support custom sizes'));
      return;
    }
    if (images.length > 0 && !modelConfig.supports.image) {
      sendJson(request, response, 400, publicError(400, 'unsupported_capability', 'The selected model does not support image input'));
      return;
    }
    const upstream = await callAgnes(prompt, { image: images.length > 0 ? images : undefined, size, ratio, modelConfig });
    const upstreamResponse = upstream.response;
    if (!upstreamResponse.ok) {
      const status = upstreamResponse.status === 401 ? 502 : upstreamResponse.status === 429 ? 429 : upstreamResponse.status >= 500 ? 502 : 400;
      const code = upstreamResponse.status === 401 ? 'provider_auth_error' : upstreamResponse.status === 429 ? 'provider_rate_limited' : 'provider_error';
      console.warn(`[agnes-local] provider status=${upstreamResponse.status} elapsedMs=${Date.now() - started}`);
      sendJson(request, response, status, publicError(status, code, status === 429 ? 'Agnes is rate-limited; try again later' : 'Agnes image generation failed'));
      return;
    }
    const result = upstream.result;
    console.log(`[agnes-local] success elapsedMs=${Date.now() - started}`);
    sendJson(request, response, 200, { ok: true, provider: 'agnes', model: MODEL, modelId, result });
  } catch (error) {
    const isTimeout = error?.name === 'AbortError';
    const status = error?.status || (isTimeout ? 504 : 500);
    const code = isTimeout ? 'provider_timeout' : error?.code || 'local_error';
    console.warn(`[agnes-local] error code=${code} elapsedMs=${Date.now() - started}`);
    sendJson(request, response, status, publicError(status, code, isTimeout ? 'Agnes request timed out' : 'Local Agnes request failed'));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[agnes-local] listening on http://${HOST}:${PORT}`);
  console.log(`[agnes-local] model=${MODEL} keyConfigured=${Boolean(process.env.AGNES_API_KEY)}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
