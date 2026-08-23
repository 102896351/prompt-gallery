#!/usr/bin/env node
// ============================================================
//  generate-fragments.cjs
//  -----------------------------------------------------------
//  从 selected.json 生成 TypeScript 对象片段（含 EN/ZH titleEn/taglineEn）
//  避免上次 bug（中文化 title）
//
//  Usage:
//    node scripts/generate-fragments.cjs \
//      --input /tmp/curate/selected.json \
//      --output /tmp/curate/fragments.ts
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

// 必须和 generate-30-entries.cjs 保持一致
const titleEnMap = {
  'high-fashion-double-exposure-photography': 'High Fashion Double Exposure Photography',
  'nano-banana-pro-photorealistic-90s-selfie-emotion-grid': 'Nano Banana Pro Photorealistic 90s Selfie Emotion Grid',
  '24-solar-terms-nourishing-soup-creative-display': '24 Solar Terms Nourishing Soup Creative Display',
  'neon-sign-design-showcase': 'Neon Sign Design Showcase',
  'wuyi-mountain-big-red-robe-cultural-infographic': 'Wuyi Mountain Big Red Robe Cultural Infographic',
  'nighttime-explosion-iphone-photography': 'Nighttime Explosion iPhone Photography',
  'physical-floor-mirror-selfie': 'Physical Floor Mirror Selfie',
  'retro-style-asian-female-portrait': 'Retro Style Asian Female Portrait',
  'vibrant-mediterranean-escape-top-summer-travel-list-choice': 'Vibrant Mediterranean Escape - Top Summer Travel List Choice',
  'nano-banana-pro-photography-of-the-retro-gamer-girl': 'Nano Banana Pro Photography of the Retro Gamer Girl',
  'quiet-room-strong-angles': 'Quiet Room Strong Angles',
  '1960s-hong-kong-wuxia-movie-still': '1960s Hong Kong Wuxia Movie Still',
  'structured-photorealistic-portrait-early-20s-european-white-woman': 'Structured Photorealistic Portrait - Early 20s European Woman',
  'nano-banana-pro-stylish-young-woman-subway-motion': 'Nano Banana Pro Stylish Young Woman Subway Motion',
  'celebrity-achievement-illustration': 'Celebrity Achievement Illustration',
  'nano-banana-pro-gemini-3-0': 'Nano Banana Pro Gemini 3.0',
  'avant-garde-high-fashion-portrait': 'Avant-Garde High Fashion Portrait',
  'high-fashion-garden-editorial-borderless-diagonal-leaning-pose-with-glowing-led-2026-headband': 'High Fashion Garden Editorial - Borderless Diagonal Leaning Pose with Glowing LED 2026 Headband',
  'modern-office-scene-woman-macbook-screen': 'Modern Office Scene - Woman with MacBook Screen',
  'high-end-studio-fashion-editorial-5-panel-wide-film-collage': 'High End Studio Fashion Editorial - 5 Panel Wide Film Collage',
  'a-woman-taking-the-subway': 'A Woman Taking the Subway',
  'hair-transplant-progression': 'Hair Transplant Progression',
  'auto-creative-music-video-storyboard-generator-uudrhr': 'Auto Creative Music Video Storyboard Generator',
  'a-new-kind-of-power': 'A New Kind of Power',
  'auto-creative-music-video-storyboard-generator': 'Auto Creative Music Video Storyboard Generator (Alt)',
  'city-asleep': 'City Asleep',
  'beautiful-lady-artwork': 'Beautiful Lady Artwork',
  'basquiat-inspired-music-video-storyboard': 'Basquiat-Inspired Music Video Storyboard',
  'ultra-photorealistic-cinematic-portrait-on-the-aft-deck-of-a-luxury-yacht': 'Ultra Photorealistic Cinematic Portrait on the Aft Deck of a Luxury Yacht',
  'hand-drawn-calendar-illustration': 'Hand Drawn Calendar Illustration',
};

const taglineEnMap = {
  'high-fashion-double-exposure-photography': 'Fashion editorial double exposure combining portrait with abstract elements.',
  'nano-banana-pro-photorealistic-90s-selfie-emotion-grid': 'Realistic selfie emotion grid in 90s retro film style.',
  '24-solar-terms-nourishing-soup-creative-display': '24 Chinese solar terms presented as nourishing soup creative display.',
  'neon-sign-design-showcase': 'Vibrant neon sign design showcase for stores and venues.',
  'wuyi-mountain-big-red-robe-cultural-infographic': 'Wuyi Mountain cultural infographic with traditional red robe style.',
  'nighttime-explosion-iphone-photography': 'Dramatic nighttime explosion photography captured on iPhone.',
  'physical-floor-mirror-selfie': 'Floor mirror selfie with creative physics-defying pose.',
  'retro-style-asian-female-portrait': 'Asian female portrait in vintage retro photography style.',
  'vibrant-mediterranean-escape-top-summer-travel-list-choice': 'Vibrant Mediterranean travel destination with summer vibes.',
  'nano-banana-pro-photography-of-the-retro-gamer-girl': 'Retro gamer girl portrait in Nano Banana Pro cinematic style.',
  'quiet-room-strong-angles': 'Quiet room portrait with strong geometric angles.',
  '1960s-hong-kong-wuxia-movie-still': '1960s Hong Kong wuxia movie style cinematic still.',
  'structured-photorealistic-portrait-early-20s-european-white-woman': 'Structured photorealistic portrait of an early-20s European woman.',
  'nano-banana-pro-stylish-young-woman-subway-motion': 'Stylish young woman subway motion shot in Nano Banana Pro.',
  'celebrity-achievement-illustration': 'Celebrity achievement infographic with Bauhaus geometric style.',
  'nano-banana-pro-gemini-3-0': 'Nano Banana Pro with Gemini 3.0 multi-model composition.',
  'avant-garde-high-fashion-portrait': 'Avant-garde high fashion portrait with bold composition.',
  'high-fashion-garden-editorial-borderless-diagonal-leaning-pose-with-glowing-led-2026-headband': 'High fashion garden editorial with borderless diagonal pose and glowing LED headband.',
  'modern-office-scene-woman-macbook-screen': 'Modern office scene featuring woman working on MacBook.',
  'high-end-studio-fashion-editorial-5-panel-wide-film-collage': 'High end studio fashion editorial as 5-panel film collage.',
  'a-woman-taking-the-subway': 'Cinematic portrait of a woman taking the subway.',
  'hair-transplant-progression': 'Hair transplant progression documentation style.',
  'auto-creative-music-video-storyboard-generator-uudrhr': 'Auto creative music video storyboard generator.',
  'a-new-kind-of-power': 'Power-themed creative photography with bold vision.',
  'auto-creative-music-video-storyboard-generator': 'Auto creative music video storyboard generator (alternative version).',
  'city-asleep': 'City sleeping, atmospheric night photography.',
  'beautiful-lady-artwork': 'Beautiful lady artwork in painterly style.',
  'basquiat-inspired-music-video-storyboard': 'Basquiat-inspired music video storyboard with raw artistic style.',
  'ultra-photorealistic-cinematic-portrait-on-the-aft-deck-of-a-luxury-yacht': 'Ultra photorealistic cinematic portrait on the aft deck of a luxury yacht.',
  'hand-drawn-calendar-illustration': 'Hand-drawn calendar illustration with vintage style.',
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n');
}

function pickTagline(prompt) {
  const lines = (prompt || '').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 12) continue;
    if (/^[-=*#`]+$/.test(t)) continue;
    if (t.startsWith('提示词') || t.startsWith('分享') || t.startsWith('---') || t.startsWith('🍌')) continue;
    return t.slice(0, 120);
  }
  return (prompt || '').slice(0, 100);
}

function main() {
  const opts = parseArgs();
  const selected = JSON.parse(fs.readFileSync(opts.input, 'utf8'));

  const fragments = selected.map(c => {
    const slug = c.slug;
    const imgs = (c.images || []).map(i => ({
      src: i.src,
      alt: i.alt || c.title,
      width: i.width || 500,
      isThumb: Boolean(i.isThumb || i.variant === 'thumb')
    }));
    const imgsLiteral = imgs.map(i => `{"src":"${esc(i.src)}","alt":"${esc(i.alt)}","width":${i.width},"isThumb":${i.isThumb ? 'true' : 'false'}}`).join(',');
    const tagsLiteral = ['fresh', 'community'].map(t => `"${esc(t)}"`).join(',');
    const enginesLiteral = (c.engines && c.engines.length ? c.engines : ['other']).map(e => `"${esc(e)}"`).join(',');
    const sourceObj = c.source || {};
    const sourceLiteral = `{"platform":"${esc(sourceObj.platform || 'X')}","sourceUrl":"${esc(sourceObj.sourceUrl || '')}","statusId":${sourceObj.statusId ? `"${esc(sourceObj.statusId)}"` : 'null'},"authorName":"${esc(sourceObj.authorName || '')}"}`;

    return `  {
    slug: "${esc(slug)}",
    title: "${esc(c.title)}",
    titleEn: "${esc(titleEnMap[slug] || c.title)}",
    tagline: "${esc(pickTagline(c.prompt || c.rawBlock || ''))}",
    taglineEn: "${esc(taglineEnMap[slug] || 'AI image prompt.')}",
    category: "other",
    engines: [${enginesLiteral}],
    difficulty: 3,
    prompt: ${JSON.stringify(c.prompt || c.rawBlock || '')},
    rawBlock: ${JSON.stringify(c.rawBlock || '')},
    images: [${imgsLiteral}],
    source: ${sourceLiteral},
    dateAdded: "${new Date().toISOString().slice(0, 10)}",
    tags: [${tagsLiteral}],
    verdict: "Community submission. Curated by editorial team.",
    reusable: ${!!(c.placeholders && c.placeholders.length)},
    language: "${c.language || 'en'}",
    structuredData: null,
  }`;
  });

  const output = ',\n' + fragments.join(',\n') + '\n';
  fs.writeFileSync(opts.output, output, 'utf8');
  console.log(`[generate-fragments] wrote ${fragments.length} fragments to ${opts.output}`);
}

main();