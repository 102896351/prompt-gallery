#!/usr/bin/env node
// ============================================================
//  submit-baidu.cjs
//  -----------------------------------------------------------
//  从 sitemap 拉取 URL，批量推送到百度普通收录 API。
//  新站初期配额为 0（API/sitemap/手动都会 over quota），
//  配额随蜘蛛抓取与站点质量评估逐步开放（通常数天~两周）。
//
//  用法:
//    node scripts/submit-baidu.cjs            # 推全部 /zh/ 页面（默认）
//    node scripts/submit-baidu.cjs --all      # 推全部页面（中英）
//    node scripts/submit-baidu.cjs --limit 50 # 限量推送
//
//  百度单次请求上限 2000 条；token 在下方常量（ziyuan.baidu.com
//  普通收录 -> API推送 页面可重置"准入密钥"）。
// ============================================================

const http = require('http');
const https = require('https');

const SITE = 'https://aiartspell.art';
const TOKEN = 'VXnWhzyXbbE1bwE5'; // 百度准入密钥（修改准入密钥后同步更新这里）
const SITEMAP = `${SITE}/sitemap-0.xml`;

const args = process.argv.slice(2);
const pushAll = args.includes('--all');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 0; // 0 = 不限

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 30000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  console.log('[baidu] fetching sitemap...');
  const xml = await fetch(SITEMAP);
  let urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`[baidu] total URLs in sitemap: ${urls.length}`);

  if (!pushAll) {
    urls = urls.filter((u) => u.includes('/zh/'));
    console.log(`[baidu] filtered to /zh/ only: ${urls.length}`);
  }
  if (LIMIT > 0) {
    urls = urls.slice(0, LIMIT);
    console.log(`[baidu] limited to first ${LIMIT}`);
  }
  if (urls.length === 0) {
    console.error('[baidu] no URLs to push.');
    process.exit(1);
  }

  const body = urls.join('\n');
  const path = `/urls?site=${encodeURIComponent(SITE)}&token=${TOKEN}`;

  const req = http.request(
    {
      hostname: 'data.zz.baidu.com',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 60000,
    },
    (res) => {
      let out = '';
      res.on('data', (c) => (out += c));
      res.on('end', () => {
        console.log(`[baidu] HTTP ${res.statusCode}`);
        console.log(`[baidu] response: ${out}`);
        try {
          const j = JSON.parse(out);
          if (j.success !== undefined) {
            console.log(`\n✅ 推送成功 ${j.success} 条，今日剩余配额 ${j.remain} 条。`);
          } else if (j.error === 400) {
            console.log('\n❌ over quota —— 今日配额用尽/为 0。等配额开放后重跑本脚本。');
            console.log('   （ziyuan.baidu.com -> 普通收录 页面可查看实时配额）');
          } else if (j.error === 505) {
            console.log('\n⏳ please retry later —— 限流，稍等几分钟后重跑。');
          }
        } catch (e) {
          console.log('\n⚠️ 无法解析响应，见上方原始输出。');
        }
      });
    }
  );
  req.on('error', (e) => console.error('[baidu] request error:', e.message));
  req.write(body);
  req.end();
}

main();
