#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const file = process.argv[2] || 'src/data/prompts.ts';
const source = await readFile(file, 'utf8');
const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
let promptsArray;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(sf) === 'prompts' && ts.isArrayLiteralExpression(node.initializer)) promptsArray = node.initializer;
  ts.forEachChild(node, visit);
}
visit(sf);
if (!promptsArray) throw new Error('prompts array not found');
function valueOf(obj, name) {
  const prop = obj.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText(sf).replace(/^['"]|['"]$/g, '') === name);
  return prop?.initializer && ts.isStringLiteral(prop.initializer) ? prop.initializer.text : '';
}
const entries = promptsArray.elements.filter(ts.isObjectLiteralExpression).map((obj) => ({ slug: valueOf(obj, 'slug'), titleEn: valueOf(obj, 'titleEn') }));
const missing = entries.filter((entry) => !entry.titleEn);
const cjk = entries.filter((entry) => /[\u3400-\u9fff]/.test(entry.titleEn));
const oldBrand = entries.filter((entry) => entry.titleEn.includes('纳米香蕉'));
const seen = new Set();
const duplicates = [];
for (const entry of entries) {
  if (seen.has(entry.slug)) duplicates.push(entry.slug);
  seen.add(entry.slug);
}
console.log(JSON.stringify({ file, entries: entries.length, missingTitleEn: missing.length, cjkTitleEn: cjk.length, oldBrandTitleEn: oldBrand.length, duplicateSlugs: duplicates.length }, null, 2));
if (missing.length || cjk.length || oldBrand.length || duplicates.length) {
  if (missing.length) console.error('Missing:', missing.map((entry) => entry.slug).join(', '));
  if (cjk.length) console.error('CJK:', cjk.map((entry) => entry.slug).join(', '));
  if (oldBrand.length) console.error('Old brand:', oldBrand.map((entry) => entry.slug).join(', '));
  process.exit(2);
}
