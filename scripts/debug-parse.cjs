// debug: 测试 collections.ts 解析
const fs = require('fs');
const ts = fs.readFileSync('C:/Users/dell/prompt-gallery/src/data/collections.ts', 'utf8');

// 简单测试：数 "slug: 'collection-" 出现次数
const slugCount = (ts.match(/slug:\s*'collection-/g) || []).length;
console.log('total slug occurrences:', slugCount);

// 数 "image: 'https://img1" 出现次数
const imgCount = (ts.match(/image:\s*'https:\/\/img1/g) || []).length;
console.log('total image occurrences:', imgCount);

// 测试一个简化 regex
const blockRegex = /slug:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)'/g;
let count = 0;
while (blockRegex.exec(ts) !== null) count++;
console.log('simplified block matches:', count);

// 完整 regex
const fullRegex = /slug:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)',\s*description:\s*'((?:[^'\\]|\\.)*)',\s*cover:\s*'([^']+)',\s*count:\s*(\d+),\s*prompts:\s*\[([\s\S]*?)\n\s*\],/g;
count = 0;
while (fullRegex.exec(ts) !== null) count++;
console.log('full block matches:', count);