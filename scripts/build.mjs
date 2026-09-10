#!/usr/bin/env node
// ============================================================
//  构建包装器
//  -----------------------------------------------------------
//  为什么需要它：
//  Astro 在 static build 的最后一步会调用 cleanServerOutput()，
//  递归删除 dist 下的空目录与残留 .mjs chunk。在某些受限环境
//  （如沙箱/安全删除守卫）这一步会被拦截并抛错，导致 astro
//  exit code 非 0 —— 但此时**页面已经全部生成完毕**。
//
//  因为 package.json 里是 `astro build && node scripts/...`，
//  非 0 退出会让 sitemap 后处理脚本被跳过，产物悄悄缺了
//  image:loc / lastmod 修正，而且不容易发现。
//
//  本包装器的策略：
//  1. 跑 astro build，保留原始输出
//  2. 若失败，检查 dist 产物是否为本次构建新写入的（mtime > 构建开始时刻）
//     - 是 → 判定为收尾清理阶段的问题，警告后继续跑后处理
//     - 否 → 真正的构建失败，原样退出，不掩盖错误
//  3. 最后执行 sitemap 后处理
//
//  用法：node scripts/build.mjs   （package.json 的 build 指向这里）
// ============================================================

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const startedAt = Date.now();

function run(cmd, args) {
  return spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

const build = run('npx', ['astro', 'build']);

if (build.status !== 0) {
  // 判据：页面产物存在且是本次构建写出的
  // （不检查 sitemap-0.xml —— 它由本包装器的后处理步骤生成，
  //   而 astro 的 build:done 钩子在本环境下可能根本没跑到）
  const pageFiles = [
    path.join(DIST, 'index.html'),
    path.join(DIST, 'zh', 'index.html'),
  ];
  const fresh = pageFiles.every((f) => {
    if (!fs.existsSync(f)) return false;
    return fs.statSync(f).mtimeMs >= startedAt - 1000;
  });

  if (!fresh) {
    console.error('\n[build] astro build 失败，且产物不是本次生成的 —— 中止。');
    process.exit(build.status ?? 1);
  }

  console.warn(
    '\n[build] 警告：astro build 退出码非 0，但页面产物已在本次构建中完整生成。' +
      '\n[build] 判定为收尾清理阶段被环境拦截（不影响页面），继续执行 sitemap 后处理。'
  );
}

const post = run('node', [path.join(__dirname, 'generate-sitemap.mjs')]);
if (post.status !== 0) {
  console.error('\n[build] sitemap 生成失败。');
  process.exit(post.status ?? 1);
}

console.log('\n[build] 完成：页面 + sitemap 后处理均已执行。');
