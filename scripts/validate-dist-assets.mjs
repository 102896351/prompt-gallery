#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const parsedArgs = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i].replace(/^--/, '');
  parsedArgs[key] = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : true;
}
const args = parsedArgs;
const dist = args.dist || 'dist';
const allowedLegacy = Number(args['allowed-legacy'] || 25);
const oldHost = 'https://img1.aiart.pics/';
const r2Host = 'https://media.aiartspell.art/';
const htmlFiles = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) htmlFiles.push(file);
  }
}
await walk(dist);
let oldCount = 0;
let r2Count = 0;
const oldUrls = new Set();
const invalidR2 = [];
for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  for (const match of text.matchAll(/https:\/\/img1\.aiart\.pics\/[^"'<\s]+/g)) oldUrls.add(match[0]);
  r2Count += (text.match(new RegExp(r2Host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  for (const match of text.matchAll(/https:\/\/media\.aiartspell\.art\/([^"'<\s]+)/g)) {
    if (match[1].includes('..') || match[1].includes('\\')) invalidR2.push({ file, url: match[0] });
  }
}
console.log(`[dist] html=${htmlFiles.length} r2Refs=${r2Count} legacyUnique=${oldUrls.size} invalidR2=${invalidR2.length}`);
if (oldUrls.size > allowedLegacy) {
  console.error(`[dist] unique legacy image URLs ${oldUrls.size} exceed allowed baseline ${allowedLegacy}`);
  process.exitCode = 2;
}
if (invalidR2.length) {
  console.error(JSON.stringify(invalidR2.slice(0, 20), null, 2));
  process.exitCode = 2;
}
