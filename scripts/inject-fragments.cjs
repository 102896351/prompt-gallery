#!/usr/bin/env node
// ============================================================
//  inject-fragments.cjs
//  -----------------------------------------------------------
//  将 fragments.ts 插入到 prompts.ts 数组末尾（]; 前）
//  处理之前发现的"双 } bug"：自动修复已有文件的语法错
//
//  Usage:
//    node scripts/inject-fragments.cjs \
//      --existing src/data/prompts.ts \
//      --fragments /tmp/curate/fragments.ts \
//      --output src/data/prompts.ts
// ============================================================

const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i += 2) {
    opts[args[i].replace(/^--/, '')] = args[i + 1];
  }
  return opts;
}

function main() {
  const opts = parseArgs();
  let src = fs.readFileSync(opts.existing, 'utf8');
  let fragments = fs.readFileSync(opts.fragments, 'utf8');

  // fragments 应该以 ",\n" 开头（确保前一个对象后有逗号）
  if (!fragments.startsWith(',')) {
    fragments = ',\n' + fragments;
  }

  // 找最后一个 ];
  const lastSemi = src.lastIndexOf('];');
  if (lastSemi === -1) {
    throw new Error('Could not find ]; array end marker in prompts.ts');
  }

  // 在 ] 前插入 fragments。修复之前的"双 }" bug：
  // 检查 ] 前的 }，如果前面没有逗号，加上逗号。
  const before = src.slice(0, lastSemi);
  const after = src.slice(lastSemi);

  // 确保 ] 前的最后一个 } 后面有逗号
  let trimmedBefore = before.replace(/\s+$/, '');
  if (trimmedBefore.endsWith('}')) {
    trimmedBefore += ',';
  }

  const merged = trimmedBefore + fragments + '\n' + after;
  fs.writeFileSync(opts.output, merged, 'utf8');
  console.log(`[inject-fragments] merged ${fragments.split('slug:').length - 1} entries`);
  console.log(`[inject-fragments] new file size: ${merged.length} bytes`);
}

main();