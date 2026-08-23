#!/usr/bin/env node
// ============================================================
//  select-fresh.cjs
//  -----------------------------------------------------------
//  从 candidates 里选出 N 条不在 existing 中的新 prompt
//  按 score（图片数 + 源 URL + 长度）排序，限制每个作者最多 3 条
//
//  Usage:
//    node scripts/select-fresh.cjs \
//      --candidates /tmp/curate/candidates.json \
//      --existing src/data/prompts.ts \
//      --output /tmp/curate/selected.json \
//      --limit 30
// ============================================================

const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i += 2) {
    const k = args[i].replace(/^--/, '');
    opts[k] = args[i + 1];
  }
  return opts;
}

function score(c) {
  const p = c.prompt || '';
  const hasImage = (c.images || []).length > 0;
  const hasSource = !!(c.sourceUrl || (c.source && c.source.sourceUrl));
  const lenScore = Math.min(p.length, 4000) / 100;
  return (hasImage ? 10 : 0) + (hasSource ? 5 : 0) + lenScore;
}

function getExistingSlugs(promptsTsPath) {
  const src = fs.readFileSync(promptsTsPath, 'utf8');
  const set = new Set();
  const re = /^\s*slug:\s*"([^"]+)"/gm;
  let m;
  while ((m = re.exec(src)) !== null) set.add(m[1]);
  return set;
}

function main() {
  const opts = parseArgs();
  const limit = parseInt(opts.limit || '30', 10);
  const excludedSlugs = new Set(String(opts['exclude-slugs'] || '').split(',').map(s => s.trim()).filter(Boolean));

  const candidates = JSON.parse(fs.readFileSync(opts.candidates, 'utf8')).candidates;
  const existingSlugs = getExistingSlugs(opts.existing);
  console.log(`[select-fresh] ${candidates.length} candidates, ${existingSlugs.size} existing slugs`);

  const fresh = candidates.filter(c => !existingSlugs.has(c.slug) && !excludedSlugs.has(c.slug));
  console.log(`[select-fresh] ${fresh.length} fresh (not in existing)`);

  const scored = fresh
    .map(c => ({ ...c, _s: score(c) }))
    .sort((a, b) => b._s - a._s);

  const picked = [];
  const authorCount = new Map();
  const MAX_PER_AUTHOR = 3;
  for (const c of scored) {
    const auth = (c.author && c.author.name) || 'unknown';
    const cnt = authorCount.get(auth) || 0;
    if (cnt >= MAX_PER_AUTHOR) continue;
    picked.push(c);
    authorCount.set(auth, cnt + 1);
    if (picked.length >= limit) break;
  }

  console.log(`[select-fresh] picked ${picked.length} (limit ${limit}, ${authorCount.size} unique authors)`);
  fs.writeFileSync(opts.output, JSON.stringify(picked, null, 2));
}

main();