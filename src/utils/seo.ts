// ============================================================
//  详情页 SEO 工具函数
//  -----------------------------------------------------------
//  基于 Google 关键词数据优化 title + meta description：
//  - title 加引擎名关键词（nano banana pro prompt / midjourney prompt 等）
//  - description 不用含占位符的 prompt 原文，改用 verdict + 引擎 + 卖点
// ============================================================

import type { Prompt } from '../data/prompts';

/** 引擎 key -> SEO 关键词（Google 高搜索量词） */
const ENGINE_SEO: Record<string, string> = {
  'nano-banana-pro': 'Nano Banana Pro',
  gemini: 'Gemini',
  midjourney: 'Midjourney',
  flux: 'Flux',
  'stable-diffusion': 'Stable Diffusion',
  'chatgpt-image': 'ChatGPT',
  sora: 'Sora',
  veo: 'Veo',
  kling: 'Kling',
  doubao: 'Doubao',
  jimeng: 'Jimeng',
  tongyi: 'Tongyi Wanxiang',
  wenxin: 'Wenxin Yige',
  zhipu: 'Zhipu',
  other: 'AI Image',
};

/**
 * 详情页 SEO title
 * 模板: {promptTitle} - {engine} Prompt · Ai Art Spell
 * 引擎优先取 prompt.engines 第一个有 SEO 值的；兜底 "AI Image"
 */
export function getDetailSeoTitle(prompt: Prompt, displayTitle: string, locale: 'en' | 'zh' = 'en'): string {
  // 找第一个有 SEO 名的引擎
  let engineName = 'AI Image';
  for (const k of prompt.engines) {
    if (ENGINE_SEO[k]) {
      engineName = ENGINE_SEO[k];
      break;
    }
  }
  // 注意：Base.astro 会自动追加 "· Ai Art Spell"，这里只返回 "{title} - {engine} Prompt"
  if (locale === 'zh') {
    return `${displayTitle} - ${engineName} 提示词`;
  }
  return `${displayTitle} - ${engineName} Prompt`;
}

/**
 * 判断 tagline 是否"干净"（可安全用于 meta description）
 * - 不含 [INSERT / [{ 等占位符
 * - 不等于 title
 * - 长度 >= 30 字符
 * - 不以 "提示词" / "分享" / "---" 开头
 */
function isTaglineClean(tagline: string, title: string): boolean {
  if (!tagline || tagline.length < 30) return false;
  if (tagline === title) return false;
  if (/\[INSERT|\[\{|placeholder/i.test(tagline)) return false;
  if (/^(提示词|分享|---|🍌|#)/.test(tagline.trim())) return false;
  return true;
}

/**
 * 详情页 SEO meta description
 * 策略:
 *   1. tagline 干净 -> 用 tagline + 引擎 + 卖点
 *   2. tagline 不干净 -> 用 verdict + 引擎 + 卖点
 *   3. verdict 也空 -> 用 category + 引擎合成
 * 最终长度控制在 120-160 字符（Google 摘要最佳长度）
 */
export function getDetailSeoDescription(prompt: Prompt, displayTitle: string, locale: 'en' | 'zh' = 'en'): string {
  // 找引擎名
  let engineName = 'AI image';
  for (const k of prompt.engines) {
    if (ENGINE_SEO[k]) {
      engineName = ENGINE_SEO[k];
      break;
    }
  }

  // 取干净的内容段
  // EN locale 优先用 taglineEn（如果有），ZH 用 tagline
  const tagline = locale === 'en' ? (prompt.taglineEn || prompt.tagline) : prompt.tagline;
  let body = '';
  if (isTaglineClean(tagline, displayTitle)) {
    body = tagline;
  } else if (prompt.verdict && prompt.verdict.length > 20) {
    body = prompt.verdict;
  } else {
    // fallback: 用 prompt 前 80 字符（去掉占位符）
    body = (prompt.prompt || '')
      .replace(/\[INSERT[^\]]*\]/gi, '[...]')
      .replace(/\n/g, ' ')
      .slice(0, 80)
      .trim();
  }

  // 截断 body 到 100 字符，留空间给后缀
  if (body.length > 100) {
    body = body.slice(0, 97).trim() + '...';
  }

  if (locale === 'zh') {
    const suffix = `一键复制，${engineName} 提示词。`;
    const desc = `${body} ${suffix}`;
    return desc.slice(0, 160);
  }

  const suffix = `One-click copy, ${engineName} prompt.`;
  const desc = `${body} ${suffix}`;
  return desc.slice(0, 160);
}
