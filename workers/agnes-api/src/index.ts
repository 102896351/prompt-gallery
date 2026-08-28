export interface Env {
  AGNES_API_KEY: string;
  AGNES_API_BASE_URL?: string;
  AGNES_IMAGE_MODEL?: string;
  AGNES_REQUEST_TIMEOUT_MS?: string;
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_API_BASE = 'https://apihub.agnes-ai.com/v1';
const DEFAULT_MODEL = 'agnes-image-2.1-flash';
const MAX_PROMPT_LENGTH = 4_000;
const MAX_IMAGES = 4;
const MAX_TOTAL_BODY_BYTES = 20 * 1024 * 1024;
const MAX_DATA_URI_BYTES = 5 * 1024 * 1024;
const MAX_UPSTREAM_RESPONSE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_RATIOS = new Set(['1:1', '16:9', '9:16']);
const DEFAULT_ORIGINS = new Set(['https://aiartspell.art', 'https://www.aiartspell.art']);

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function configuredOrigins(env: Env): Set<string> {
  const values = env.ALLOWED_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set(values?.length ? values : DEFAULT_ORIGINS);
}

function corsHeaders(request: Request, env: Env): Headers {
  const headers = new Headers(jsonHeaders);
  const origin = request.headers.get('Origin');
  if (origin && configuredOrigins(env).has(origin)) {
    headers.set('access-control-allow-origin', origin);
    headers.set('access-control-allow-credentials', 'false');
  }
  headers.set('access-control-allow-methods', 'GET, POST, OPTIONS');
  headers.set('access-control-allow-headers', 'content-type');
  headers.set('vary', 'Origin');
  return headers;
}

function respond(request: Request, env: Env, status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status, headers: corsHeaders(request, env) });
}

function errorPayload(status: number, code: string, message: string) {
  return { error: { code, message }, status };
}

function fail(status: number, code: string, message: string): never {
  throw Object.assign(new Error(message), { status, code });
}

function timeoutMs(env: Env): number {
  const value = Number(env.AGNES_REQUEST_TIMEOUT_MS || 90_000);
  return Math.min(Math.max(Number.isFinite(value) ? value : 90_000, 5_000), 300_000);
}

function validateDataUriImage(value: string, index: number): void {
  const match = value.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match || !ALLOWED_MIME.has(match[1].toLowerCase())) {
    fail(400, 'invalid_image', `image[${index}] must be a JPEG, PNG, or WebP Data URI`);
  }
  const clean = match[2].replace(/\s+/g, '');
  let decoded: Uint8Array;
  try {
    const binary = atob(clean);
    decoded = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    fail(400, 'invalid_image', `image[${index}] contains invalid base64`);
  }
  if (!decoded.length || decoded.byteLength > MAX_DATA_URI_BYTES) {
    fail(400, 'invalid_image', `image[${index}] exceeds the 5MB decoded limit`);
  }
  const mime = match[1].toLowerCase();
  const startsWithBytes = (bytes: number[]) => bytes.every((byte, i) => decoded[i] === byte);
  const startsWithAscii = (text: string, offset = 0) => text.split('').every((char, i) => decoded[offset + i] === char.charCodeAt(0));
  const signatures: Record<string, boolean> = {
    'image/jpeg': startsWithBytes([0xff, 0xd8, 0xff]),
    'image/png': startsWithBytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    'image/webp': startsWithAscii('RIFF') && startsWithAscii('WEBP', 8),
  };
  if (!signatures[mime]) fail(400, 'invalid_image', `image[${index}] content does not match its MIME type`);
}

function validateImage(value: unknown, index: number): void {
  if (typeof value !== 'string') fail(400, 'invalid_image', `image[${index}] must be a string`);
  if (!value.startsWith('data:')) fail(400, 'invalid_image', `image[${index}] must be a JPEG, PNG, or WebP Data URI`);
  validateDataUriImage(value, index);
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_TOTAL_BODY_BYTES) fail(413, 'request_too_large', 'Request body is too large');
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_TOTAL_BODY_BYTES) fail(413, 'request_too_large', 'Request body is too large');
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) fail(400, 'invalid_json', 'Request must be a JSON object');
    return parsed as Record<string, unknown>;
  } catch {
    fail(400, 'invalid_json', 'Request must contain valid JSON');
  }
}

async function readUpstreamJson(response: Response, signal: AbortSignal): Promise<unknown> {
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > MAX_UPSTREAM_RESPONSE_BYTES) fail(502, 'provider_response_too_large', 'Agnes response is too large');
  if (!response.body) return response.json();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    if (signal.aborted) fail(504, 'provider_timeout', 'Agnes request timed out');
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_UPSTREAM_RESPONSE_BYTES) {
      await reader.cancel();
      fail(502, 'provider_response_too_large', 'Agnes response is too large');
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(merged));
  } catch {
    fail(502, 'provider_invalid_response', 'Agnes returned an invalid response');
  }
}

async function generate(request: Request, env: Env): Promise<Response> {
  if (!env.AGNES_API_KEY) return respond(request, env, 503, errorPayload(503, 'missing_configuration', 'Agnes API is not configured'));
  const body = await readJson(request);
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) fail(400, 'invalid_prompt', 'Prompt is required');
  if (prompt.length > MAX_PROMPT_LENGTH) fail(400, 'prompt_too_long', `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer`);

  const images = Array.isArray(body.image) ? body.image : body.image ? [body.image] : [];
  if (images.length > MAX_IMAGES) fail(400, 'too_many_images', `At most ${MAX_IMAGES} images allowed`);
  images.forEach(validateImage);

  const ratio = typeof body.ratio === 'string' && body.ratio.trim() ? body.ratio.trim() : undefined;
  if (ratio && !ALLOWED_RATIOS.has(ratio)) fail(400, 'invalid_ratio', 'Unsupported aspect ratio');
  const model = typeof body.model === 'string' && body.model.trim() ? body.model.trim() : (env.AGNES_IMAGE_MODEL || DEFAULT_MODEL);
  if (model !== (env.AGNES_IMAGE_MODEL || DEFAULT_MODEL)) fail(400, 'unsupported_model', 'The selected image model is not available');

  const apiBase = (env.AGNES_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, '');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs(env));
  try {
    const upstream = await fetch(`${apiBase}/images/generations`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.AGNES_API_KEY}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        ...(ratio ? { ratio } : {}),
        extra_body: {
          ...(images.length ? { image: images } : {}),
          response_format: 'url',
        },
      }),
      signal: controller.signal,
    });
    if (!upstream.ok) {
      const status = upstream.status === 401 ? 502 : upstream.status === 429 ? 429 : upstream.status >= 500 ? 502 : 400;
      const code = upstream.status === 401 ? 'provider_auth_error' : upstream.status === 429 ? 'provider_rate_limited' : 'provider_error';
      console.warn(`[agnes-worker] provider status=${upstream.status}`);
      return respond(request, env, status, errorPayload(status, code, status === 429 ? 'Agnes is rate-limited; try again later' : 'Agnes image generation failed'));
    }
    const result = await readUpstreamJson(upstream, controller.signal);
    return respond(request, env, 200, { ok: true, provider: 'agnes', model, result });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return respond(request, env, 504, errorPayload(504, 'provider_timeout', 'Agnes request timed out'));
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    if (url.pathname === '/api/agnes/health' && request.method === 'GET') {
      return respond(request, env, 200, {
        ok: true,
        provider: 'agnes',
        model: env.AGNES_IMAGE_MODEL || DEFAULT_MODEL,
        configured: Boolean(env.AGNES_API_KEY),
        persistentStorage: false,
      });
    }
    if (url.pathname !== '/api/agnes/v1/generate-image') {
      return respond(request, env, 404, errorPayload(404, 'not_found', 'Agnes endpoint not found'));
    }
    if (request.method !== 'POST') return respond(request, env, 405, errorPayload(405, 'method_not_allowed', 'Use POST for image generation'));
    try {
      return await generate(request, env);
    } catch (error) {
      const status = typeof error === 'object' && error && 'status' in error && typeof error.status === 'number' ? error.status : 500;
      const code = typeof error === 'object' && error && 'code' in error && typeof error.code === 'string' ? error.code : 'worker_error';
      const message = status >= 500 ? 'Agnes image generation failed' : error instanceof Error ? error.message : 'Invalid request';
      console.warn(`[agnes-worker] error code=${code} status=${status}`);
      return respond(request, env, status, errorPayload(status, code, message));
    }
  },
};
