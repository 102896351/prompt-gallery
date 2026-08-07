// Add taglineEn field after tagline for 30 new prompts
const fs = require('fs');
let src = fs.readFileSync('src/data/prompts.ts', 'utf8');

// slug -> English tagline translation
const taglineEnMap = {
  'y2k-aesthetic-city-impression-collage-poster': 'Y2K collage aesthetic reimagines city impressions, blending street culture, fashion portraits, and magazine layout into a paper-cut poster.',
  'd-ultraman-limited-edition-general-version': 'Cinematic Ultraman character poster with exploding glass shards filled with iconic anime scenes.',
  'sci-fi-industrial-food-fusion': 'Hardcore sci-fi industrial style meets food photography for stunning visual results.',
  'extreme-wide-angle-perspective-and-dynamic-pose-remix-edit-of-the-original-image': 'Remix any image with extreme wide-angle perspective and dynamic pose editing.',
  'golden-hour-self-portrait': 'Golden hour glow makes everything look cinematic. Drop your photo and generate a stunning self-portrait.',
  'night-portrait-young-woman-yellow-cutout-dress': 'Night portrait of a young woman in a yellow cutout dress, generated with Nano Banana Pro and Gemini 3.0.',
  'nano-banana-pro-t0r7mf': 'Surreal diorama depicting astronauts on a pizza slice as a lunar base operation.',
  'dark-underwater-siren': 'Dark mermaid underwater editorial portrait with cinematic god rays and wet skin texture.',
  'upscale-party-photography': 'High-end party photography prompt for Nano Banana Pro with glamorous lighting.',
  'cozy-christmas-couple-photo': 'Cozy Christmas couple lifestyle photo, warm and natural candid style.',
  'high-fashion-studio-editorial-portrait-southeast-asian-ceremonial-regalia': 'High fashion studio editorial portrait featuring Southeast Asian ceremonial regalia.',
  'creative-phone-edit': 'Creative phone photo editing prompt for Nano Banana Pro.',
  'pop-mart-the-monsters-x-real-human-fashion-editorial-generator': 'Pop Mart The Monsters x Real Human Fashion Editorial Generator - reusable template.',
  'modern-bento-grid-layout-product-display-design': 'Modern Bento grid layout for product display design, perfect for social media branding.',
  'business-application-case-analysis-and-tag-extraction': 'Business application case analysis with 10+ AI image generation examples and tag extraction.',
  'masterpiece-warring-states-robe-portrait': 'Masterpiece-level Warring States robe portrait photography prompt.',
  'ai-generated-fit-female-mirror-selfie': 'AI-generated fitness female mirror selfie with realistic lighting.',
  'young-woman-pink-supercar-urban-setting': 'Young woman with pink supercar in modern urban setting.',
  'leaf-cutout-art-scene': 'One leaf, one world. Intricate leaf-cutout art brings enchanting scenes to life.',
  'high-fashion-streetwear-editorial-photo': 'High fashion streetwear editorial photo prompt for Nano Banana Pro.',
  'from-single-reference-image-to-cinematic-short': 'Award-winning trailer director prompt: turn a single reference image into a cinematic short.',
  'modern-resistance-movement-storyboard-generator-la-resistenza': 'Modern resistance movement storyboard generator - La Resistenza cinematic edition.',
  'candid-portrait-on-urban-balcony': 'Candid portrait on urban balcony, natural light, Nano Banana Pro.',
  'fancy-perfume-bottle-photography': 'Fancy perfume bottle product photography, Nano Banana Pro with Gemini 3.0.',
  'young-woman-beach-wet-hair': 'Realistic young woman with wet hair on beach, golden hour lighting.',
  'ancient-forest-goddess-portrait': 'Ancient forest goddess portrait with mystical atmosphere and natural lighting.',
};

let count = 0;
for (const [slug, enTagline] of Object.entries(taglineEnMap)) {
  // Find the tagline line for this slug and insert taglineEn after it
  // Pattern: slug: "xxx" ... tagline: "yyy",
  const pattern = '(slug:\\s*"' + slug + '"[\\s\\S]*?tagline:\\s*"([^"]+)",)';
  const re = new RegExp(pattern);
  const match = src.match(re);
  if (!match) {
    console.log('WARN: slug not found - ' + slug);
    continue;
  }
  // Check if taglineEn already exists right after tagline
  const afterTagline = src.slice(match.index + match[0].length, match.index + match[0].length + 50);
  if (afterTagline.includes('taglineEn:')) {
    continue; // already has taglineEn
  }
  // Insert taglineEn after the tagline line
  const insertion = '\n    taglineEn: "' + enTagline.replace(/"/g, '\\"') + '",';
  src = src.slice(0, match.index + match[0].length) + insertion + src.slice(match.index + match[0].length);
  count++;
}

fs.writeFileSync('src/data/prompts.ts', src, 'utf8');
console.log('Added taglineEn for', count, 'prompts');
