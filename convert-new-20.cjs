// Convert selected-20.json → TypeScript object literal fragments for prompts.ts
const fs = require('fs');

function escStr(s) {
  // 1. escape backslashes first
  // 2. escape double quotes
  // 3. escape newlines as literal \n in TS string
  return String(s == null ? '' : s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n');
}

const picked = JSON.parse(fs.readFileSync('selected-20.json', 'utf8'));

function pickTagline(prompt) {
  // find first meaningful Chinese/English line
  const lines = (prompt || '').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 12) continue;
    if (/^[-=*#`]+$/.test(t)) continue;
    if (t.startsWith('提示词') || t.startsWith('分享') || t.startsWith('---') || t.startsWith('🍌')) continue;
    return t.slice(0, 140);
  }
  return (prompt || '').slice(0, 120);
}

function toPrompt(c) {
  const imgs = (c.images || []).map(i => ({
    src: i.src,
    alt: i.alt || c.title,
    width: i.width || 500,
    isThumb: false
  }));
  return {
    slug: c.slug,
    title: c.title,
    titleEn: c.title,
    tagline: pickTagline(c.prompt || c.rawBlock || ''),
    category: 'other',
    engines: (c.engines && c.engines.length) ? c.engines : ['other'],
    difficulty: 3,
    prompt: c.prompt || c.rawBlock || '',
    rawBlock: c.rawBlock || '',
    images: imgs,
    source: c.source,
    dateAdded: '2026-08-06',
    tags: ['fresh', 'community'],
    verdict: 'Community submission. Curated by editorial team.',
    reusable: !!(c.placeholders && c.placeholders.length),
    language: c.language || 'en',
    structuredData: null,
  };
}

const objs = picked.map(toPrompt);
const fragments = objs.map(o => {
  const imgsLiteral = o.images.map(i => `{"src":"${escStr(i.src)}","alt":"${escStr(i.alt)}","width":${i.width},"isThumb":${i.isThumb ? 'true' : 'false'}}`).join(',');
  const tagsLiteral = o.tags.map(t => `"${escStr(t)}"`).join(',');
  const enginesLiteral = o.engines.map(e => `"${escStr(e)}"`).join(',');
  const sourceObj = o.source || {};
  const sourceLiteral = `{"platform":"${escStr(sourceObj.platform || 'X')}","sourceUrl":"${escStr(sourceObj.sourceUrl || '')}","statusId":${sourceObj.statusId ? `"${escStr(sourceObj.statusId)}"` : 'null'},"authorName":"${escStr(sourceObj.authorName || '')}"}`;
  return `  {
    slug: "${escStr(o.slug)}",
    title: "${escStr(o.title)}",
    titleEn: "${escStr(o.titleEn)}",
    tagline: "${escStr(o.tagline)}",
    category: "${o.category}",
    engines: [${enginesLiteral}],
    difficulty: ${o.difficulty},
    prompt: ${JSON.stringify(o.prompt)},
    rawBlock: ${JSON.stringify(o.rawBlock)},
    images: [${imgsLiteral}],
    source: ${sourceLiteral},
    dateAdded: "${o.dateAdded}",
    tags: [${tagsLiteral}],
    verdict: "${escStr(o.verdict)}",
    reusable: ${o.reusable},
    language: "${o.language}",
    structuredData: null,
  }`;
});

const output = ',\n' + fragments.join(',\n') + '\n';
fs.writeFileSync('new-prompts-20-fragments.ts', output, 'utf8');
console.log('Generated', fragments.length, 'fragments →', 'new-prompts-20-fragments.ts');
console.log('Each entry has', objs[0].images.length, '+ images,', objs[0].prompt.length, 'prompt chars');
