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