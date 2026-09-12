// ============================================================
//  i18n 路由与文案
//  - UI 文案分两个文件：zh.ts / en.ts
//  - Prompt 原文语言与 UI 语言无关，保留作者原文
// ============================================================

export type Locale = 'en' | 'zh';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'zh'];
export const DEFAULT_LOCALE: Locale = 'en';

/** 从 URL pathname 推断 locale：/zh/... → 'zh'，其他 → 'en' */
export function getLocaleFromPath(pathname: string): Locale {
  const normalized = pathname.replace(/\/+$/, '/');
  if (normalized === '/zh' || normalized === '/zh/' || normalized.startsWith('/zh/')) {
    return 'zh';
  }
  return 'en';
}

/** 将 pathname 规范化为站内最终 URL 格式：根路径为 /，其他路径统一带尾斜杠。 */
export function normalizePathname(pathname: string): string {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutTrailingSlashes = withLeadingSlash.replace(/\/+$/, '');
  return withoutTrailingSlashes ? `${withoutTrailingSlashes}/` : '/';
}

/** 当前 locale 下，URL 切换到对端 locale 的等价路径 */
export function swapLocale(pathname: string, current: Locale): string {
  const normalized = normalizePathname(pathname);
  // /prompt/foo/ ↔ /zh/prompt/foo/
  // /about/ ↔ /zh/about/
  if (current === 'zh') {
    // 去掉前缀 /zh
    const stripped = normalized.replace(/^\/zh(?=\/|$)/, '');
    return normalizePathname(stripped || '/');
  }

  // 加前缀 /zh
  if (normalized === '/') return '/zh/';
  return normalizePathname(`/zh${normalized}`);
}

export { en } from './en';
export { zh } from './zh';
export type Messages = typeof import('./en').en;