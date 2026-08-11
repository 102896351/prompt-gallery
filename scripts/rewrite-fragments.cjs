// 完整重写 fragment 文件: 每个 entry 真正占多行 (不再压缩成单行)
const fs = require('fs');

// selected-20.json 里的 20 条数据 + 其他 10 条
const selected30 = JSON.parse(fs.readFileSync('selected-20.json', 'utf8')); // 包含 20 条
// 还需要另外 10 条: 读 fresh-clean.json 补全
const allFresh = JSON.parse(fs.readFileSync('fresh-clean.json', 'utf8')).candidates;

// 已选 20 个 slug
const pickedSlugs = new Set(selected30.map(p => p.slug));
// 从剩余 fresh 里选 10 个新 slug
const existing = fs.readFileSync('src/data/prompts.ts', 'utf8');
const existingSlugs = new Set();
const re = /^\s*slug:\s*"([^"]+)"/gm;
let m;
while ((m = re.exec(existing)) !== null) existingSlugs.add(m[1]);
const remaining = allFresh.filter(c => !pickedSlugs.has(c.slug) && !existingSlugs.has(c.slug)).slice(0, 10);
const all30 = [...selected30, ...remaining];
console.log('Total:', all30.length);

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n');
}

function pickTagline(prompt) {
  const lines = (prompt || '').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 12) continue;
    if (/^[-=*#`]+$/.test(t)) continue;
    if (t.startsWith('提示词') || t.startsWith('分享') || t.startsWith('---') || t.startsWith('🍌')) continue;
    return t.slice(0, 120);
  }
  return (prompt || '').slice(0, 100);
}

const fragments = all30.map(c => {
  const slug = c.slug;
  const imgs = (c.images || []).map(i => ({
    src: i.src,
    alt: i.alt || c.title,
    width: i.width || 500,
    isThumb: false
  }));
  const imgsLiteral = imgs.map(i => `{"src":"${esc(i.src)}","alt":"${esc(i.alt)}","width":${i.width},"isThumb":${i.isThumb ? 'true' : 'false'}}`).join(',');
  const tagsLiteral = ['fresh', 'community'].map(t => `"${esc(t)}"`).join(',');
  const enginesLiteral = (c.engines && c.engines.length ? c.engines : ['other']).map(e => `"${esc(e)}"`).join(',');
  const sourceObj = c.source || {};
  const sourceLiteral = `{"platform":"${esc(sourceObj.platform || 'X')}","sourceUrl":"${esc(sourceObj.sourceUrl || '')}","statusId":${sourceObj.statusId ? `"${esc(sourceObj.statusId)}"` : 'null'},"authorName":"${esc(sourceObj.authorName || '')}"}`;
  return `  {
    slug: "${esc(slug)}",
    title: "${esc(c.title)}",
    titleEn: "${esc(c.titleEn || c.title)}",
    tagline: "${esc(pickTagline(c.prompt || c.rawBlock || ''))}",
    taglineEn: "${esc(c.taglineEn || 'AI image prompt.')}",
    category: "other",
    engines: [${enginesLiteral}],
    difficulty: 3,
    prompt: ${JSON.stringify(c.prompt || c.rawBlock || '')},
    rawBlock: ${JSON.stringify(c.rawBlock || '')},
    images: [${imgsLiteral}],
    source: ${sourceLiteral},
    dateAdded: "2026-08-06",
    tags: [${tagsLiteral}],
    verdict: "Community submission. Curated by editorial team.",
    reusable: ${!!(c.placeholders && c.placeholders.length)},
    language: "${c.language || 'en'}",
    structuredData: null,
  }`;
});

const output = ',\n' + fragments.join(',\n') + '\n';
fs.writeFileSync('new-30-fragments.ts', output, 'utf8');
console.log(`Generated ${fragments.length} entries to new-30-fragments.ts`);

// 验证: 用 TypeScript 解析整个文件
const ts = require('typescript');
const fragmentSrc = fs.readFileSync('new-30-fragments.ts', 'utf8');
const wrapped = `const arr = [${fragmentSrc.replace(/^,/, '')}];`;
const sf = ts.createSourceFile('check.ts', wrapped, ts.ScriptTarget.ESNext, true);
const diags = sf.parseDiagnostics || [];
console.log('Parse errors:', diags.length);
diags.slice(0, 3).forEach(d => {
  const { line, character } = sf.getLineAndCharacterOfPosition(d.start);
  console.log('Line', line + 1, ':', ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 100));
});
