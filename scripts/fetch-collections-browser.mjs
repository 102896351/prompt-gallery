// 用 Playwright Node 抓 collection 详情页（避开 IAB）
// 用 chromium 直接加载，等 JS 渲染完成
import { chromium } from 'playwright';
import fs from 'node:fs';

const collections = JSON.parse(fs.readFileSync('C:/Users/dell/AppData/Local/Temp/collections-meta.json', 'utf8'));
console.log('total collections:', collections.length);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });

async function fetchOne(c) {
  const page = await ctx.newPage();
  await page.goto('https://aiart.pics/collections/' + c.uuid, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  const prompts = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('main img')];
    return imgs
      .filter(i => i.src && i.src.includes('img1.aiart.pics/images/prompts/'))
      .map(i => ({ title: i.alt || '', image: i.src }));
  });
  await page.close();
  return { ...c, prompts };
}

const results = [];
const batchSize = 5;
for (let i = 0; i < collections.length; i += batchSize) {
  const batch = collections.slice(i, i + batchSize);
  const r = await Promise.all(batch.map(fetchOne));
  results.push(...r);
  console.log('processed', i + batch.length, '/', collections.length);
}

fs.writeFileSync('C:/Users/dell/AppData/Local/Temp/collections-full.json', JSON.stringify(results, null, 2));
const totalPrompts = results.reduce((s, c) => s + c.prompts.length, 0);
console.log('saved. total prompts:', totalPrompts);
await browser.close();