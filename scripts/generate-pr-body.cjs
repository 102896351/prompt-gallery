#!/usr/bin/env node
// ============================================================
//  generate-pr-body.cjs
//  -----------------------------------------------------------
//  生成 PR body（Markdown 格式），列出新加的 prompt 条目供人工 review
//
//  Usage:
//    node scripts/generate-pr-body.cjs \
//      --selected /tmp/curate/selected.json \
//      --added 30 \
//      --output /tmp/pr-body.md
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
  const added = parseInt(opts.added || '0', 10);
  const selected = JSON.parse(fs.readFileSync(opts.selected, 'utf8'));

  // 按作者分组
  const byAuthor = {};
  for (const c of selected) {
    const a = (c.author && c.author.name) || 'unknown';
    if (!byAuthor[a]) byAuthor[a] = [];
    byAuthor[a].push(c);
  }

  let md = `## Weekly Curation: ${added} new prompts\n\n`;
  md += `Auto-curated from [Jermic/awesome-aiart-pics-prompts](https://github.com/Jermic/awesome-aiart-pics-prompts).\n\n`;
  md += `### Stats\n`;
  md += `- **Added**: ${added} new prompts\n`;
  md += `- **Unique authors**: ${Object.keys(byAuthor).length}\n`;
  md += `- **Date**: ${new Date().toISOString().slice(0, 10)}\n\n`;
  md += `### New prompts by author\n\n`;

  for (const [author, items] of Object.entries(byAuthor).sort((a, b) => b[1].length - a[1].length)) {
    md += `#### ${author} (${items.length})\n`;
    for (const c of items) {
      const title = c.title.length > 60 ? c.title.slice(0, 60) + '…' : c.title;
      md += `- **${title}** ([src](${(c.source && c.source.sourceUrl) || 'no-url'})) — ${(c.images || []).length} img\n`;
    }
    md += '\n';
  }

  md += `### Review checklist\n\n`;
  md += `- [ ] Verify image URLs load (img1.aiart.pics)\n`;
  md += `- [ ] Verify author attribution preserved\n`;
  md += `- [ ] Verify no NSFW / spammy content\n`;
  md += `- [ ] Verify EN titleEn + taglineEn are not Chinese\n`;
  md += `- [ ] Approve and merge → auto-deploy to https://aiartspell.art/\n`;

  fs.writeFileSync(opts.output, md, 'utf8');
  console.log(`[generate-pr-body] wrote ${md.length} bytes to ${opts.output}`);
}

main();