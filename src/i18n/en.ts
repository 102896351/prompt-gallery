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
    searchPlaceholder: 'Search prompts, authors, engines…',
    // 与首页 banner 一一对应的介绍文案（同步轮播）
    slides: [
      {
        badge: '3D Render · 5/5',
        description:
          'Perfect miniature banknotes that look like real currency art. This prompt pushes ultra-macro detail and paper-engineering constraints for a museum-piece feel.',
      },
      {
        badge: 'Photography · 4/5',
        description:
          'Turn any uploaded photo into an ultra-realistic isometric diorama. Great for showcasing architecture, products, or portraits as tiny worlds.',
      },
      {
        badge: 'Photography · 3/5',
        description:
          'Restore old photographs by remixing them through a time-traveling filter. The prompt adds gentle grain, soft halation, and color shifts for authentic vintage feel.',
      },
      {
        badge: 'Tutorial · 4/5',
        description:
          'A reusable Nanobanana v1.2 guide for transparent typographic garments: brand-safe, parameter-driven, works with any logo or text you feed in.',
      },
      {
        badge: 'Photography · 4/5',
        description:
          'Miniature worlds and macro Chinese cuisine: tiny figures, tiny kitchens, tiny steam. Editorial, mouth-watering, instantly viral on social.',
      },
      {
        badge: 'Utility · 2/5',
        description:
          'A hairstyle prompt generator that turns a selfie into 10 different looks. Useful for salons, stylists, and anyone shopping for a new cut.',
      },
    ],
  },
  editorial: {
    introLead:
      '5 keys to writing great AI prompts: subject, style, composition, lighting, and aspect ratio. Spell these out clearly so the model knows exactly what you want.',
    introDetail:
      'Advanced tips: use [INSERT ...] brackets to mark replaceable variables and turn a prompt into a reusable template; use a negative prompt to exclude unwanted elements; JSON-structured prompts work well for complex scenes. Every prompt here is tagged with difficulty, engine, and aspect ratio for easy reference.',
  },
tips: [],
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