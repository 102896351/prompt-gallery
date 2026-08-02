# Prompt Gallery

A curated, bilingual (English & Simplified Chinese) gallery of AI image-generation prompts.

> A fast, hand-curated static site for AI image-generation prompts.

## Highlights

- **300 hand-picked prompts** across 11 categories (3D Render, Illustration, Photography, Portrait, etc.)
- **One-click copy** of every prompt (the thing aiart.pics is missing)
- **Bilingual UI** (English + Simplified Chinese); prompt text stays in its original language
- **Pure static site** — no backend, no database, deployed to GitHub Pages
- **Author attribution** preserved for every entry (original source URL on each prompt)
- **Daily curation** via GitHub Actions; **instant updates** when you tell me

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build → dist/
```

## Project structure

```
prompt-gallery/
├── src/
│   ├── data/prompts.ts          # the curated dataset (single source of truth)
│   ├── i18n/                    # UI strings: en.ts, zh.ts
│   ├── layouts/Base.astro       # shared layout with hreflang + JSON-LD
│   ├── components/
│   │   ├── PromptCard.astro     # grid card
│   │   └── PromptImage.astro    # lazy-load + fallback
│   ├── pages/
│   │   ├── index.astro          # English homepage
│   │   ├── zh/index.astro       # Chinese homepage
│   │   ├── about.astro + zh/about.astro
│   │   ├── contact.astro + zh/contact.astro
│   │   ├── disclaimer.astro + zh/disclaimer.astro
│   │   ├── privacy.astro + zh/privacy.astro
│   │   └── prompt/[slug].astro + zh/prompt/[slug].astro
│   └── styles/global.css
├── scripts/
│   ├── extract-prompts.mjs      # stream README → candidates.json
│   └── curate-prompts.mjs       # dedupe + score + diversity → prompts.ts
├── public/                      # favicon, robots.txt, fallback.svg, ads.txt
└── .github/workflows/
    ├── deploy.yml               # build + deploy to GitHub Pages
    └── curate-daily.yml         # daily fetch + diff + auto-PR
```

## Update mechanism — two tracks

### Track 1: GitHub Actions (automated, daily)

`.github/workflows/curate-daily.yml` runs every day at 02:00 UTC (10:00 Beijing time):

1. Download the latest community data dump
2. Run `extract-prompts.mjs` → up to 1500 candidates
3. Run `curate-prompts.mjs --mode append` → diff against existing `prompts.ts`
4. If new prompts exist, open a Pull Request with:
   - title: `Daily curation: N new prompts`
   - body: listing each new entry (title, author, source URL, score)

You review the PR → Approve → auto-merge → auto-deploy. About 60 minutes of GitHub Actions free quota per month.

Manual trigger: `Actions` tab → `Daily curation` → `Run workflow`.

### Track 2: Instant updates (you tell me)

Just tell me (ZCode) things like:

- "Add this prompt: `<X post URL or prompt text>`"
- "Remove slug `xxx`"
- "Change verdict for slug `yyy` to: ..."

I handle the rest: edit `prompts.ts`, commit, push, deploy.

## Data flow

```
Community submissions (X, Xiaohongshu, Discord, etc.)
        ↓ fetch (daily, automated)
Raw markdown (~9.5 MB)
        ↓ remark-parse AST
extract-prompts.mjs → ~1500 candidates
        ↓ JSON 容错解析 + 评分 + 去重 + 多样性
curate-prompts.mjs → 300-500 curated
        ↓
src/data/prompts.ts (TypeScript)
        ↓ Astro build
611 static HTML pages
        ↓
GitHub Pages
```

## Curation rules

Quality score (max ~100):

```
score = images*4 + (jsonLang?8:0) + (structured?12:0)
      + (aspectRatio?5:0) + (negativePrompt?5:0)
      + (length≥200?8:0) + (length≥800?4:0)
      + (placeholders?5:0) + (images≥2?4:0)
      + (lang=en?3:0) + (length≥50?2:0) + (source?3:0)
```

Diversity constraints:

- Max **4 entries** per author
- Max **2 entries** per template-variant cluster (token Jaccard ≥ 0.92)
- JSON prompt share **20% – 45%**
- At least **70%** entries have ≥ 1 image

## SEO

Structured data (JSON-LD), emitted on every build:

- **WebSite + Organization** — all pages (`src/layouts/Base.astro`), includes SearchAction for sitelinks search box
- **Article** — prompt detail pages (`src/pages/prompt/[slug].astro`, `src/pages/zh/prompt/[slug].astro`); was `CreativeWork`, upgraded for richer indexing
- **ItemList** — homepages (`src/pages/index.astro`, `src/pages/zh/index.astro`), top 50 prompts
- **BreadcrumbList** — prompt detail pages (matches the visible breadcrumb)
- **FAQPage** — about pages (`src/pages/about.astro`, `src/pages/zh/about.astro`), 5 Q&As each

All `@context` use the canonical `https://schema.org` (no `www.`). All JSON-LD URLs derive from `Astro.site` — no hardcoded domains, so changing `site` in `astro.config.mjs` is the only edit needed at launch.

### Sitemap & hreflang

`@astrojs/sitemap` generates `sitemap-index.xml` (650 URLs). The `i18n` option emits `xhtml:link` hreflang alternates (`en` + `zh-Hans`) on every URL, matching the `<link rel="alternate">` tags in `Base.astro`. This avoids the "missing hreflang" warning in Google Search Console.

### llms.txt

`public/llms.txt` describes the site for LLM crawlers and lists key pages + all 11 categories. AI crawlers are explicitly allowed in `public/robots.txt`.

### Google Search Console — submit sitemap (one-time, after launch)

1. Verify domain ownership in [Google Search Console](https://search.google.com/search-console) (DNS TXT record is easiest for a root-domain property).
2. Set the real domain in **two places** (search/replace `prompt-gallery.example.com`):
   - `astro.config.mjs` → `site:`
   - `public/robots.txt` → `Sitemap:` line
3. `npm run build`, deploy, then confirm `https://YOUR_DOMAIN/sitemap-index.xml` returns XML in a browser.
4. In GSC → **Sitemaps** → submit `sitemap-index.xml`. Status should flip to "Success" within a day.
5. Use GSC → **URL Inspection** to request indexing for the homepage + a few key prompt pages.

## License

Each prompt entry retains its original author's credit (source URL preserved on every detail page).

Site code: see LICENSE (TBD).

Editorial framing, verdict text, and copy buttons: original work by this project's authors.