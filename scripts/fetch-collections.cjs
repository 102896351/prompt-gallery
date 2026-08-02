// 用 Node fetch 直接抓 aiart.pics/collections 详情页（避免浏览器自动化）
const fs = require('fs');

const collections = JSON.parse(fs.readFileSync('C:/Users/dell/AppData/Local/Temp/collections-meta.json', 'utf8'));
console.log('total collections to fetch:', collections.length);

// 先抓 collections 列表（已经做过）
const listDone = collections.every(c => c.title && c.uuid);
console.log('list already done:', listDone);

async function fetchCollection(c) {
  const url = 'https://aiart.pics/collections/' + c.uuid;
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  const html = await res.text();
  // 提取 main 里的 img 标签 + 标题
  const prompts = [];
  // 匹配 <img src="https://img1.aiart.pics/images/prompts/..." alt="...">
  const imgRegex = /<img[^>]+src="(https:\/\/img1\.aiart\.pics\/images\/prompts\/[^"]+)"[^>]*alt="([^"]+)"/g;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    const url = m[1];
    const alt = m[2];
    if (!alt.includes('Logo') && !alt.includes('cover')) {
      prompts.push({ title: alt, image: url });
    }
  }
  return { ...c, prompts };
}

(async () => {
  // 并发 5 个
  const results = [];
  const batchSize = 5;
  for (let i = 0; i < collections.length; i += batchSize) {
    const batch = collections.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchCollection));
    results.push(...batchResults);
    process.stdout.write(`processed ${Math.min(i + batchSize, collections.length)}/${collections.length}\n`);
  }
  fs.writeFileSync('C:/Users/dell/AppData/Local/Temp/collections-full.json', JSON.stringify(results, null, 2));
  console.log('saved');
  const totalPrompts = results.reduce((s, c) => s + c.prompts.length, 0);
  console.log('total prompts:', totalPrompts);
})();