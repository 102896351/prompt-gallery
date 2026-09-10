#!/usr/bin/env node
// ============================================================
//  sitemap 生成器（构建后运行）
//  -----------------------------------------------------------
//  为什么不用 @astrojs/sitemap 的产物：
//  该集成在 astro:build:done 钩子里写 sitemap，而钩子在
//  cleanServerOutput() 之后才执行。在受限环境（删除守卫会拦截
//  Astro 清理 dist/pages/*.mjs）下该步骤抛错，钩子永远不执行，
//  结果 sitemap 一直是上一版 —— 新页面进不去，老页面出不来。
//
//  本脚本完全从构建产物（dist/**/index.html）推导 sitemap：
//   - URL 取每页 <link rel="canonical">（天然正确处理中文 slug 编码）
//   - noindex 页面直接排除（sitemap 与 robots meta 不再自相矛盾）
//   - lastmod 取 JSON-LD datePublished；没有的页面**不写** lastmod
//     （Google：不准的 lastmod 比不写更糟）
//   - image:image 注入 og:image —— 站点是图片型内容，此前 image:loc = 0
//   - hreflang 双向 alternates（en / zh-Hans）
//   - priority/changefreq 按页面类型分级（覆盖新增的聚合层）
//
//  用法：node scripts/generate-sitemap.mjs
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://aiartspell.art';

// ---------- 1. 收集所有 HTML 页面 ----------
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

const htmlFiles = walk(DIST);

// ---------- 2. 解析每页元信息 ----------
const pages = new Map(); // url -> { url, canonical, noindex, lastmod?, image?, isZh }

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const head = html.slice(0, 60000); // head + JSON-LD 足够

  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) continue; // 无 canonical 的页面不进 sitemap
  if (canonical.includes('/404')) continue;
  if (canonical.includes('/tools/agnes-image')) continue;

  const noindex = /<meta name="robots" content="noindex/.test(head);

  const lastmod = head.match(/"datePublished":"([^"]+)"/)?.[1];

  const rawImage = head.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  // 只收真实内容图：默认 OG 占位图（og-default）对图片搜索没有价值，
  // 全站重复提交 1400+ 次反而是噪音。
  const image =
    rawImage && rawImage.startsWith('http') && !/og-default/.test(rawImage)
      ? rawImage
      : undefined;

  pages.set(canonical, {
    url: canonical,
    noindex,
    lastmod,
    image,
    isZh: new URL(canonical).pathname.startsWith('/zh/'),
  });
}

const submitted = [...pages.values()].filter((p) => !p.noindex);

// ---------- 3. hreflang 配对 ----------
function sibling(page) {
  const u = new URL(page.url);
  if (page.isZh) {
    u.pathname = u.pathname.replace(/^\/zh/, '') || '/';
  } else {
    u.pathname = `/zh${u.pathname}`;
  }
  return u.href;
}

// ---------- 4. priority / changefreq ----------
function grade(page) {
  const p = new URL(page.url).pathname.replace(/^\/zh/, '');
  // 分页页：Astro 的 [...page] 产出 /xxx/2/ 这种纯数字尾段
  const isPage2 = /\/\d+\/$/.test(p);

  if (p === '/') return { priority: '1.0', changefreq: 'daily' };
  if (isPage2) return { priority: '0.4', changefreq: 'monthly' };

  // 聚合层：全量 / 分类 / 模型
  if (/^\/ai-image-prompts\/$/.test(p)) return { priority: '0.9', changefreq: 'daily' };
  if (/^\/(prompts|models)\/[^/]+\/$/.test(p)) return { priority: '0.9', changefreq: 'weekly' };

  if (p.startsWith('/prompt/')) return { priority: '0.8', changefreq: 'weekly' };
  if (p.startsWith('/collections')) return { priority: '0.7', changefreq: 'weekly' };
  if (p.startsWith('/tools')) return { priority: '0.7', changefreq: 'weekly' };
  return { priority: '0.5', changefreq: 'monthly' };
}

// ---------- 5. 生成 XML ----------
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const blocks = [];
let imageCount = 0;

for (const page of submitted) {
  const { priority, changefreq } = grade(page);
  const parts = [`<loc>${esc(page.url)}</loc>`];

  if (page.lastmod) {
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(page.lastmod)
      ? `${page.lastmod}T00:00:00.000Z`
      : page.lastmod;
    parts.push(`<lastmod>${iso}</lastmod>`);
  }
  parts.push(`<changefreq>${changefreq}</changefreq><priority>${priority}</priority>`);

  // hreflang：仅当对侧页面确实存在且同样可索引时才互指
  const alt = pages.get(sibling(page));
  if (alt && !alt.noindex) {
    const enUrl = page.isZh ? alt.url : page.url;
    const zhUrl = page.isZh ? page.url : alt.url;
    parts.push(
      `<xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>` +
        `<xhtml:link rel="alternate" hreflang="zh-Hans" href="${esc(zhUrl)}"/>`
    );
  }

  if (page.image) {
    imageCount++;
    parts.push(`<image:image><image:loc>${esc(page.image)}</image:loc></image:image>`);
  }

  blocks.push(`<url>${parts.join('')}</url>`);
}

const urlset =
  `<?xml version="1.0" encoding="UTF-8"?>` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` +
  ` xmlns:xhtml="http://www.w3.org/1999/xhtml"` +
  ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
  blocks.join('') +
  `</urlset>`;

fs.writeFileSync(path.join(DIST, 'sitemap-0.xml'), urlset, 'utf8');

// sitemap-index：lastmod = max(全站最新内容日期, 本次构建日期)
// 为什么不只用内容日期：全站 prompt 的 datePublished 集中在同一天（2026-09-04），
// 会让索引 lastmod 长期冻结。Google 会据此判定该 sitemap 未更新而降低重抓频率，
// 导致新页面（尤其新聚合层）被发现得很慢。
// 为什么不用"内容哈希对比"：astro build 会清空 dist，CI 每次都读不到旧文件，
// 判断结果在本地/CI 之间不一致；维护跨构建状态文件又会在 GitHub Actions 的全新
// 工作区里失效。sitemap-index 的 lastmod 语义是「该 sitemap 文件最后修改时间」，
// 而它每次构建确实被重新生成，故取构建日期是准确的。
// 注意：URL 级的 lastmod 仍严格取 JSON-LD datePublished，不受此影响。
const contentDates = submitted
  .map((p) => p.lastmod)
  .filter(Boolean)
  .map((d) => new Date(d).getTime())
  .filter((t) => !Number.isNaN(t));
const latestContent = contentDates.length ? Math.max(...contentDates) : 0;

const buildDay = new Date();
buildDay.setUTCHours(0, 0, 0, 0);
const idxLastmod = new Date(Math.max(latestContent, buildDay.getTime())).toISOString();

const sitemapIndex =
  `<?xml version="1.0" encoding="UTF-8"?>` +
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
  `<sitemap><loc>${ORIGIN}/sitemap-0.xml</loc><lastmod>${idxLastmod}</lastmod></sitemap>` +
  `</sitemapindex>`;

fs.writeFileSync(path.join(DIST, 'sitemap-index.xml'), sitemapIndex, 'utf8');

// ---------- 6. 汇总 ----------
const total = [...pages.values()].length;
const excluded = total - submitted.length;
const withLastmod = submitted.filter((p) => p.lastmod).length;
console.log(`[sitemap] 扫描 ${total} 个页面 → 提交 ${submitted.length}（排除 noindex ${excluded}）`);
console.log(`[sitemap] lastmod ${withLastmod} 条，image:loc ${imageCount} 条，index lastmod ${idxLastmod}`);
