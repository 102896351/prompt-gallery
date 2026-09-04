#!/usr/bin/env node
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i].replace(/^--/, '');
  args[key] = process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[++i]
    : true;
}

const limit = Number(args.limit || 100);
const input = args.input || 'fresh-candidates.json';
const publish = Boolean(args.publish);
const dryRun = Boolean(args['dry-run']);
const root = process.cwd();
const stage = join(tmpdir(), `prompt-gallery-local-curate-${process.pid}`);
const stageManifest = join(stage, 'r2-assets.json');
const stageSelected = join(stage, 'selected.json');
const stageFragments = join(stage, 'fragments.ts');
const stagePrompts = join(stage, 'prompts.ts');
const stageCandidates = join(stage, 'candidates.json');
const stageTarget = join(stage, 'target');
const stageReport = join(stage, 'report.json');
const mainManifest = join(root, 'data', 'r2-assets.json');
const mainPrompts = join(root, 'src', 'data', 'prompts.ts');

if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
  throw new Error('--limit must be an integer between 1 and 100');
}

function loadEnvFile(path) {
  try {
    const text = readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  } catch {}
}

loadEnvFile(join(root, '.env.local'));
if (dryRun) process.env.R2_DRY_RUN = '1';
if (!dryRun) {
  const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']
    .filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing local R2 credentials: ${missing.join(', ')}. Add them to .env.local or use --dry-run.`);
  }
}

function run(command, commandArgs, options = {}) {
  const executable = process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command;
  console.log(`[local-curate] ${executable} ${commandArgs.join(' ')}`);
  execFileSync(executable, commandArgs, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
    ...options,
  });
}

async function main() {
  await rm(stage, { recursive: true, force: true });
  await mkdir(stage, { recursive: true });
  await cp(mainManifest, stageManifest);
  await cp(mainPrompts, stagePrompts);

  const parsed = JSON.parse(await readFile(join(root, input), 'utf8'));
  const candidates = Array.isArray(parsed) ? parsed : parsed.candidates;
  if (!Array.isArray(candidates)) throw new Error('Input must be an array or contain candidates[]');
  await writeFile(stageCandidates, JSON.stringify(candidates, null, 2) + '\n');

  run(process.execPath, [
    'scripts/curate-until-target.mjs',
    '--input', stageCandidates,
    '--output', stageSelected,
    '--manifest', stageManifest,
    '--target', String(limit),
    '--workdir', stageTarget,
  ]);
  run(process.execPath, [
    'scripts/validate-candidates.mjs',
    '--input', stageSelected,
    '--report', stageReport,
  ]);
  run(process.execPath, [
    'scripts/generate-fragments.cjs',
    '--input', stageSelected,
    '--output', stageFragments,
  ]);
  run(process.execPath, [
    'scripts/inject-fragments.cjs',
    '--existing', stagePrompts,
    '--fragments', stageFragments,
    '--output', stagePrompts,
  ]);

  const selected = JSON.parse(await readFile(stageSelected, 'utf8'));
  if (!Array.isArray(selected) || selected.length !== limit) {
    throw new Error(`Expected exactly ${limit} selected prompts, got ${selected.length}`);
  }
  const stagedText = await readFile(stagePrompts, 'utf8');
  const added = (stagedText.match(/^    slug:/gm) || []).length
    - (await readFile(mainPrompts, 'utf8')).match(/^    slug:/gm).length;
  if (added !== limit) throw new Error(`Expected ${limit} added prompts, got ${added}`);

  const original = await readFile(mainPrompts);
  try {
    await writeFile(mainPrompts, stagedText);
    run('npm', ['run', 'build']);
    run(process.execPath, ['scripts/validate-dist-assets.mjs', '--dist', 'dist', '--allowed-legacy', '25']);
  } finally {
    await writeFile(mainPrompts, original);
  }

  if (publish) {
    await writeFile(mainPrompts, stagedText);
    await cp(stageManifest, mainManifest);
    console.log(`[local-curate] published ${limit} prompts and staged R2 manifest`);
  } else {
    console.log(`[local-curate] verified ${limit} prompts; nothing published (use --publish to publish)`);
  }
  console.log(`[local-curate] stage: ${stage}`);
}

main().catch(async (error) => {
  console.error(`[local-curate] failed: ${error?.message || error}`);
  await rm(stage, { recursive: true, force: true }).catch(() => {});
  process.exitCode = 1;
});
