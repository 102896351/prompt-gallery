// ============================================================
//  extract-prompts.mjs
//  阶段 A：从原 README 流式解析 → candidates.json
//
//  用法:
//    node scripts/extract-prompts.mjs                # 默认输出到 src/data/prompts.candidates.json
//    node scripts/extract-prompts.mjs > out.json     # 输出到 stdout
//
//  关键设计:
//    - 流式读取（不下载到磁盘）
//    - 用 remark AST 而不是正则（避免 JSON 风格 fence 误识别）
//    - H3 + /prompt/ link 作为条目起点（不要把"## 数据来源"误识别为 prompt）
//    - 收集 ~1000 条候选后停止（不需要全量 5233 条）
// ============================================================

import { unified } from 'unified';
import remarkParse from 'remark-parse';

// 数据源 URL：从社区订阅或您自己的数据源拉取（README URL 仅作为占位示例）
const README_URL =
  process.env.README_URL ??
  'https://raw.githubusercontent.com/Jermic/awesome-aiart-pics-prompts/master/README.md';
// 允许通过本地文件读取，避开 Windows + Node 18 undici 偶发 ECONNRESET
const LOCAL_FILE = process.env.LOCAL_FILE; // e.g. /tmp/readme.md

const MAX_CANDIDATES = parseInt(process.env.MAX_CANDIDATES ?? '1200', 10);
const MIN_PROMPT_LENGTH = parseInt(process.env.MIN_PROMPT_LENGTH ?? '20', 10);

// ---------- helpers ----------

/**
 * 从 URL pathname 提取 slug（保留 URL 编码字符如 [ ]）。
 * 不用 slugify，权威 slug 是 README 自己写的。
 */
function extractSlug(promptUrl) {
  try {
    const u = new URL(promptUrl);
    const pathname = decodeURIComponent(u.pathname);
    const m = pathname.match(/^\/prompt\/(.+)$/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/**
 * 从 X 状态 URL 提取 status id。
 */
function extractStatusId(url) {
  if (!url) return null;
  const m = url.match(/status\/(\d+)/);
  return m ? m[1] : null;
}

/**
 * 找节点区间 [start, end)：从 H3 prompt 起点开始，到下一个 prompt H3 / 下一个 H2 作者分组。
 */
function findEntryRange(children, startIdx) {
  for (let i = startIdx + 1; i < children.length; i++) {
    const node = children[i];
    if (node.type === 'heading') {
      if (node.depth === 2) return i;
      if (node.depth === 3) {
        const hasPromptLink = (node.children || []).some(
          (c) => c.type === 'link' && /\/(zh\/)?prompt\//.test(c.url || ''),
        );
        if (hasPromptLink) return i;
      }
    }
  }
  return children.length;
}

/**
 * 从一组节点里找带特定 label 的 paragraph：例如 "**作者**: [@xxx](https://x.com/xxx)"
 */
function extractField(paragraphs, label) {
  for (const p of paragraphs) {
    if (p.type !== 'paragraph') continue;
    const text = stringifyNode(p);
    if (text.startsWith(label + ':') || text.startsWith(label + '：')) {
      const link = (p.children || []).find((c) => c.type === 'link');
      return {
        text: text.slice(label.length + 1).trim(),
        url: link?.url,
      };
    }
  }
  return null;
}

function stringifyNode(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (node.value) return node.value;
  return (node.children || []).map(stringifyNode).join('');
}

/**
 * 从 HTML 节点提取 <img> 属性。
 */
function extractImages(htmlNodes) {
  const images = [];
  for (const n of htmlNodes) {
    if (n.type !== 'html') continue;
    const value = n.value || '';
    const matches = [...value.matchAll(/<img\s+([^>]+)>/g)];
    for (const m of matches) {
      const attrs = m[1];
      const src = attrs.match(/src="([^"]+)"/)?.[1];
      if (!src) continue;
      const alt = attrs.match(/alt="([^"]*)"/)?.[1];
      const width = parseInt(attrs.match(/width="(\d+)"/)?.[1] ?? '0', 10) || undefined;
      if (!src.includes('/images/prompts/')) continue; // 过滤掉 logo 等
      const filename = src.split('/').pop();
      images.push({
        src,
        alt,
        width,
        filename,
        variant: filename?.includes('thumb') ? 'thumb' :
                 filename?.includes('cover') ? 'cover' : 'original',
      });
    }
  }
  return images;
}

/**
 * 从一段 prompt 文本提取占位符（如 [INSERT CITY]）。
 */
function extractPlaceholders(text) {
  if (!text) return [];
  const matches = [
    ...text.matchAll(/\[([A-Z][A-Z0-9_ -]{2,40})\]/g),
    ...text.matchAll(/\[INSERT\s+([^\]]+)\]/gi),
    ...text.matchAll(/\{([a-z_][a-z0-9_]{2,30})\}/gi),
  ];
  return [...new Set(matches.map((m) => m[0]))];
}

/**
 * 从正文推断引擎（基于关键词匹配）。
 */
function inferEngines(text) {
  const lower = (text || '').toLowerCase();
  const hits = new Set();
  if (/nano\s*banana(\s*pro)?/.test(lower)) hits.add('nano-banana-pro');
  if (/midjourney|mj\s*v?\d/.test(lower)) hits.add('midjourney');
  if (/chatgpt|gpt-?image|gpt-image-?1/.test(lower)) hits.add('chatgpt-image');
  if (/stable\s*diffusion|sd\s*xl|sd3/.test(lower)) hits.add('stable-diffusion');
  if (/flux/.test(lower)) hits.add('flux');
  if (/sora/.test(lower)) hits.add('sora');
  if (/veo/.test(lower)) hits.add('veo');
  if (/kling/.test(lower)) hits.add('kling');
  if (hits.size === 0) hits.add('other');
  return [...hits];
}

/**
 * 从正文推断语言（基于字符范围启发式）。
 */
function inferLanguage(text) {
  if (!text) return 'other';
  const len = text.length;
  if (len === 0) return 'other';
  const han = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const hiragana = (text.match(/[\u3040-\u309f]/g) || []).length;
  const katakana = (text.match(/[\u30a0-\u30ff]/g) || []).length;
  const cjk = han + hiragana + katakana;
  if (cjk / len > 0.3) {
    if (hiragana + katakana > han) return 'ja';
    return 'zh';
  }
  // ASCII 字母 > 80% 视为英文
  const ascii = (text.match(/[\x20-\x7e]/g) || []).length;
  if (ascii / len > 0.8) return 'en';
  return 'other';
}

// ---------- main ----------

async function main() {
  let markdown;
  if (LOCAL_FILE) {
    console.error(`[extract] Reading from local file: ${LOCAL_FILE}`);
    const { readFile } = await import('node:fs/promises');
    markdown = await readFile(LOCAL_FILE, 'utf8');
  } else {
    console.error(`[extract] Fetching README from ${README_URL}…`);
    const res = await fetch(README_URL, {
      headers: { 'user-agent': 'prompt-gallery-extract/1.0' },
    });
    if (!res.ok) {
      throw new Error(`README fetch failed: ${res.status} ${res.statusText}`);
    }
    console.error('[extract] Downloading markdown…');
    markdown = await res.text();
  }
  console.error(`[extract] Loaded ${(markdown.length / 1024 / 1024).toFixed(2)} MB`);

  console.error('[extract] Parsing AST…');
  const tree = unified().use(remarkParse).parse(markdown);
  const children = tree.children || [];

  const candidates = [];
  let currentAuthor = null;

  for (let i = 0; i < children.length && candidates.length < MAX_CANDIDATES; i++) {
    const node = children[i];

    if (node.type === 'heading' && node.depth === 2) {
      currentAuthor = stringifyNode(node).trim();
      continue;
    }

    if (node.type !== 'heading' || node.depth !== 3) continue;

    const linkNode = (node.children || []).find(
      (c) => c.type === 'link' && /\/(zh\/)?prompt\//.test(c.url || ''),
    );
    if (!linkNode || !linkNode.url) continue;

    const title = stringifyNode(node).trim();
    const slug = extractSlug(linkNode.url);
    if (!slug) continue;

    const rangeEnd = findEntryRange(children, i);
    const slice = children.slice(i + 1, rangeEnd);

    // 把 slice 拆成 paragraphs / images / code blocks / html
    const paragraphs = [];
    const htmlNodes = [];
    const codeBlocks = [];
    for (const n of slice) {
      if (n.type === 'paragraph') paragraphs.push(n);
      else if (n.type === 'html') htmlNodes.push(n);
      else if (n.type === 'code') {
        codeBlocks.push({
          language: n.lang || null,
          raw: n.value || '',
        });
      }
      // 其他节点（heading, thematicBreak, text）忽略
    }

    const authorField = extractField(paragraphs, '作者');
    const sourceField = extractField(paragraphs, '来源');
    const images = extractImages(htmlNodes);

    // 选第一个 code block 作为主 prompt
    const mainBlock = codeBlocks[0];
    const rawBlock = mainBlock?.raw || '';
    const prompt = rawBlock.trim();
    if (prompt.length < MIN_PROMPT_LENGTH && images.length === 0) continue;

    // 找日期（从图片路径）
    const dateFromImage = images
      .map((img) => img.src.match(/\/(\d{8})\//)?.[1])
      .find(Boolean);

    const placeholders = extractPlaceholders(prompt);
    const engines = inferEngines(prompt + ' ' + title);
    const language = inferLanguage(prompt || title);
    const sourceUrl = sourceField?.url || linkNode.url;

    candidates.push({
      slug,
      title,
      promptUrl: linkNode.url,
      authorGroup: currentAuthor,
      author: {
        name: authorField?.text?.replace(/^@/, '') || currentAuthor || 'unknown',
        profileUrl: authorField?.url,
        platform: sourceUrl?.includes('x.com') || sourceUrl?.includes('twitter.com')
          ? 'X'
          : 'Other',
      },
      source: {
        platform: sourceUrl?.includes('x.com') ? 'X' : 'Other',
        sourceUrl,
        statusId: extractStatusId(sourceUrl),
        authorName: authorField?.text?.replace(/^@/, '') || currentAuthor || 'unknown',
      },
      images,
      codeBlocks,
      rawBlock,
      prompt,
      datePath: dateFromImage,
      engines,
      language,
      placeholders,
    });
  }

  console.error(`[extract] Collected ${candidates.length} candidates.`);

  // 输出到 stdout（让 curate 脚本接收）
  const json = JSON.stringify(
    {
      schemaVersion: '1.0',
      source: {
        repository: 'community-curated',
        readmeUrl: README_URL,
        fetchedAt: new Date().toISOString(),
      },
      candidates,
    },
    null,
    2,
  );
  process.stdout.write(json);
}

main().catch((err) => {
  console.error('[extract] Fatal:', err);
  process.exit(1);
});