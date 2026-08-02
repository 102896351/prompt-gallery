// ============================================================
//  inject-titleEn.mjs
//  把翻译好的 titleEn 注入到 src/data/prompts.ts 每个 entry
//
//  用法: node scripts/inject-titleEn.mjs
//  - 读 /tmp/titles-translated.json（slug -> titleEn 映射）
//  - 读 src/data/prompts.ts
//  - 在每个 entry 的 title: "..." 后面插入 titleEn: "..."
//  - 如果 entry 已有 titleEn，跳过（idempotent）
//  - 写回 src/data/prompts.ts
// ============================================================

import { readFile, writeFile } from 'node:fs/promises';

const TRANSLATION_FILE = process.env.TRANSLATION_FILE || 'C:/tmp/titles-translated.json';
const PROMPTS_FILE = 'src/data/prompts.ts';

async function main() {
  console.error(`[inject] reading ${TRANSLATION_FILE}`);
  const transRaw = await readFile(TRANSLATION_FILE, 'utf8');
  const translations = JSON.parse(transRaw);
  const map = new Map(translations.map(t => [t.slug, t.titleEn]));
  console.error(`[inject] ${map.size} translation entries loaded`);

  console.error(`[inject] reading ${PROMPTS_FILE}`);
  const src = await readFile(PROMPTS_FILE, 'utf8');

  // 对每个 slug 注入 titleEn 字段
  // 匹配 pattern: slug: "...",\n    title: "...",
  // 在 title 行后面插入 titleEn: "..."
  let modified = src;
  let injected = 0;
  let skipped = 0;
  let emptyEn = 0;

  for (const [slug, titleEn] of map) {
    if (!titleEn || titleEn.length === 0) {
      emptyEn++;
      continue;
    }
    // 找 slug 行
    const slugEsc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const slugRegex = new RegExp(
      `(slug:\\s*"${slugEsc}",\\s*\\n\\s*title:\\s*"[^"]*",)(\\n)`,
    );
    const match = modified.match(slugRegex);
    if (!match) {
      skipped++;
      continue;
    }
    // 检查是否已经有 titleEn（紧跟 title 行）
    // 提取 entry 的后续几行
    const startIdx = match.index + match[0].length;
    const lookahead = modified.slice(startIdx, startIdx + 200);
    if (/\btitleEn:/.test(lookahead)) {
      skipped++;
      continue;
    }
    // 插入 titleEn
    const escapedEn = titleEn.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const replacement = `${match[1]}\n    titleEn: "${escapedEn}",${match[2]}`;
    modified = modified.replace(slugRegex, replacement);
    injected++;
  }

  console.error(`[inject] injected: ${injected}, skipped (already has or not found): ${skipped}, empty: ${emptyEn}`);

  await writeFile(PROMPTS_FILE, modified, 'utf8');
  console.error(`[inject] wrote ${PROMPTS_FILE}`);
}

main().catch((err) => {
  console.error('[inject] Fatal:', err);
  process.exit(1);
});