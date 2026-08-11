// 安全注入 30 条新 prompt
const fs = require('fs');

console.log('[inject-30] reading prompts.ts...');
let src = fs.readFileSync('src/data/prompts.ts', 'utf8');
let fragments = fs.readFileSync('new-30-fragments.ts', 'utf8').trim();
// 去掉开头可能的逗号和换行
fragments = fragments.replace(/^,+\s*/, '');

const marker = 'export const prompts: Prompt[] = [';
const markerStart = src.indexOf(marker);
if (markerStart === -1) throw new Error('prompts array start not found');
const arrayStart = markerStart + marker.length;

let depth = 1;
let arrayEnd = -1;
for (let i = arrayStart; i < src.length; i++) {
  const ch = src[i];
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { arrayEnd = i + 1; break; } }
}
if (arrayEnd === -1) throw new Error('prompts array end not found');
console.log(`[inject-30] array end at char ${arrayEnd}`);

const arrayBefore = src.slice(0, arrayEnd);
const arrayAfter = src.slice(arrayEnd);
const beforeEnd = arrayBefore.replace(/,?\s*$/, '') + ',';
const newSection = '\n' + fragments + '\n';
const merged = beforeEnd + newSection + arrayAfter;
fs.writeFileSync('src/data/prompts.ts', merged, 'utf8');
console.log(`[inject-30] merged. new size: ${merged.length}`);

const slugs = [...merged.matchAll(/^    slug: "([^"]+)"/gm)].map(m => m[1]);
console.log(`[inject-30] total slugs: ${slugs.length}`);
const newOnes = slugs.filter(s => s.includes('high-fashion') || s.includes('wuyi') || s.includes('quantum') || s.includes('hand-drawn-calendar'));
console.log(`[inject-30] sample new:`, newOnes);
