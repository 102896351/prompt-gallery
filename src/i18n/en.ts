// 英文 UI 文案
export const en = {
  siteName: 'AI Magic Spells',
  siteTagline: 'A curated bilingual gallery of AI image-generation prompts.',
  nav: {
    categories: 'Categories',
    collections: 'Collections',
    featured: 'Featured',
    tools: 'AI Tools',
    about: 'About',
  },
  hero: {
    titlePrefix: 'AI image-generation',
    titleSuffix: 'prompt inspiration library.',
    description:
      'A hand-picked collection of high-quality prompts for Gemini, ChatGPT, Midjourney, Stable Diffusion and more. Curated by humans, sourced from the community.',
    searchPlaceholder: 'Search prompts, authors, engines…',
  },
  editorial: {
    introLead:
      '5 keys to writing great AI prompts: subject, style, composition, lighting, and aspect ratio. Spell these out clearly so the model knows exactly what you want.',
    introDetail:
      'Advanced tips: use [INSERT ...] brackets to mark replaceable variables and turn a prompt into a reusable template; use a negative prompt to exclude unwanted elements; JSON-structured prompts work well for complex scenes. Every prompt here is tagged with difficulty, engine, and aspect ratio for easy reference.',
  },
  tips: [
    {
      title: 'The 5 Keys',
      icon: '🎯',
      detail: '5 keys to writing great AI prompts: subject, style, composition, lighting, and aspect ratio. Spell these out clearly so the model knows exactly what you want.',
    },
    {
      title: 'Reusable Templates',
      icon: '🔄',
      detail: 'Use [INSERT ...] brackets to mark replaceable variables and turn a prompt into a reusable template. For example, [INSERT CITY NAME] can be Tokyo, Paris, or Shanghai - one prompt, endless variations.',
    },
    {
      title: 'Negative Prompts',
      icon: '🚫',
      detail: 'Use a negative prompt to exclude unwanted elements. For example, "flat image, cartoon, low resolution, watermark" steers the model away from low-quality output and toward the realistic style you want.',
    },
    {
      title: 'JSON Structure',
      icon: '📦',
      detail: 'For complex scenes, use JSON-structured prompts: separate prompt, negative_prompt, and aspect_ratio into clear fields. The model parses each parameter more precisely - ideal for multi-scene, multi-subject compositions.',
    },
    {
      title: 'Aspect Ratio',
      icon: '📐',
      detail: '16:9 for landscapes and wide shots, 3:4 for portraits and vertical compositions, 1:1 for social media avatars. The right ratio changes the whole narrative feel. Every prompt here is tagged with aspect_ratio for reference.',
    },
    {
      title: 'Iterate',
      icon: '🔁',
      detail: 'Start simple, then add detail. Write the subject and style first, check the result, then layer in lighting, material, and camera parameters. A prompt that is too long upfront can make the model drift - step-by-step iteration is more controllable.',
    },
  ],
  section: {
    featured: 'Featured',
    all: 'Browse all',
    countPrompts: (n: number) => `${n} prompts`,
    countPicks: (n: number) => `${n} picks`,
    emptyState: 'No prompts match your search.',
    loadMore: 'Load more',
    pagerInfo: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    allLoaded: (n: number) => `All ${n} prompts loaded`,
  },
  filter: {
    all: 'All',
  },
  footer: {
    copyright: '© 2026',
    legalNote: 'A curated bilingual gallery of AI image-generation prompts.',
  },
  langSwitcher: {
    switchTo: '中文',
  },
  // 引擎标签（产品名/平台名 — 保留英文 + 加中文副标题）
  engines: {
    'nano-banana-pro': 'Nano Banana Pro',
    'gemini': 'Gemini',
    'chatgpt-image': 'ChatGPT Image',
    'midjourney': 'Midjourney',
    'stable-diffusion': 'Stable Diffusion',
    'flux': 'Flux',
    'sora': 'Sora',
    'veo': 'Veo',
    'kling': 'Kling',
    'other': 'Other',
  },
  // 描述性标签
  tags: {
    'reusable': '↻ Reusable',
    'json-prompt': 'JSON prompt',
    'visual-rich': 'Visual-rich',
    'chinese': 'Chinese',
    'english': 'English',
    'japanese': 'Japanese',
  },
};