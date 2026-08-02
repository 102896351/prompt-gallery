// 中文 UI 文案
import type { Messages } from './en';

export const zh: Messages = {
  siteName: 'AI 魔法咒语',
  siteTagline: '一个精选的中英双语 AI 图像生成提示词画廊。',
  nav: {
    categories: '分类',
    collections: '专题',
    featured: '精选',
    tools: 'AI 工具',
    about: '关于',
  },
  hero: {
    titlePrefix: 'AI 图像生成',
    titleSuffix: '提示词灵感库。',
    description:
      '精选 Gemini、ChatGPT、Midjourney、Stable Diffusion 等高质量提示词。人工筛选，社区贡献。',
    searchPlaceholder: '搜索提示词、作者、引擎…',
  },
  editorial: {
    introLead:
      '写好 AI 提示词的 5 个关键：主体、风格、构图、光线、画面比例。把这五要素说清楚，模型才能精准理解你想要的画面。',
    introDetail:
      '进阶技巧：用方括号 [INSERT ...] 标记可替换变量，让 prompt 变成可复用模板；用 negative prompt 排除不想要的元素；JSON 结构化写法适合复杂场景。本站每条提示词都标注了难度、引擎和画面比例，方便对照学习。',
  },
  tips: [
    {
      title: '五要素法',
      icon: '🎯',
      detail: '写好 AI 提示词的 5 个关键：主体、风格、构图、光线、画面比例。把这五要素说清楚，模型才能精准理解你想要的画面。',
    },
    {
      title: '可复用模板',
      icon: '🔄',
      detail: '用方括号 [INSERT ...] 标记可替换变量，让 prompt 变成可复用模板。比如 [INSERT CITY NAME] 可以换成东京、巴黎、上海，一条 prompt 生成无数变体。',
    },
    {
      title: '反向提示词',
      icon: '🚫',
      detail: '用 negative prompt 排除不想要的元素。比如 "flat image, cartoon, low resolution, watermark" 能让模型避开低质量输出，专注生成你想要的写实风格。',
    },
    {
      title: 'JSON 结构化',
      icon: '📦',
      detail: '复杂场景用 JSON 结构化写法：把 prompt、negative_prompt、aspect_ratio 分字段写清楚。模型能更精准解析每个参数，适合多场景、多主体的复杂构图。',
    },
    {
      title: '画面比例',
      icon: '📐',
      detail: '16:9 适合风景和横构图，3:4 适合人像和竖构图，1:1 适合社交媒体头像。选对比例，画面叙事感立刻不同。本站每条都标注了 aspect_ratio 方便对照。',
    },
    {
      title: '迭代技巧',
      icon: '🔁',
      detail: '从简单描述开始，逐步添加细节。先写主体和风格，看效果后再加光线、材质、镜头参数。一次写太长反而容易让模型"跑偏"，分步迭代更可控。',
    },
  ],
  section: {
    featured: '精选',
    all: '全部提示词',
    countPrompts: (n: number) => `${n} 条提示词`,
    countPicks: (n: number) => `${n} 条精选`,
    emptyState: '没有匹配的提示词。',
    loadMore: '加载更多',
    pagerInfo: (shown: number, total: number) => `已显示 ${shown} / ${total} 条`,
    allLoaded: (n: number) => `已加载全部 ${n} 条`,
  },
  filter: {
    all: '全部',
  },
  footer: {
    copyright: '© 2026',
    legalNote: '一个精选的中英双语 AI 图像生成提示词画廊。',
  },
  langSwitcher: {
    switchTo: 'EN',
  },
  // 引擎标签（产品名/平台名 — 中文翻译）
  engines: {
    'nano-banana-pro': '纳米香蕉 Pro',
    'gemini': 'Gemini',
    'chatgpt-image': 'ChatGPT 图像',
    'midjourney': 'Midjourney',
    'stable-diffusion': 'Stable Diffusion',
    'flux': 'Flux',
    'sora': 'Sora',
    'veo': 'Veo',
    'kling': '可灵',
    'other': '其他',
  },
  // 描述性标签
  tags: {
    'reusable': '↻ 可复用',
    'json-prompt': 'JSON 提示词',
    'visual-rich': '视觉丰富',
    'chinese': '中文',
    'english': '英文',
    'japanese': '日文',
  },
};