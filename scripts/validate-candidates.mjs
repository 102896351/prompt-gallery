#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

const PUBLIC_BASE = (process.env.R2_PUBLIC_BASE_URL || 'https://media.aiartspell.art').replace(/\/$/, '');
const SOURCE_HOST = 'img1.aiart.pics';
const SOURCE_PREFIX = '/images/prompts/';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i].replace(/^--/, '');
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function visit(value, callback, path = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, callback, [...path, index]));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.src === 'string' && path.includes('images')) callback(value.src, path, 'src');
  if (typeof value.image === 'string' && path.includes('prompts')) callback(value.image, path, 'image');
  if (typeof value.cover === 'string') callback(value.cover, path, 'cover');
  Object.entries(value).forEach(([key, child]) => visit(child, callback, [...path, key]));
}

function validateUrl(value) {
  if (value.startsWith('/prompts/') && !value.includes('..')) return { kind: 'local' };
  let url;
  try { url = new URL(value); } catch { return { kind: 'invalid', reason: 'not a URL or local path' }; }
  if (url.protocol !== 'https:') return { kind: 'invalid', reason: 'only HTTPS is allowed' };
  if (url.hostname === new URL(PUBLIC_BASE).hostname) return { kind: 'r2' };
  if (url.hostname === SOURCE_HOST && url.pathname.startsWith(SOURCE_PREFIX)) return { kind: 'source' };
  return { kind: 'invalid', reason: `host/path is not allowlisted: ${url.hostname}${url.pathname}` };
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.input) throw new Error('--input is required');
  const raw = JSON.parse(await readFile(args.input, 'utf8'));
  const candidates = Array.isArray(raw) ? raw : raw.candidates;
  if (!Array.isArray(candidates)) throw new Error('Input must be an array or contain candidates[]');
  const errors = [];
  const seen = new Map();
  for (const candidate of candidates) {
    const values = [];
    visit(candidate, (value, path, field) => values.push({ value, path, field }));
    for (const entry of values) {
      const result = validateUrl(entry.value);
      if (result.kind === 'invalid') errors.push({ slug: candidate.slug, field: entry.field, value: entry.value, reason: result.reason });
      if (result.kind !== 'local') {
        if (seen.has(entry.value)) seen.get(entry.value).push(candidate.slug);
        else seen.set(entry.value, [candidate.slug]);
      }
    }
    if (!candidate.slug || !/^\S+$/.test(candidate.slug) || /[\\/]/.test(candidate.slug)) {
      errors.push({ slug: candidate.slug, reason: 'invalid slug' });
    }
  }
  const duplicateUrls = [...seen.entries()].filter(([, slugs]) => slugs.length > 1).map(([url, slugs]) => ({ url, slugs }));
  const report = { candidates: candidates.length, invalid: errors, duplicateUrls, r2Base: PUBLIC_BASE };
  if (args.report) await writeFile(args.report, JSON.stringify(report, null, 2) + '\n');
  console.log(`[validate] candidates=${candidates.length} invalid=${errors.length} duplicateUrls=${duplicateUrls.length}`);
  if (errors.length) {
    console.error(JSON.stringify(errors.slice(0, 20), null, 2));
    process.exitCode = 2;
  }
}

main().catch((error) => { console.error('[validate] Fatal:', error); process.exit(1); });
