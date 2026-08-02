// 把 /tmp/collections-full.json 转成 src/data/collections.ts
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/tmp/collections-full.json', 'utf8'));

function esc(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const lines = data.map((c, i) => {
  const slug = 'collection-' + String(i + 1).padStart(2, '0');
  const promptsStr = (c.prompts || []).map(p => {
    return '      { title: \'' + esc(p.title) + '\', image: \'' + esc(p.img) + '\' },';
  }).join('\n');
  return '  {\n' +
    '    slug: \'' + slug + '\',\n' +
    '    title: \'' + esc(c.title) + '\',\n' +
    '    description: \'' + esc(c.desc) + '\',\n' +
    '    cover: \'' + esc(c.cover) + '\',\n' +
    '    count: ' + (c.count || 0) + ',\n' +
    '    prompts: [\n' + promptsStr + '\n    ],\n' +
    '  },';
}).join('\n');

const ts = `// ============================================================
//  Collections — 精选专题
//  数据来源：参考 aiart.pics/collections
// ============================================================

export interface CollectionPrompt {
  title: string;
  image: string;
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
console.log('wrote collections.ts:', data.length, 'collections,', data.reduce((s,c)=>s+c.prompts.length,0), 'sample prompts');