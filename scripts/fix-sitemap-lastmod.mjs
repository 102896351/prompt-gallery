#!/usr/bin/env node
// ============================================================
//  Sitemap lastmod 修正器
//  -----------------------------------------------------------
//  @astrojs/sitemap 默认给所有 URL 输出同一个 lastmod（构建时刻）。
//  这对 Google 不友好——Google 文档明确指出：lastmod 不准比不写更糟。
//
//  本脚本在 build 之后跑：
//  1. 扫描 dist/prompt/<slug>/index.html 提取 datePublished (Article schema)
//  2. 解析 dist/sitemap-0.xml
//  3. 对每个 /prompt/<slug>/ 条目，把 lastmod 改为该 prompt 的真实 dateAdded
//
//  用法：node scripts/fix-sitemap-lastmod.mjs
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// 1. 收集所有 prompt slug → datePublished 映射
const promptDates = new Map();
const promptDirs = fs.readdirSync(path.join(DIST, 'prompt'), { withFileTypes: true });

for (const dir of promptDirs) {
  if (!dir.isDirectory()) continue;
  const slug = dir.name;
  // 读 EN 版（含 datePublished JSON-LD）
  const enHtmlPath = path.join(DIST, 'prompt', slug, 'index.html');
  if (!fs.existsSync(enHtmlPath)) continue;
  const html = fs.readFileSync(enHtmlPath, 'utf8');
  const match = html.match(/"datePublished":"([^"]+)"/);
  if (match) {
    promptDates.set(slug, match[1]);
  }
}

console.log(`Found ${promptDates.size} prompts with datePublished`);

// 2. 读 sitemap-0.xml
const sitemapPath = path.join(DIST, 'sitemap-0.xml');
let xml = fs.readFileSync(sitemapPath, 'utf8');

// 3. 替换 prompt 详情页的 lastmod
// 匹配形如：<loc>https://aiartspell.art/prompt/<slug>/</loc>...<lastmod>2026-08-04T...</lastmod>
// 策略：用 URL 路径定位 slug，再从 promptDates 查真实日期

let updatedCount = 0;
xml = xml.replace(
  /(<loc>https:\/\/aiartspell\.art\/prompt\/([^/]+)\/<\/loc>)(<lastmod>[^<]+<\/lastmod>)/g,
  (_, urlTag, slug, lastmodTag) => {
    const realDate = promptDates.get(slug);
    if (!realDate) return _; // 没找到就保留原 lastmod
    updatedCount++;
    // 统一为完整 ISO datetime 格式（Google 推荐：W3C Datetime）
    const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(realDate)
      ? `${realDate}T00:00:00.000Z`
      : realDate;
    return `${urlTag}<lastmod>${isoDate}</lastmod>`;
  }
);

// 4. 同步修 sitemap-index.xml（指向 sitemap-0 的 lastmod）
const sitemapIndexPath = path.join(DIST, 'sitemap-index.xml');
if (fs.existsSync(sitemapIndexPath)) {
  let idxXml = fs.readFileSync(sitemapIndexPath, 'utf8');
  // sitemap-index 里 lastmod 用最新 prompt 的 dateAdded（内容变化的最佳代理）
  const dates = [...promptDates.values()].map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t));
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates)).toISOString() : new Date().toISOString();
  idxXml = idxXml.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${maxDate}</lastmod>`);
  fs.writeFileSync(sitemapIndexPath, idxXml, 'utf8');
  console.log(`sitemap-index.xml lastmod → ${maxDate}`);
}

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`sitemap-0.xml: updated ${updatedCount} /prompt/ entries with real dateAdded`);