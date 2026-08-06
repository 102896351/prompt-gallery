// ============================================================
//  AI 图像/视频生成引擎数据库
//  -----------------------------------------------------------
//  国内外主流 AI 图像/视频生成工具。每条含中英文名、一句话简介、官网链接。
//  详情页用 getCompatibleEngines(prompt) 合并 prompt.engines 与本表生成卡片列表。
//
//  链接全部指向官方主页或主产品页（外链，rel=noopener）。
// ============================================================

export interface Engine {
  /** prompt.engines 字段用的 key */
  key: string;
  /** 英文名 */
  nameEn: string;
  /** 中文名（ZH 站展示） */
  nameZh: string;
  /** 一句话英文简介（EN 站展示） */
  descEn: string;
  /** 一句话中文简介（ZH 站展示） */
  descZh: string;
  /** 跳转外链（官方主页/产品页） */
  url: string;
  /** Logo 路径（public/tool-icons/<file>.svg），无 logo 用 emoji 兜底 */
  icon?: string;
  /** 兜底 emoji（无 logo 时显示） */
  emoji: string;
}

export const engines: Record<string, Engine> = {
  // ========== 海外 ==========
  gemini: {
    key: 'gemini',
    nameEn: 'Google Gemini',
    nameZh: 'Google Gemini',
    descEn: "Google's multimodal AI. Nano Banana Pro is its image model.",
    descZh: '谷歌多模态 AI，Nano Banana Pro 是其图像生成模型。',
    url: 'https://gemini.google.com/',
    icon: '/tool-icons/google-gemini.png',
    emoji: '✨',
  },
  'nano-banana-pro': {
    key: 'nano-banana-pro',
    nameEn: 'Nano Banana Pro',
    nameZh: 'Nano Banana Pro',
    descEn: 'Google DeepMind image model, strong at text and detail.',
    descZh: 'Google DeepMind 图像模型，文字渲染与细节出色。',
    url: 'https://gemini.google.com/',
    icon: '/tool-icons/google-gemini.png',
    emoji: '🍌',
  },
  midjourney: {
    key: 'midjourney',
    nameEn: 'Midjourney',
    nameZh: 'Midjourney',
    descEn: 'Discord-based, strong artistic style and cinematic look.',
    descZh: '基于 Discord，擅长艺术风格与电影感画面。',
    url: 'https://www.midjourney.com/',
    icon: '/tool-icons/midjourney.png',
    emoji: '🎨',
  },
  flux: {
    key: 'flux',
    nameEn: 'Flux',
    nameZh: 'Flux',
    descEn: 'Black Forest Labs open model, photorealistic + typography.',
    descZh: 'Black Forest Labs 开源模型，写实与排版能力强。',
    url: 'https://blackforestlabs.ai/',
    icon: '/tool-icons/flux-1.ico',
    emoji: '🌊',
  },
  'stable-diffusion': {
    key: 'stable-diffusion',
    nameEn: 'Stable Diffusion',
    nameZh: 'Stable Diffusion',
    descEn: 'Open-source diffusion model, runs locally or in the cloud.',
    descZh: '开源扩散模型，可本地或云端运行。',
    url: 'https://stability.ai/',
    icon: '/tool-icons/stable-diffusion.webp',
    emoji: '⚙️',
  },
  'chatgpt-image': {
    key: 'chatgpt-image',
    nameEn: 'ChatGPT (DALL-E)',
    nameZh: 'ChatGPT (DALL-E)',
    descEn: 'OpenAI conversational interface + DALL-E image model.',
    descZh: 'OpenAI 对话式界面 + DALL-E 图像模型。',
    url: 'https://chatgpt.com/',
    icon: '/tool-icons/openai.ico',
    emoji: '💬',
  },
  sora: {
    key: 'sora',
    nameEn: 'Sora',
    nameZh: 'Sora',
    descEn: 'OpenAI video generation, cinematic clips up to 60s.',
    descZh: 'OpenAI 视频生成，可输出最长 60 秒电影感片段。',
    url: 'https://sora.com/',
    icon: '/tool-icons/openai.ico',
    emoji: '🎬',
  },
  veo: {
    key: 'veo',
    nameEn: 'Veo',
    nameZh: 'Veo',
    descEn: 'Google DeepMind video model, 1080p clips with audio.',
    descZh: 'Google DeepMind 视频模型，1080p 含音轨。',
    url: 'https://deepmind.google/technologies/veo/',
    icon: '/tool-icons/google-gemini.png',
    emoji: '🎞️',
  },
  kling: {
    key: 'kling',
    nameEn: 'Kling',
    nameZh: '可灵',
    descEn: 'Kuaishou video model, motion + camera control.',
    descZh: '快手视频模型，运镜与动作控制细腻。',
    url: 'https://klingai.com/',
    icon: '/tool-icons/kling-ai.ico',
    emoji: '🎥',
  },

  // ========== 国内 ==========
  doubao: {
    key: 'doubao',
    nameEn: 'Doubao',
    nameZh: '豆包',
    descEn: "ByteDance AI chatbot. Nano Banana Pro is its image model.",
    descZh: '字节跳动 AI 对话产品，支持图像生成与多模态。',
    url: 'https://www.doubao.com/chat/',
    icon: '/tool-icons/doubao.png',
    emoji: '🥟',
  },
  jimeng: {
    key: 'jimeng',
    nameEn: 'Jimeng',
    nameZh: '即梦',
    descEn: "ByteDance consumer image tool. Mobile-friendly.",
    descZh: '字节跳动消费级图像工具，移动端体验好。',
    url: 'https://jimeng.jianying.com/',
    icon: '/tool-icons/jianying.ico',
    emoji: '🌸',
  },
  tongyi: {
    key: 'tongyi',
    nameEn: 'Tongyi Wanxiang',
    nameZh: '通义万相',
    descEn: 'Alibaba image model, strong B2B and Chinese style.',
    descZh: '阿里图像模型，B 端与中文风格场景强。',
    url: 'https://tongyi.aliyun.com/wanxiang/',
    icon: '/tool-icons/aliyun.svg',
    emoji: '🪄',
  },
  wenxin: {
    key: 'wenxin',
    nameEn: 'Wenxin Yige',
    nameZh: '文心一格',
    descEn: "Baidu's image generation, Chinese art and ink painting.",
    descZh: '百度图像生成，国风与中国画风格突出。',
    url: 'https://yige.baidu.com/',
    icon: '/tool-icons/baidu.ico',
    emoji: '🖌️',
  },
  zhipu: {
    key: 'zhipu',
    nameEn: 'Zhipu Qingying',
    nameZh: '智谱清影',
    descEn: 'Zhipu AI image/video model, GLM series.',
    descZh: '智谱 AI 图视频模型，GLM 系列。',
    url: 'https://www.zhipuai.cn/',
    icon: '/tool-icons/chatglm.png',
    emoji: '🔮',
  },

  // ========== 兜底 ==========
  other: {
    key: 'other',
    nameEn: 'Other AI tools',
    nameZh: '其他 AI 工具',
    descEn: 'Compatible with most modern text-to-image and image models.',
    descZh: '兼容大多数主流文生图与图生图模型。',
    url: 'https://aiartspell.art/',
    icon: '/tool-icons/v0.svg',
    emoji: '🪐',
  },
};

/**
 * 根据 prompt.engines 返回已声明的引擎列表（去重，过滤 unknown）
 */
export function getEnginesByKeys(keys: string[]): Engine[] {
  const seen = new Set<string>();
  const out: Engine[] = [];
  for (const k of keys) {
    if (seen.has(k)) continue;
    seen.add(k);
    const e = engines[k];
    if (e) out.push(e);
  }
  return out;
}

/**
 * 详情页"适用引擎"区块要展示的列表：
 * - prompt.engines 命中的引擎（已验证）
 * - + 国内外主流引擎兜底展示，让用户知道"也兼容这些"
 *
 * 去重 + 已验证的排前 + 总数 ≤ 8
 */
export function getCompatibleEngines(promptEngines: string[]): Engine[] {
  // 已验证的优先
  const verified = getEnginesByKeys(promptEngines).filter((e) => e.key !== 'other');
  // 兜底展示：国内外主流引擎（剔除已出现的）
  const fallbackKeys = ['midjourney', 'flux', 'doubao', 'jimeng', 'tongyi', 'wenxin'];
  const verifiedKeys = new Set(verified.map((e) => e.key));
  const fallback = fallbackKeys
    .filter((k) => !verifiedKeys.has(k))
    .map((k) => engines[k])
    .filter(Boolean);

  return [...verified, ...fallback].slice(0, 8);
}