// 从原 README 反查每个 prompt 的 slug、image 文件名、prompt 文本
const fs = require('fs');
const { unified } = require('unified');
const remarkParse = require('remark-parse');

(async () => {
  const md = fs.readFileSync('/tmp/readme.md', 'utf8');
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
      const imgMatch = node.value.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) {
        const imgUrl = imgMatch[1];
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
        entries.push({ slug: currentSlug, imgFilename: filename, promptText });
      }
    }
    i++;
  }

  console.log('total entries from README:', entries.length);
  fs.writeFileSync('/tmp/readme-entries.json', JSON.stringify(entries, null, 2));
  console.log('saved /tmp/readme-entries.json');
})();