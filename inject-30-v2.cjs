// 精确注入 30 条新 prompt
// 用 TypeScript 编译器定位 prompts 数组的精确位置
const ts = require('typescript');
const fs = require('fs');

function inject(cleanBaseline) {
  console.log('[inject-30] reading prompts.ts...');
  let src = fs.readFileSync('src/data/prompts.ts', 'utf8');

  // 1. 用 TS 解析找 prompts 数组的精确位置
  const sf = ts.createSourceFile('prompts.ts', src, ts.ScriptTarget.ESNext, true);
  let promptsArray = null;
  function find(node) {
    if (ts.isVariableStatement(node)) {
      const decl = node.declarationList.declarations[0];
      if (decl && decl.name.text === 'prompts' &&
          decl.initializer && ts.isArrayLiteralExpression(decl.initializer)) {
        promptsArray = decl.initializer;
      }
    }
    if (!promptsArray) ts.forEachChild(node, find);
  }
  find(sf);
  if (!promptsArray) throw new Error('prompts array not found');

  const arrayStart = promptsArray.pos + 1; // 跳过 '['
  const arrayEnd = promptsArray.end - 1;   // 跳过 ']'
  const lineStart = src.slice(0, arrayStart).split('\n').length;
  const lineEnd = src.slice(0, arrayEnd).split('\n').length;
  console.log(`[inject-30] prompts array: char ${arrayStart}-${arrayEnd}, line ${lineStart}-${lineEnd}`);

  // 2. 检查 fragments 文件
  if (!fs.existsSync('new-30-fragments.ts')) {
    throw new Error('new-30-fragments.ts not found, run rewrite-fragments.cjs first');
  }
  let fragments = fs.readFileSync('new-30-fragments.ts', 'utf8').trim();
  // 去掉开头的逗号和换行
  fragments = fragments.replace(/^,+\s*/, '');

  // 3. 检查 arrayEnd 之前的最后字符 (确保有逗号)
  const before = src.slice(0, arrayEnd);
  const lastChar = before[before.length - 1];
  console.log(`[inject-30] char before ']': '${lastChar}'`);

  // 4. 准备 injection
  // arrayEnd 指向 ']' 字符位置
  // 我们要插入在 arrayEnd 之前: ',' + '\n' + fragments
  const insertion = ',\n' + fragments;
  const after = src.slice(arrayEnd); // 从 ']' 开始
  const newSrc = before + insertion + after;
  console.log(`[inject-30] new size: ${newSrc.length} (was ${src.length})`);

  // 5. 写文件
  fs.writeFileSync('src/data/prompts.ts', newSrc, 'utf8');
  console.log('[inject-30] written');

  // 6. 验证: TS 解析新文件
  const sf2 = ts.createSourceFile('prompts.ts', newSrc, ts.ScriptTarget.ESNext, true);
  const diags = sf2.parseDiagnostics || [];
  console.log(`[inject-30] parse errors: ${diags.length}`);
  if (diags.length > 0) {
    diags.forEach(d => {
      const pos = sf2.getLineAndCharacterOfPosition(d.start);
      console.log(`  Line ${pos.line + 1}:${pos.character + 1} - ${ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 100)}`);
    });
    process.exit(1);
  }

  // 7. 统计 slugs
  const slugs = [...newSrc.matchAll(/^    slug: "([^"]+)"/gm)].map(m => m[1]);
  console.log(`[inject-30] total slugs: ${slugs.length}`);
  const sample = slugs.slice(-5);
  console.log(`[inject-30] last 5 (new):`, sample);
}

// 干净基线: git show e36aa1d (line 308 条 prompt 之后, before the 30 条污染)
if (process.argv.includes('--clean')) {
  console.log('[inject-30] reset to clean baseline...');
  // 调用 git 命令 (shell exec 通过 child_process)
  const { execFileSync } = require('child_process');
  const out = execFileSync('git', ['show', 'e36aa1d:src/data/prompts.ts'], { encoding: 'utf8' });
  fs.writeFileSync('src/data/prompts.ts', out);
  console.log('[inject-30] reset done');
}

inject();
