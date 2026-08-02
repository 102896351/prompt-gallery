// 从 collections.ts 读数据 + README 反查 prompt 文本，重新写 collections.ts
const fs = require('fs');

const collectionsTs = fs.readFileSync('C:/Users/dell/prompt-gallery/src/data/collections.ts', 'utf8');
const readmeEntries = JSON.parse(fs.readFileSync('C:/Users/dell/AppData/Local/Temp/readme-entries.json', 'utf8'));

// 按 imgFilename 建索引
const stemToPrompt = new Map();
readmeEntries.forEach(e => {
  if (!stemToPrompt.has(e.imgFilename)) {
    stemToPrompt.set(e.imgFilename, e.promptText);
  }
});
console.log('README 索引: ' + stemToPrompt.size + ' stems');

// 从 collections.ts 解析每个 prompt（slug, title, image）
// 双索引：slug 完全匹配 + stem 模糊匹配
const slugToPrompt = new Map();
const stemToPromptMap = new Map();
readmeEntries.forEach(e => {
  if (!slugToPrompt.has(e.slug)) slugToPrompt.set(e.slug, e.promptText);
  if (!stemToPromptMap.has(e.imgFilename)) stemToPromptMap.set(e.imgFilename, e.promptText);
});

const collections = [];
const blockRegex = /slug:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)',\s*description:\s*'((?:[^'\\]|\\.)*)',\s*cover:\s*'([^']+)',\s*count:\s*(\d+),\s*prompts:\s*\[([\s\S]*?)\n\s*\],/g;
let m;
let total = 0, matchedSlug = 0, matchedStem = 0;
while ((m = blockRegex.exec(collectionsTs)) !== null) {
  const [_, slug, title, description, cover, count, promptsBlock] = m;
  // 解析 prompts 数组（用 [\s\S]*? 跨多行匹配 promptText 的内容）
  const prompts = [];
  // 每个 prompt 是 {...} 块，title 在前 image 在后，promptText 在最末
  // 用 [\s\S]*? 跨行，匹配到第一个 }, 结束
  const promptRegex = /\{\s*title:\s*'((?:[^'\\]|\\.)*)',\s*image:\s*'([^']+)',\s*promptText:\s*'([\s\S]*?)'\s*\}/g;
  let pm;
  while ((pm = promptRegex.exec(promptsBlock)) !== null) {
    const titleUnesc = pm[1].replace(/\\'/g, "'");
    const filename = pm[2].split('/').pop().replace(/-\d+\.(jpg|png|webp|jpeg|svg)$/, '');
    const existing = pm[3].replace(/\\'/g, "'");
    const promptText = slugToPrompt.get(slug) || stemToPromptMap.get(filename) || existing;
    if (slugToPrompt.has(slug)) matchedSlug++;
    else if (stemToPromptMap.has(filename)) matchedStem++;
    prompts.push({ title: titleUnesc, image: pm[2], promptText });
    total++;
  }
  if (prompts.length === 0) {
    // fallback: promptRegex 没匹配（可能 promptText 字段不存在），用老格式
    const fallbackRegex = /\{\s*title:\s*'((?:[^'\\]|\\.)*)',\s*image:\s*'([^']+)'\s*\}/g;
    let fm;
    while ((fm = fallbackRegex.exec(promptsBlock)) !== null) {
      const titleUnesc = fm[1].replace(/\\'/g, "'");
      const filename = fm[2].split('/').pop().replace(/-\d+\.(jpg|png|webp|jpeg|svg)$/, '');
      const promptText = slugToPrompt.get(slug) || stemToPromptMap.get(filename) || '';
      if (slugToPrompt.has(slug)) matchedSlug++;
      else if (stemToPromptMap.has(filename)) matchedStem++;
      prompts.push({ title: titleUnesc, image: fm[2], promptText });
      total++;
    }
  }
  collections.push({ slug, title: title.replace(/\\'/g, "'"), description: description.replace(/\\'/g, "'"), cover, count: parseInt(count, 10), prompts });
}
console.log('total prompts: ' + total);
console.log('  matched via slug: ' + matchedSlug);
console.log('  matched via stem: ' + matchedStem);
console.log('  total matched: ' + (matchedSlug + matchedStem));

// 重新生成 collections.ts
function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const collectionsOut = collections.map(c => {
  const promptsStr = c.prompts.map(p =>
    '      { title: \'' + esc(p.title) + '\', image: \'' + esc(p.image) + '\', promptText: \'' + esc(p.promptText) + '\' },'
  ).join('\n');
  return '  {\n' +
    '    slug: \'' + c.slug + '\',\n' +
    '    title: \'' + esc(c.title) + '\',\n' +
    '    description: \'' + esc(c.description) + '\',\n' +
    '    cover: \'' + esc(c.cover) + '\',\n' +
    '    count: ' + c.count + ',\n' +
    '    prompts: [\n' + promptsStr + '\n    ],\n' +
    '  }';
}).join(',\n');

const out = `// ============================================================
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
${collectionsOut}
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
`;

fs.writeFileSync('C:/Users/dell/prompt-gallery/src/data/collections.ts', out);
console.log('wrote collections.ts: ' + collections.length + ' collections, ' + total + ' prompts (' + matched + ' matched)');