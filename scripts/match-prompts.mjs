// 从 README 反查：slug、img 完整 URL、promptText
import fs from 'node:fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';

const md = fs.readFileSync('C:/Users/dell/AppData/Local/Temp/readme.md', 'utf8');
const tree = unified().use(remarkParse).parse(md);

const entries = [];
let currentSlug = null;
let i = 0;
while (i < tree.children.length) {
  const node = tree.children[i];
  if (node.type === 'heading' && node.depth === 3) {
    const link = (node.children || []).find(c => c.type === 'link');
    if (link && /\/prompt\//.test(link.url || '')) {
      const slug = (link.url || '').match(/\/prompt\/([^)]+)/)?.[1];
      if (slug) currentSlug = decodeURIComponent(slug);
    } else {
      currentSlug = null;
    }
  }
  if (node.type === 'html' && currentSlug) {
    const imgMatch = node.value.match(/<img[^>]+src="(https:\/\/img1\.aiart\.pics\/[^"]+)"[^>]*>/);
    if (imgMatch) {
      const imgUrl = imgMatch[1];
      // 提取日期和文件名 stem
      const filename = imgUrl.split('/').pop().replace(/-\d+\.(jpg|png|webp|jpeg|svg)$/, '');
      let promptText = '';
      let j = i + 1;
      while (j < tree.children.length && j < i + 5) {
        const next = tree.children[j];
        if (next.type === 'code') {
          promptText = (next.value || '').trim().slice(0, 800);
          break;
        }
        j++;
      }
      entries.push({ slug: currentSlug, imgUrl, imgFilename: filename, promptText });
    }
  }
  i++;
}

console.log('total entries:', entries.length);
fs.writeFileSync('C:/Users/dell/AppData/Local/Temp/readme-entries.json', JSON.stringify(entries, null, 2));
console.log('saved');
console.log('sample:', JSON.stringify(entries.slice(0, 3), null, 2));