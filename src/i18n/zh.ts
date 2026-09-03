// 中文 UI 文案
import type { Messages } from './en';

export const zh: Messages = {
  siteName: 'Ai Art Spell',
  siteTagline: 'AI生图提示词与中英双语 AI 绘画提示词库。',
  nav: {
    categories: '分类',
    collections: '专题',
    featured: '精选',
    tools: 'AI 工具',
    imageGenerator: 'AI 生图',
    about: '关于',
  },
  hero: {
    titlePrefix: 'AI 图像生成',
    titleSuffix: '提示词灵感库。',
    searchPlaceholder: '搜索提示词、作者、引擎…',
    // 与首页 banner 一一对应的介绍文案（同步轮播）
    slides: [
      {
        badge: '3D 渲染 · 5/5',
        description:
          '真实纸币级别的微缩纸币作品。这个提示词把超微距细节和纸艺工程推到极致，生成博物馆藏品质感。',
      },
      {
        badge: '摄影 · 4/5',
        description:
          '把任意上传照片变成超写实等距微缩场景。适合把建筑、产品、人像做成迷你小世界。',
      },
      {
        badge: '摄影 · 3/5',
        description:
          '用穿越时空滤镜修复老照片：添加柔和颗粒、光晕、色偏，还原真实复古质感。',
      },
      {
        badge: '教程 · 4/5',
        description:
          'Nanobanana v1.2 透明文字服装可复用指南：参数化、品牌安全，输入任意 logo 都能直接生成。',
      },
      {
        badge: '摄影 · 4/5',
        description:
          '微缩世界 + 宏观中国菜：小人、小厨房、小蒸汽。画面有食欲、适合社媒传播。',
      },
    ],
  },
  editorial: {
    introLead:
      '写好 AI 提示词的 5 个关键：主体、风格、构图、光线、画面比例。把这五要素说清楚，模型才能精准理解你想要的画面。',
    introDetail:
      '进阶技巧：用方括号 [INSERT ...] 标记可替换变量，让 prompt 变成可复用模板；用 negative prompt 排除不想要的元素；JSON 结构化写法适合复杂场景。本站每条提示词都标注了难度、引擎和画面比例，方便对照学习。',
  },
  tips: [],
  section: {
    featured: '精选',
    specials: '专题',
    specialsBrowse: '查看全部专题 →',
    all: '全部提示词',
    countPrompts: () => `编辑团队精选`,
    countPicks: () => `编辑精选`,
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
    'nano-banana-pro': 'Nano Banana Pro',
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