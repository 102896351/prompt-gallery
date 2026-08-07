// Replace Chinese titleEn with English translations for 30 new prompts
const fs = require('fs');
let src = fs.readFileSync('src/data/prompts.ts', 'utf8');
const titleEnMap = JSON.parse(fs.readFileSync('title-en-map.json', 'utf8'));

let count = 0;
for (const [slug, enTitle] of Object.entries(titleEnMap)) {
  // Build regex: slug: "xxx" ... titleEn: "yyy"
  // Use a non-greedy match between slug and titleEn
  const pattern = '(slug:\\s*"' + slug + '"[\\s\\S]*?titleEn:\\s*")([^"]+)(")';
  const re = new RegExp(pattern);
  const newSrc = src.replace(re, (match, before, oldTitle, quote) => {
    if (oldTitle === enTitle) return match;
    count++;
    return before + enTitle + quote;
  });
  if (newSrc === src) {
    console.log('WARN: not found - ' + slug);
  }
  src = newSrc;
}
fs.writeFileSync('src/data/prompts.ts', src, 'utf8');
console.log('Updated', count, 'titleEn fields to English');
