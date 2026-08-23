#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i].replace(/^--/, '');
  args[key] = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : true;
}

const input = args.input;
const output = args.output;
const target = Number(args.target || 50);
const workDir = args.workdir || join(process.env.RUNNER_TEMP || process.env.TMPDIR || '/tmp', 'prompt-gallery-target');
const manifest = args.manifest;
if (!input || !output || !manifest) throw new Error('--input, --output and --manifest are required');
if (!Number.isInteger(target) || target < 1 || target > 100) throw new Error('--target must be an integer between 1 and 100');

const parsed = JSON.parse(await readFile(input, 'utf8'));
const candidates = Array.isArray(parsed) ? parsed : parsed.candidates;
if (!Array.isArray(candidates)) throw new Error('Input must be an array or contain candidates[]');
await rm(workDir, { recursive: true, force: true });
await mkdir(workDir, { recursive: true });

function score(candidate) {
  const prompt = candidate.prompt || candidate.rawBlock || '';
  return (candidate.images?.length ? 10 : 0)
    + (candidate.source?.sourceUrl || candidate.sourceUrl ? 5 : 0)
    + Math.min(prompt.length, 4000) / 100;
}

const ranked = [...candidates].sort((a, b) => score(b) - score(a));

function migrateCandidate(candidate, index) {
  const chunk = join(workDir, `candidate-${index}.json`);
  const migrated = join(workDir, `candidate-${index}-r2.json`);
  const report = join(workDir, `candidate-${index}-report.json`);

  return new Promise((resolve) => {
    writeFile(chunk, JSON.stringify([candidate], null, 2) + '\n')
      .then(() => {
        const child = spawn(process.execPath, [
          'scripts/migrate-assets.mjs',
          '--input', chunk,
          '--output', migrated,
          '--manifest', manifest,
          '--report', report,
        ], { stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
        let stderr = '';
        child.stderr.on('data', (data) => {
          stderr += data;
          process.stderr.write(data);
        });
        child.on('error', (error) => resolve({ ok: false, error: String(error) }));
        child.on('close', async (code) => {
          if (code !== 0) return resolve({ ok: false, error: stderr || `migrate-assets exited ${code}` });
          try {
            const result = JSON.parse(await readFile(migrated, 'utf8'));
            const good = Array.isArray(result) ? result : result.candidates;
            if (!Array.isArray(good) || good.length !== 1) {
              return resolve({ ok: false, error: 'candidate was rejected by asset migration' });
            }
            resolve({ ok: true, candidate: good[0] });
          } catch (error) {
            resolve({ ok: false, error: String(error) });
          }
        });
      })
      .catch((error) => resolve({ ok: false, error: String(error) }));
  });
}

const successes = [];
const failures = [];
const authorCounts = new Map();
let attempts = 0;

for (const candidate of ranked) {
  if (successes.length >= target) break;
  if ((candidate.images || []).length === 0) {
    failures.push({ slug: candidate.slug, error: 'candidate has no images' });
    continue;
  }
  const author = candidate.author?.name || candidate.authorGroup || candidate.source?.authorName || 'unknown';
  if ((authorCounts.get(author) || 0) >= 3) continue;

  attempts += 1;
  const result = await migrateCandidate(candidate, attempts);
  if (result.ok) {
    successes.push(result.candidate);
    authorCounts.set(author, (authorCounts.get(author) || 0) + 1);
    console.error(`[target] success ${successes.length}/${target}: ${candidate.slug}`);
  } else {
    failures.push({ slug: candidate.slug, error: result.error });
    console.error(`[target] skipped ${candidate.slug}: ${result.error}`);
  }
}

const report = { target, successes: successes.length, attempts, failures };
await writeFile(output, JSON.stringify(successes.slice(0, target), null, 2) + '\n');
await writeFile(`${output}.report.json`, JSON.stringify(report, null, 2) + '\n');
console.error(`[target] completed ${successes.length}/${target}; attempts=${attempts}; failures=${failures.length}`);
if (successes.length < target) {
  throw new Error(`Only ${successes.length}/${target} candidates passed asset migration`);
}
