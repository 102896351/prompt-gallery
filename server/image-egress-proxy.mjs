#!/usr/bin/env node
import { createServer } from 'node:http';

const HOST = process.env.IMAGE_PROXY_HOST || '0.0.0.0';
const PORT = Number(process.env.IMAGE_PROXY_PORT || 80);
const API_BASE = (process.env.AGNES_API_BASE_URL || 'https://apihub.agnes-ai.com/v1').replace(/\/$/, '');
const INTERNAL_PROXY_TOKEN = process.env.INTERNAL_PROXY_TOKEN || '';
const MAX_BODY_BYTES = 20 * 1024 * 1024;
const MAX_PROMPT_LENGTH = 4_000;
const MAX_IMAGES = 4;
const ALLOWED_RATIOS = new Set(['1:1', '16:9', '9:16']);

function json(status, payload, extra = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });
}

function errorPayload(status, code, message) {
  return { error: { code, message }, status };
}

async function readBody(request) {
  const contentLength = Number(request.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) throw Object.assign(new Error('Request body is too large'), { status: 413, code: 'request_too_large' });
  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) throw Object.assign(new Error('Request body is too large'), { status: 413, code: 'request_too_large' });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    throw Object.assign(new Error('Request must contain valid JSON'), { status: 400, code: 'invalid_json' });
  }
}

async function fetchUpstream(body, apiKey) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 180_000);
  try {
    return await fetch(`${API_BASE}/images/generations`, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/health' && request.method === 'GET') {
    const payload = { ok: true, service: 'anonymous-image-egress-proxy', persistentStorage: false };
    const result = json(200, payload);
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
    return;
  }
  if (url.pathname !== '/v1/generate-image') {
    const result = json(404, errorPayload(404, 'not_found', 'Image endpoint not found'));
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
    return;
  }
  if (request.method !== 'POST') {
    const result = json(405, errorPayload(405, 'method_not_allowed', 'Use POST for image generation'));
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
    return;
  }
  if (!INTERNAL_PROXY_TOKEN || request.headers['x-internal-proxy-token'] !== INTERNAL_PROXY_TOKEN) {
    const result = json(403, errorPayload(403, 'forbidden', 'Proxy authentication required'));
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
    return;
  }
  const apiKey = request.headers['x-agnes-api-key'];
  if (typeof apiKey !== 'string' || !apiKey) {
    const result = json(503, errorPayload(503, 'missing_configuration', 'Image provider is not configured'));
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
    return;
  }
  try {
    const body = await readBody(request);
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) throw Object.assign(new Error('Prompt is required'), { status: 400, code: 'invalid_prompt' });
    if (prompt.length > MAX_PROMPT_LENGTH) throw Object.assign(new Error(`Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer`), { status: 400, code: 'prompt_too_long' });
    const images = Array.isArray(body.image) ? body.image : body.image ? [body.image] : [];
    if (images.length > MAX_IMAGES) throw Object.assign(new Error(`At most ${MAX_IMAGES} images allowed`), { status: 400, code: 'too_many_images' });
    if (body.ratio && !ALLOWED_RATIOS.has(body.ratio)) throw Object.assign(new Error('Unsupported aspect ratio'), { status: 400, code: 'invalid_ratio' });
    const upstream = await fetchUpstream({ ...body, prompt, ...(images.length ? { image: images } : {}) }, apiKey);
    const raw = await upstream.text();
    let payload;
    try { payload = JSON.parse(raw); } catch { payload = { error: { code: 'provider_invalid_response', message: 'Image provider returned an invalid response' } }; }
    if (!upstream.ok) {
      const status = upstream.status === 401 ? 502 : upstream.status === 429 ? 429 : upstream.status >= 500 ? 502 : 400;
      const code = upstream.status === 401 ? 'provider_auth_error' : upstream.status === 429 ? 'provider_rate_limited' : 'provider_error';
      const headers = {};
      if (upstream.headers.get('retry-after')) headers['retry-after'] = upstream.headers.get('retry-after');
      const result = json(status, errorPayload(status, code, status === 429 ? 'Image provider request was rate-limited' : 'Image generation failed'), headers);
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(await result.text());
      return;
    }
    const result = json(200, { ok: true, provider: 'image-service', result: payload });
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
  } catch (error) {
    const status = error?.status || (error?.name === 'AbortError' ? 504 : 500);
    const code = error?.code || (error?.name === 'AbortError' ? 'provider_timeout' : 'proxy_error');
    const result = json(status, errorPayload(status, code, status >= 500 ? 'Image generation failed' : error.message || 'Request failed'));
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
  }
});

server.listen(PORT, HOST, () => console.log(`[image-proxy] listening on http://${HOST}:${PORT}`));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
