// Generate 30 prompt entries with proper EN/ZH title and tagline
// Image: relative path /prompts/{slug}-1.jpg (placeholder)
// Author: kept from original Chinese name
const fs = require('fs');

const picked = JSON.parse(fs.readFileSync('selected-30.json', 'utf8'));

// Pre-built EN translations (manual, high-quality)
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
  'structured-photorealistic-portrait-early-20s-european-white-woman': 'Structured Photorealistic Portrait - Early 20s European White Woman',
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

function toPrompt(c) {
  const imgs = (c.images || []).map(i => ({
    src: i.src,
    alt: i.alt || c.title,
    width: i.width || 500,
    isThumb: false
  }));
  const slug = c.slug;
  return {
    slug,
    title: c.title,
    titleEn: titleEnMap[slug] || c.title, // fallback to title (shouldn't happen)
    tagline: pickTagline(c.prompt || c.rawBlock || ''),
    taglineEn: taglineEnMap[slug] || 'AI image prompt.',
    category: 'other',
    engines: (c.engines && c.engines.length) ? c.engines : ['other'],
    difficulty: 3,
    prompt: c.prompt || c.rawBlock || '',
    rawBlock: c.rawBlock || '',
    images: imgs,
    source: c.source || {},
    dateAdded: '2026-08-06',
    tags: ['fresh', 'community'],
    verdict: 'Community submission. Curated by editorial team.',
    reusable: !!(c.placeholders && c.placeholders.length),
    language: c.language || 'en',
    structuredData: null,
  };
}

const objs = picked.map(toPrompt);
const fragments = objs.map(o => {
  const imgsLiteral = o.images.map(i => `{"src":"${esc(i.src)}","alt":"${esc(i.alt)}","width":${i.width},"isThumb":${i.isThumb ? 'true' : 'false'}}`).join(',');
  const tagsLiteral = o.tags.map(t => `"${esc(t)}"`).join(',');
  const enginesLiteral = o.engines.map(e => `"${esc(e)}"`).join(',');
  const sourceObj = o.source || {};
  const sourceLiteral = `{"platform":"${esc(sourceObj.platform || 'X')}","sourceUrl":"${esc(sourceObj.sourceUrl || '')}","statusId":${sourceObj.statusId ? `"${esc(sourceObj.statusId)}"` : 'null'},"authorName":"${esc(sourceObj.authorName || '')}"}`;
  return `  {
    slug: "${esc(o.slug)}",
    title: "${esc(o.title)}",
    titleEn: "${esc(o.titleEn)}",
    tagline: "${esc(o.tagline)}",
    taglineEn: "${esc(o.taglineEn)}",
    category: "${o.category}",
    engines: [${enginesLiteral}],
    difficulty: ${o.difficulty},
    prompt: ${JSON.stringify(o.prompt)},
    rawBlock: ${JSON.stringify(o.rawBlock)},
    images: [${imgsLiteral}],
    source: ${sourceLiteral},
    dateAdded: "${o.dateAdded}",
    tags: [${tagsLiteral}],
    verdict: "${esc(o.verdict)}",
    reusable: ${o.reusable},
    language: "${o.language}",
    structuredData: null,
  }`;
});

const output = ',\n' + fragments.join(',\n') + '\n';
fs.writeFileSync('new-30-fragments.ts', output, 'utf8');
console.log('Generated', fragments.length, 'fragments to new-30-fragments.ts');

// Sanity check: any Chinese characters in titleEn/taglineEn?
let cnInEn = 0;
for (const o of objs) {
  if (/[\u4e00-\u9fff]/.test(o.titleEn) || /[\u4e00-\u9fff]/.test(o.taglineEn)) {
    console.log('WARN: Chinese found in EN field for', o.slug);
    cnInEn++;
  }
}
console.log('CN-in-EN warnings:', cnInEn);
console.log('Output preview (first 30 lines):');
console.log(output.split('\n').slice(0, 30).join('\n'));