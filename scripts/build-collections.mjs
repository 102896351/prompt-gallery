// 用 README + collection 标题关键词，反查每个 collection 的 5 个 sample prompts
import fs from 'node:fs';

const meta = JSON.parse(fs.readFileSync('C:/Users/dell/AppData/Local/Temp/collections-meta.json', 'utf8'));
const readme = JSON.parse(fs.readFileSync('C:/Users/dell/AppData/Local/Temp/readme-entries.json', 'utf8'));

const stopWords = new Set(['的', '与', '和', '及', '或', '收录', '精选', '集', '主题', '作品', '探索', '等', '中']);

function extractKeywords(title) {
  return title.split(/[·，\s]+/).filter(w => w.length >= 2 && !stopWords.has(w));
}

// 对每个 prompt 评分：跟 keywords 匹配越多越好；prompt 文本短（说明是简短 prompt）加分
function scorePrompt(promptText, kws) {
  const text = promptText.toLowerCase();
  let s = 0;
  for (const kw of kws) {
    if (text.includes(kw.toLowerCase())) s += 2;
  }
  // 短 prompt 优先（通常 < 300 字符）
  if (promptText.length < 300) s += 1;
  if (promptText.length > 1000) s -= 1;
  return s;
}

// 对每个 collection 找 top-5 prompts
const collections = meta.map(c => {
  const kws = extractKeywords(c.title);
  const scored = readme
    .map(p => ({ ...p, _score: scorePrompt(p.promptText, kws) }))
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 5);
  return {
    ...c,
    kws,
    prompts: scored.map(p => ({
      title: p.slug,
      image: p.imgUrl || `https://img1.aiart.pics/images/prompts/20251216/${p.slug}-1.jpg`,
      promptText: p.promptText,
    })),
  };
});

// 输出摘要
collections.forEach(c => {
  console.log(`${c.title}: ${c.prompts.length} prompts (keywords: ${c.kws.join(', ')})`);
  if (c.prompts.length > 0) {
    console.log('  first:', c.prompts[0].title, '|', c.prompts[0].promptText.slice(0, 60));
  }
});

fs.writeFileSync('C:/Users/dell/AppData/Local/Temp/collections-built.json', JSON.stringify(collections, null, 2));
console.log('\nsaved collections-built.json');

// 生成 collections.ts
function esc(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

const lines = collections.map((c, i) => {
  const slug = 'collection-' + String(i + 1).padStart(2, '0');
  const promptsStr = c.prompts.map(p =>
    `      { title: '${esc(p.title)}', image: '${esc(p.image)}', promptText: '${esc(p.promptText)}' },`
  ).join('\n');
  return `  {\n` +
    `    slug: '${slug}',\n` +
    `    title: '${esc(c.title)}',\n` +
    `    description: '${esc(c.description)}',\n` +
    `    cover: '${esc(c.cover)}',\n` +
    `    count: ${c.count},\n` +
    `    prompts: [\n${promptsStr}\n    ],\n` +
    `  }`;
}).join(',\n');

const ts = `// ============================================================
//  Collections — 精选专题
//  数据来源：参考 aiart.pics/collections
// ============================================================

export interface CollectionPrompt {
  title: string;
  image: string;
  /** prompt 原文（从原 README 反查） */
  promptText: string;
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
  cover: string;
  count: number;
  prompts: CollectionPrompt[];
}

export const collections: Collection[] = [
${lines}
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
`;

fs.writeFileSync('C:/Users/dell/prompt-gallery/src/data/collections.ts', ts);
console.log('wrote collections.ts');