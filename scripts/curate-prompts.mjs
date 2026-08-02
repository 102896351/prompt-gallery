// ============================================================
//  curate-prompts.mjs
//  阶段 B：从 candidates.json 精选出 200-500 条高质量 prompt
//
//  用法:
//    node scripts/curate-prompts.mjs --mode curate                 # 全量重选
//    node scripts/curate-prompts.mjs --mode append                 # 增量追加
//    node scripts/curate-prompts.mjs --limit 300                   # 自定义数量
//    node scripts/curate-prompts.mjs --input foo.json --output src/data/prompts.ts
//
//  流程：JSON 容错解析 → 强去重 → 质量评分 → 多样性约束 → 输出 src/data/prompts.ts
// ============================================================

import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import JSON5 from 'json5';

// ---------- CLI args ----------
function parseArgs(argv) {
  const args = { mode: 'curate', limit: 300, input: null, output: null, prBody: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--mode') args.mode = argv[++i];
    else if (a === '--limit') args.limit = parseInt(argv[++i], 10);
    else if (a === '--input') args.input = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--pr-body') args.prBody = argv[++i];
  }
  return args;
}

// ---------- helpers ----------

/**
 * JSON 容错解析：标准 → 括号扫描 → JSON5
 */
function parseStructured(raw, lang) {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, parsed: null, jsonText: null, prefix: null };

  // 1. 标准 JSON
  try {
    return { ok: true, parsed: JSON.parse(trimmed), jsonText: trimmed, prefix: null, mode: 'json' };
  } catch {}

  // 2. 括号扫描
  const start = trimmed.indexOf('{');
  if (start < 0) return { ok: false, parsed: null, jsonText: null, prefix: trimmed };
  const end = findMatchingObjectEnd(trimmed, start);
  if (end < 0) return { ok: false, parsed: null, jsonText: null, prefix: trimmed.slice(0, start) };

  const candidate = trimmed.slice(start, end + 1);
  try {
    return { ok: true, parsed: JSON.parse(candidate), jsonText: candidate, prefix: trimmed.slice(0, start).trim() || null, mode: 'extracted-json' };
  } catch {}

  // 3. JSON5（带注释、尾逗号等）
  try {
    return { ok: true, parsed: JSON5.parse(candidate), jsonText: candidate, prefix: trimmed.slice(0, start).trim() || null, mode: 'json5' };
  } catch (e) {
    return { ok: false, parsed: null, jsonText: candidate, prefix: trimmed.slice(0, start).trim() || null, error: String(e), mode: 'invalid' };
  }
}

/**
 * 字符串感知的括号匹配：识别 JSON 字符串和 \ 转义。
 */
function findMatchingObjectEnd(text, start) {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (c === '\\') escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') { inString = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * 强去重 key 优先级：x:statusId > source:url > prompt:url > content:sha256
 */
function canonicalKey(c) {
  if (c.source?.statusId) return `x:${c.source.statusId}`;
  if (c.source?.sourceUrl) return `source:${c.source.sourceUrl}`;
  if (c.promptUrl) return `prompt:${c.promptUrl}`;
  const normalized = (c.rawBlock || '').trim().toLowerCase().replace(/\s+/g, ' ');
  return `content:${createHash('sha256').update(normalized).digest('hex').slice(0, 16)}`;
}

/**
 * 内容规范化（用于相似度比较）：去掉 markdown、URL、空白。
 */
function normalizeForSimilarity(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/@\w+/g, '')
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);
}

/**
 * Token Jaccard 相似度（用于检测模板变体）。
 */
function jaccard(a, b) {
  if (!a || !b) return 0;
  const tok = (s) => new Set(s.split(/\s+/).filter((t) => t.length > 2));
  const A = tok(a);
  const B = tok(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

/**
 * 质量评分（满分 100）
 */
function qualityScore(c) {
  let score = 0;
  score += Math.min(c.images.length, 4) * 4;                  // 最多 4 张图 ×4 = 16
  score += c.codeBlocks[0]?.language === 'json' ? 8 : 0;
  score += c.structured?.ok ? 12 : 0;
  if (c.structured?.parsed) {
    const p = c.structured.parsed;
    if (p.aspect_ratio || p.aspectRatio) score += 5;
    if (p.negative_prompt || p.negativePrompt) score += 5;
  }
  const len = (c.prompt || '').length;
  if (len >= 200) score += 8;
  if (len >= 800) score += 4;
  if (c.placeholders && c.placeholders.length > 0) score += 5;
  if (c.images.length >= 2) score += 4;
  if (c.language === 'en') score += 3;                        // 英文 prompt 更适合国际用户
  // 描述性字数（说明作者用心写了 prompt）
  if (len >= 50) score += 2;
  // 来源链接有效
  if (c.source?.sourceUrl?.startsWith('http')) score += 3;
  return score;
}

/**
 * 多样性筛选
 */
function diversify(candidates, limit, opts = {}) {
  const {
    maxPerAuthor = 4,
    maxPerCluster = 2,
    minJsonShare = 0.20,
    maxJsonShare = 0.45,
  } = opts;

  const sorted = [...candidates].sort((a, b) => b.quality - a.quality);
  const selected = [];
  const authorCount = new Map();
  const clusterCount = new Map();
  const clusterAssign = new Map();
  let jsonCount = 0;

  // 用 union-find 把相似条目聚到同一个 cluster
  const parent = sorted.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (i, j) => { parent[find(i)] = find(j); };

  // 计算相似度矩阵（O(n²)，n=1200 大约 70 万次比较，OK）
  for (let i = 0; i < sorted.length; i++) {
    const simI = normalizeForSimilarity(sorted[i].prompt);
    for (let j = i + 1; j < sorted.length; j++) {
      const simJ = normalizeForSimilarity(sorted[j].prompt);
      if (jaccard(simI, simJ) >= 0.92) union(i, j);
    }
  }
  for (let i = 0; i < sorted.length; i++) clusterAssign.set(i, find(i));

  for (let i = 0; i < sorted.length && selected.length < limit; i++) {
    const c = sorted[i];
    const author = c.source?.authorName || c.authorGroup || 'unknown';
    const isJson = c.codeBlocks[0]?.language === 'json';
    const cluster = clusterAssign.get(i);

    if ((authorCount.get(author) || 0) >= maxPerAuthor) continue;
    if ((clusterCount.get(cluster) || 0) >= maxPerCluster) continue;

    const currentJsonShare = selected.length > 0 ? jsonCount / selected.length : 0;
    if (isJson && selected.length >= 20 && currentJsonShare >= maxJsonShare) continue;
    if (!isJson && selected.length >= 20 && currentJsonShare <= minJsonShare) continue;

    selected.push(c);
    authorCount.set(author, (authorCount.get(author) || 0) + 1);
    clusterCount.set(cluster, (clusterCount.get(cluster) || 0) + 1);
    if (isJson) jsonCount++;
  }

  return selected;
}

/**
 * 推断主分类（基于图片 + 文本 + 引擎）。
 */
function inferCategory(c) {
  const t = (c.title + ' ' + (c.prompt || '')).toLowerCase();
  if (/isometric|architect|建筑|等距|模型|maquette/.test(t)) return '3d-render';
  if (/portrait|人物|肖像|人像/.test(t)) return 'portrait';
  if (/character|角色|人物/.test(t) && !/portrait/.test(t)) return 'character-design';
  if (/product|产品|商品/.test(t)) return 'product';
  if (/infographic|信息图|图表/.test(t)) return 'infographic';
  if (/poster|海报/.test(t)) return 'poster';
  if (/ui|界面|app|网站|web/.test(t)) return 'ui-mockup';
  if (/photo|摄影|写真/.test(t)) return 'photography';
  if (/concept|概念/.test(t)) return 'concept-art';
  if (/illustration|插画|插图/.test(t)) return 'illustration';
  return 'illustration';
}

/**
 * 推断难度（基于 prompt 复杂度）。
 */
function inferDifficulty(c) {
  const len = (c.prompt || '').length;
  const placeholders = c.placeholders?.length || 0;
  if (len < 100 && placeholders === 0) return 1;
  if (len < 300) return 2;
  if (len < 800) return 3;
  if (len < 1500) return 4;
  return 5;
}

/**
 * 自动生成 tagline（编辑部一句话描述，目前用启发式）。
 * ★ 后续可以由人工 review 替换为更精彩的点评
 */
function generateTagline(c, locale) {
  if (c.structured?.ok && c.structured.parsed?.theme) {
    return String(c.structured.parsed.theme).slice(0, 100);
  }
  // 取 prompt 第一句作为 tagline
  const firstLine = (c.prompt || '').split('\n').find((l) => l.trim().length > 10) || '';
  return firstLine.replace(/^["'`]+|["'`]+$/g, '').trim().slice(0, 100);
}

/**
 * 自动生成 verdict（编辑部点评，目前用启发式）。
 */
function generateVerdict(c) {
  const parts = [];
  const engines = c.engines.filter((e) => e !== 'other').join(', ');
  if (engines) parts.push(`Best on ${engines}.`);
  if (c.placeholders?.length > 0) parts.push('Reusable template with placeholders.');
  if (c.structured?.ok) parts.push('Structured JSON prompt with controllable parameters.');
  if (c.images.length >= 3) parts.push('Strong visual evidence.');
  if (c.language === 'zh') parts.push('Chinese-language source.');
  if (parts.length === 0) parts.push('Worth a try.');
  return parts.join(' ');
}

/**
 * 推断 tags。
 */
function inferTags(c) {
  const tags = new Set();
  if (c.placeholders?.length > 0) tags.add('reusable');
  if (c.structured?.ok) tags.add('json-prompt');
  if (c.images.length >= 3) tags.add('visual-rich');
  if (c.language === 'en') tags.add('english');
  if (c.language === 'zh') tags.add('chinese');
  if (c.language === 'ja') tags.add('japanese');
  c.engines.forEach((e) => e !== 'other' && tags.add(e));
  // 限制最多 6 个
  return [...tags].slice(0, 6);
}

/**
 * 生成 dateAdded (YYYY-MM-DD)
 */
function dateAdded(c) {
  if (c.datePath && /^\d{8}$/.test(c.datePath)) {
    return `${c.datePath.slice(0, 4)}-${c.datePath.slice(4, 6)}-${c.datePath.slice(6, 8)}`;
  }
  return new Date().toISOString().slice(0, 10);
}

/**
 * 把精选结果序列化为 TS 文件。
 */
function serializeTs(prompts) {
  const header = `// ============================================================
//  AI Image-Generation Prompts — 精选数据集
//
//  抓取时间：${new Date().toISOString()}
//  条目数：${prompts.length}
//
//  字段说明：
//      slug         URL 唯一标识（直接复用 aiart.pics 原 slug）
//      title        原文标题
//      tagline      编辑部一句话描述
//      category     主分类（详见 PromptStyle）
//      engines      适配的生成引擎
//      difficulty   上手难度 1-5
//      prompt       规范化后的 prompt 文本
//      negativePrompt 反向 prompt（可选）
//      aspectRatio  长宽比（如 "16:9"）
//      rawBlock     原始 code block（含 JSON 风格前缀等），用于"显示原文"
//      images       缩略图列表（URL 引用原图床，不下载）
//      source       作者 + 来源链接
//      dateAdded    加入时间（YYYY-MM-DD）
//      tags         标签
//      verdict      编辑部点评
//      reusable     是否含 [INSERT ...] 类占位符
//      language     prompt 原文语言
//      structuredData 完整 JSON（如果作者给了）
// ============================================================

export type PromptEngine =
  | 'nano-banana-pro' | 'midjourney' | 'chatgpt-image'
  | 'stable-diffusion' | 'flux' | 'sora' | 'veo' | 'kling' | 'other';

export type PromptStyle =
  | 'portrait' | 'illustration' | 'photography' | '3d-render'
  | 'product' | 'infographic' | 'character-design' | 'poster'
  | 'concept-art' | 'ui-mockup' | 'other';

export interface PromptImage {
  src: string;
  alt?: string;
  width?: number;
  isThumb?: boolean;
}

export interface PromptSource {
  authorName: string;
  authorUrl?: string;
  platform: 'X' | 'Xiaohongshu' | 'Discord' | 'Reddit' | 'Other';
  sourceUrl: string;
  statusId?: string;
}

export interface Prompt {
  slug: string;
  title: string;
  tagline: string;
  category: PromptStyle;
  engines: PromptEngine[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  rawBlock?: string;
  images: PromptImage[];
  source: PromptSource;
  dateAdded: string;
  tags: string[];
  verdict: string;
  reusable: boolean;
  language: 'zh' | 'en' | 'ja' | 'other';
  structuredData?: unknown;
}

export const promptCategories: { id: PromptStyle; label: string; description: string }[] = [
  { id: 'portrait',         label: 'Portrait',          description: 'People, faces, characters in portrait style' },
  { id: 'illustration',     label: 'Illustration',      description: 'Hand-drawn, painted, stylized artwork' },
  { id: 'photography',      label: 'Photography',       description: 'Photo-realistic shots, studio lighting' },
  { id: '3d-render',        label: '3D Render',         description: 'Isometric, maquette, CGI, architectural' },
  { id: 'product',          label: 'Product',           description: 'Product shots, packaging, mockups' },
  { id: 'infographic',      label: 'Infographic',       description: 'Diagrams, charts, educational visuals' },
  { id: 'character-design', label: 'Character Design',  description: 'Character sheets, turnarounds, merch' },
  { id: 'poster',           label: 'Poster',            description: 'Posters, covers, editorial layouts' },
  { id: 'concept-art',      label: 'Concept Art',       description: 'World-building, environment art' },
  { id: 'ui-mockup',        label: 'UI Mockup',         description: 'App, web, dashboard layouts' },
  { id: 'other',            label: 'Other',             description: 'Anything that does not fit the above' },
];

export const prompts: Prompt[] = [
`;

  const footer = `];

export function getPromptsByCategory(cat: PromptStyle): Prompt[] {
  return prompts.filter((p) => p.category === cat);
}

export function getFeaturedPrompts(): Prompt[] {
  // 手工精选：跨分类的代表条目（运行时按 score 排序取 top N 也可）
  const featuredSlugs = [
    // 在这里手动放 6-12 个最有代表性的 slug
  ];
  return featuredSlugs
    .map((slug) => prompts.find((p) => p.slug === slug))
    .filter(Boolean) as Prompt[];
}

export function getPromptBySlug(slug: string): Prompt | undefined {
  return prompts.find((p) => p.slug === slug);
}

export function getRelatedPrompts(slug: string, limit = 3): Prompt[] {
  const current = getPromptBySlug(slug);
  if (!current) return [];
  return prompts
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}
`;

  const body = prompts
    .map((p) => {
      const lines = [];
      lines.push('  {');
      lines.push(`    slug: ${JSON.stringify(p.slug)},`);
      lines.push(`    title: ${JSON.stringify(p.title)},`);
      lines.push(`    tagline: ${JSON.stringify(p.tagline)},`);
      lines.push(`    category: ${JSON.stringify(p.category)},`);
      lines.push(`    engines: ${JSON.stringify(p.engines)},`);
      lines.push(`    difficulty: ${p.difficulty},`);
      lines.push(`    prompt: ${JSON.stringify(p.prompt)},`);
      if (p.negativePrompt) lines.push(`    negativePrompt: ${JSON.stringify(p.negativePrompt)},`);
      if (p.aspectRatio) lines.push(`    aspectRatio: ${JSON.stringify(p.aspectRatio)},`);
      if (p.rawBlock) lines.push(`    rawBlock: ${JSON.stringify(p.rawBlock)},`);
      lines.push(`    images: ${JSON.stringify(p.images)},`);
      lines.push(`    source: ${JSON.stringify(p.source)},`);
      lines.push(`    dateAdded: ${JSON.stringify(p.dateAdded)},`);
      lines.push(`    tags: ${JSON.stringify(p.tags)},`);
      lines.push(`    verdict: ${JSON.stringify(p.verdict)},`);
      lines.push(`    reusable: ${p.reusable},`);
      lines.push(`    language: ${JSON.stringify(p.language)},`);
      if (p.structuredData !== undefined) lines.push(`    structuredData: ${JSON.stringify(p.structuredData)},`);
      lines.push('  },');
      return lines.join('\n');
    })
    .join('\n');

  return header + body + '\n' + footer;
}

// ---------- main ----------

async function main() {
  const args = parseArgs(process.argv);

  const inputPath = args.input ?? 'src/data/prompts.candidates.json';
  const outputPath = args.output ?? 'src/data/prompts.ts';

  console.error(`[curate] mode=${args.mode} limit=${args.limit}`);
  console.error(`[curate] reading candidates from ${inputPath}`);

  const raw = await readFile(inputPath, 'utf8');
  const dataset = JSON.parse(raw);
  let candidates = dataset.candidates || [];

  console.error(`[curate] ${candidates.length} candidates loaded`);

  // 解析 code blocks
  for (const c of candidates) {
    if (c.codeBlocks && c.codeBlocks.length > 0) {
      const main = c.codeBlocks[0];
      const result = parseStructured(main.raw, main.language);
      c.structured = result;
      if (result.ok && result.parsed) {
        const p = result.parsed;
        c.structuredData = p;
        if (p.prompt && typeof p.prompt === 'string') c.prompt = p.prompt;
        if (p.negative_prompt) c.negativePrompt = p.negative_prompt;
        if (p.negativePrompt) c.negativePrompt = p.negativePrompt;
        if (p.aspect_ratio) c.aspectRatio = p.aspect_ratio;
        if (p.aspectRatio) c.aspectRatio = p.aspectRatio;
      }
    }
  }

  // 强去重
  const seen = new Map();
  const deduped = [];
  for (const c of candidates) {
    const key = canonicalKey(c);
    if (seen.has(key)) continue;
    seen.set(key, true);
    c.quality = qualityScore(c);
    deduped.push(c);
  }
  console.error(`[curate] ${deduped.length} unique after dedup`);

  // append 模式：读现有 prompts.ts，跳过已有 slug
  if (args.mode === 'append') {
    try {
      const existing = await readFile(outputPath, 'utf8');
      const slugMatches = [...existing.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
      const existingSlugs = new Set(slugMatches);
      const before = deduped.length;
      const filtered = deduped.filter((c) => !existingSlugs.has(c.slug));
      console.error(`[curate] append: ${before} → ${filtered.length} (filtered ${before - filtered.length} already in ${outputPath})`);
      candidates = filtered;
    } catch (e) {
      console.error(`[curate] append: cannot read existing ${outputPath}, falling back to curate`);
      candidates = deduped;
    }
  } else {
    candidates = deduped;
  }

  // 多样性筛选
  const selected = diversify(candidates, args.limit);
  console.error(`[curate] selected ${selected.length} after diversity filter`);

  // 转换字段
  const final = selected.map((c) => ({
    slug: c.slug,
    title: c.title,
    tagline: generateTagline(c),
    category: inferCategory(c),
    engines: c.engines,
    difficulty: inferDifficulty(c),
    prompt: c.prompt,
    negativePrompt: c.negativePrompt,
    aspectRatio: c.aspectRatio,
    rawBlock: c.rawBlock,
    images: c.images.map((i) => ({ src: i.src, alt: i.alt, width: i.width, isThumb: i.variant === 'thumb' })),
    source: c.source,
    dateAdded: dateAdded(c),
    tags: inferTags(c),
    verdict: generateVerdict(c),
    reusable: (c.placeholders?.length || 0) > 0,
    language: c.language,
    structuredData: c.structuredData,
  }));

  // 输出
  const ts = serializeTs(final);
  await writeFile(outputPath, ts, 'utf8');
  console.error(`[curate] wrote ${outputPath}`);

  // 可选：写 PR body
  if (args.prBody && args.mode === 'append' && final.length > 0) {
    const lines = [`## Daily curation: ${final.length} new prompts`, '', `Added at ${new Date().toISOString()}`, ''];
    for (const p of final) {
      lines.push(`- **${p.title}** — _${p.source.authorName}_ — ${p.promptUrl}`);
    }
    await writeFile(args.prBody, lines.join('\n') + '\n', 'utf8');
    console.error(`[curate] wrote PR body to ${args.prBody}`);
  }
}

main().catch((err) => {
  console.error('[curate] Fatal:', err);
  process.exit(1);
});