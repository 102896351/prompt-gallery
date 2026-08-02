// ============================================================
//  AI Tools — 精选工具目录
//  参考 aiart.pics/tools，收录与 AI 创作/开发相关的工具
// ============================================================

export type ToolCategory =
  | 'popular'        // 热门 Top 10
  | 'visual'         // 视觉生成
  | 'chat'           // 对话与助手
  | 'dev'            // 开发工具
  | 'writing'        // 写作与生产力
  | 'model';         // 模型与工作流

export interface Tool {
  name: string;            // 工具名
  nameZh?: string;         // 中文名
  description: string;     // 英文一句话描述
  descriptionZh: string;   // 中文一句话描述
  url: string;             // 官网
  category: ToolCategory;
  tags: string[];          // 标签（公司、属性、场景）
  featured?: boolean;      // 是否在热门 Top
}

export const toolCategories: { id: ToolCategory; label: string; labelZh: string }[] = [
  { id: 'popular',  label: 'Top 10',              labelZh: '热门 Top 10' },
  { id: 'visual',   label: 'Visual Generation',   labelZh: '视觉生成' },
  { id: 'chat',     label: 'Chat & Assistants',   labelZh: '对话与助手' },
  { id: 'dev',      label: 'Dev Tools',           labelZh: '开发工具' },
  { id: 'writing',  label: 'Writing & Productivity', labelZh: '写作与生产力' },
  { id: 'model',    label: 'Models & Workflows',  labelZh: '模型与工作流' },
];

export const tools: Tool[] = [
  // ============ 热门 Top 10 ============
  {
    name: 'OpenAI', nameZh: 'OpenAI',
    description: 'Maker of ChatGPT, leading the AI revolution.',
    descriptionZh: 'ChatGPT 的创造者，引领 AI 革命。',
    url: 'https://openai.com', category: 'popular',
    icon: '/tool-icons/openai.ico',
    tags: ['OpenAI', 'GPT', 'LLM'], featured: true,
  },
  {
    name: 'Google Gemini', nameZh: 'Google Gemini',
    description: "Google's most capable multimodal AI model.",
    descriptionZh: 'Google 最强大的多模态 AI 模型。',
    url: 'https://gemini.google.com', category: 'popular',
    icon: '/tool-icons/google-gemini.png',
    tags: ['Google', 'Gemini', 'Multimodal'], featured: true,
  },
  {
    name: 'Midjourney', nameZh: 'Midjourney',
    description: 'The most powerful AI image tool, running on Discord.',
    descriptionZh: '目前最强大的 AI 绘画工具，运行在 Discord 上。',
    url: 'https://www.midjourney.com', category: 'popular',
    icon: '/tool-icons/midjourney.png',
    tags: ['Midjourney', 'High Quality', 'Discord'], featured: true,
  },
  {
    name: 'Grok', nameZh: 'Grok',
    description: 'AI search and chat tool by X (Twitter).',
    descriptionZh: 'X (Twitter) 推出的 AI 搜索与对话工具。',
    url: 'https://grok.com', category: 'popular',
    icon: '/tool-icons/grok.png',
    tags: ['xAI', 'LLM', 'Search'], featured: true,
  },
  {
    name: 'Claude', nameZh: 'Claude',
    description: "Anthropic's AI assistant, excels at long-context understanding.",
    descriptionZh: 'Anthropic 推出的 AI 助手，擅长长文本理解。',
    url: 'https://claude.ai', category: 'popular',
    icon: '/tool-icons/claude.png',
    tags: ['Anthropic', 'Claude'], featured: true,
  },
  {
    name: 'ComfyUI', nameZh: 'ComfyUI',
    description: 'The most powerful node-based Stable Diffusion interface.',
    descriptionZh: '最强大的基于节点的 Stable Diffusion 界面。',
    url: 'https://github.com/comfyanonymous/ComfyUI', category: 'popular',
    icon: '/tool-icons/comfyui.png',
    tags: ['Workflow', 'Open Source', 'Local'], featured: true,
  },
  {
    name: 'Dreamina', nameZh: '即梦',
    description: "ByteDance's free AI image creation tool.",
    descriptionZh: '抖音旗下免费 AI 图片创作工具。',
    url: 'https://jimeng.jianying.com', category: 'popular',
    icon: '/tool-icons/jianying.ico',
    tags: ['ByteDance', 'China'], featured: true,
  },
  {
    name: 'Kling AI', nameZh: '可灵 AI',
    description: 'Kuaishou\'s AI image and video creation platform.',
    descriptionZh: '快手推出的 AI 图像和视频创作平台。',
    url: 'https://klingai.com', category: 'popular',
    icon: '/tool-icons/kling-ai.ico',
    tags: ['Kuaishou', 'Video', 'High Quality'], featured: true,
  },
  {
    name: 'Lovart', nameZh: 'Lovart',
    description: 'AI generation platform focused on artistic creation.',
    descriptionZh: '专注于艺术创作的 AI 生成平台。',
    url: 'https://lovart.ai', category: 'popular',
    icon: '/tool-icons/lovart.ico',
    tags: ['Design', 'China'], featured: true,
  },
  {
    name: 'Civitai', nameZh: 'Civitai',
    description: 'The largest Stable Diffusion model sharing community.',
    descriptionZh: '最大的 Stable Diffusion 模型分享社区。',
    url: 'https://civitai.com', category: 'popular',
    icon: '/tool-icons/civitai.ico',
    tags: ['SD', 'Models', 'Community'], featured: true,
  },

  // ============ 视觉生成 ============
  {
    name: 'Stable Diffusion', nameZh: 'Stable Diffusion',
    description: 'The open-source AI image model.',
    descriptionZh: '开源 AI 绘画模型代表。',
    url: 'https://stability.ai', category: 'visual',
    icon: '/tool-icons/stable-diffusion.webp',
    tags: ['Stability AI', 'SD', 'Open Source'],
  },
  {
    name: 'Leonardo.ai', nameZh: 'Leonardo.ai',
    description: 'Comprehensive AI image platform with model training.',
    descriptionZh: '支持模型训练的全面 AI 绘图平台。',
    url: 'https://leonardo.ai', category: 'visual',
    icon: '/tool-icons/leonardo-ai.png',
    tags: ['SD', 'Cloud'],
  },
  {
    name: 'Flux.1', nameZh: 'Flux.1',
    description: 'The new benchmark for open-source text-to-image.',
    descriptionZh: 'AI 绘画新标杆，超强开源文生图模型。',
    url: 'https://blackforestlabs.ai', category: 'visual',
    icon: '/tool-icons/flux-1.ico',
    tags: ['FLUX', 'High Quality', 'Open Source'],
  },
  {
    name: 'NijiJourney', nameZh: 'NijiJourney',
    description: 'Midjourney for anime-style art.',
    descriptionZh: '面向二次元风格的 MJ 绘画工具。',
    url: 'https://nijijourney.com', category: 'visual',
    icon: '/tool-icons/nijijourney.png',
    tags: ['Midjourney', 'High Quality'],
  },
  {
    name: 'Adobe Firefly', nameZh: 'Adobe Firefly',
    description: "Adobe's generative model for creatives.",
    descriptionZh: 'Adobe 旗下的创意生成模型。',
    url: 'https://firefly.adobe.com', category: 'visual',
    icon: '/tool-icons/adobe-firefly.ico',
    tags: ['Adobe', 'Design'],
  },
  {
    name: 'SeaArt', nameZh: 'SeaArt',
    description: 'AI image generation and model sharing platform.',
    descriptionZh: 'AI 绘画生成与模型分享平台。',
    url: 'https://seaart.ai', category: 'visual',
    icon: '/tool-icons/seaart.webp',
    tags: ['SD', 'Models', 'Community'],
  },
  {
    name: 'Canva AI', nameZh: 'Canva AI',
    description: 'Free AI image generation tool.',
    descriptionZh: '免费 AI 绘画工具。',
    url: 'https://canva.com', category: 'visual',
    icon: '/tool-icons/canva-ai.png',
    tags: ['Design'],
  },
  {
    name: 'Bing Image Creator', nameZh: 'Bing 图像创建者',
    description: 'Free high-quality image tool based on DALL·E.',
    descriptionZh: '基于 DALL·E 的免费高质量绘画工具。',
    url: 'https://www.bing.com/images/create', category: 'visual',
    icon: '/tool-icons/bing-image-creator.png',
    tags: ['Microsoft', 'Dall-e'],
  },
  {
    name: 'Wujie AI', nameZh: '无界 AI',
    description: 'All-in-one AI creation and community platform.',
    descriptionZh: '一站式 AI 创作交流分享。',
    url: 'https://www.wujieai.com', category: 'visual',
    icon: '/tool-icons/wujieai.png',
    tags: ['Community', 'China'],
  },
  {
    name: 'D.Design', nameZh: '堆友',
    description: "Alibaba's multi-style generator.",
    descriptionZh: '阿里堆友多风格生成器。',
    url: 'https://d.design', category: 'visual',
    icon: '/tool-icons/d-design.png',
    tags: ['Alibaba', '3D', 'Design'],
  },
  {
    name: 'Gaoding AI', nameZh: '稿定 AI',
    description: 'All-in-one AI design toolkit with free image generation.',
    descriptionZh: '一站式 AI 设计工具集，免费 AI 绘图。',
    url: 'https://www.gaoding.com', category: 'visual',
    icon: '/tool-icons/gaoding.png',
    tags: ['Design', 'China'],
  },
  {
    name: 'Zaodian', nameZh: '造点',
    description: "Quark's image and video platform.",
    descriptionZh: '夸克团队的图像与视频平台。',
    url: 'https://zaodian.quark.cn', category: 'visual',
    icon: '/tool-icons/quark.png',
    tags: ['Alibaba', 'Video', 'China'],
  },
  {
    name: 'Tongyi Wanxiang', nameZh: '通义万象',
    description: "Alibaba's creative content generation platform.",
    descriptionZh: '阿里的创意内容生成平台。',
    url: 'https://tongyi.aliyun.com/wanxiang', category: 'visual',
    icon: '/tool-icons/aliyun.svg',
    tags: ['Alibaba', 'Design', 'China'],
  },
  {
    name: 'Lumi', nameZh: 'Lumi',
    description: "ByteDance's AIGC image platform.",
    descriptionZh: '字节跳动的 AIGC 图像平台。',
    url: 'https://lumi.bytedance.com', category: 'visual',
    icon: '/tool-icons/lumi.png',
    tags: ['ByteDance', 'Design'],
  },
  {
    name: 'Pixel Cake', nameZh: '像素蛋糕',
    description: 'AI image post-processing software.',
    descriptionZh: '像甜科技推出的 AI 图像后期软件。',
    url: 'https://www.pixelscake.com', category: 'visual',
    icon: '/tool-icons/pixcakeai.png',
    tags: ['Editing', 'China'],
  },
  {
    name: 'remove.bg', nameZh: 'remove.bg',
    description: 'AI background removal tool.',
    descriptionZh: 'AI 图片背景移除工具。',
    url: 'https://www.remove.bg', category: 'visual',
    icon: '/tool-icons/remove-bg.png',
    tags: ['Editing'],
  },
  {
    name: 'ARC', nameZh: 'ARC',
    description: "Tencent's free image processing tool.",
    descriptionZh: '腾讯的免费图片处理工具。',
    url: 'https://arc.tencent.com', category: 'visual',
    icon: '/tool-icons/arc.ico',
    tags: ['Tencent', 'Editing', 'China'],
  },
  {
    name: 'Tripo AI', nameZh: 'Tripo AI',
    description: 'Generate high-quality 3D models quickly.',
    descriptionZh: '快速生成高质量 3D 模型。',
    url: 'https://www.tripo3d.ai', category: 'visual',
    icon: '/tool-icons/tripo-ai.ico',
    tags: ['3D'],
  },

  // ============ 对话与助手 ============
  {
    name: 'Perplexity', nameZh: 'Perplexity',
    description: 'AI chat assistant with real-time search.',
    descriptionZh: '结合搜索引擎的 AI 对话助手，提供实时信息。',
    url: 'https://www.perplexity.ai', category: 'chat',
    icon: '/tool-icons/perplexity.ico',
    tags: ['Search', 'LLM'],
  },
  {
    name: 'ChatGLM', nameZh: 'ChatGLM',
    description: "Zhipu AI's large-scale dialogue model.",
    descriptionZh: '智谱 AI 的千亿基座对话模型。',
    url: 'https://chatglm.cn', category: 'chat',
    icon: '/tool-icons/chatglm.png',
    tags: ['Zhipu', 'China'],
  },
  {
    name: 'Poe', nameZh: 'Poe',
    description: 'Access GPT-4, Claude and more in one place.',
    descriptionZh: '快速访问 GPT-4、Claude 等多种 AI 模型。',
    url: 'https://poe.com', category: 'chat',
    icon: '/tool-icons/poe.png',
    tags: ['Aggregator'],
  },
  {
    name: 'MiniMax', nameZh: 'MiniMax',
    description: 'The general LLM behind Hailuo AI.',
    descriptionZh: '海螺 AI 背后的通用大模型。',
    url: 'https://www.minimaxi.com', category: 'chat',
    icon: '/tool-icons/minimax.ico',
    tags: ['MiniMax', 'China'],
  },
  {
    name: 'Cherry Studio', nameZh: 'Cherry Studio',
    description: 'Multi-model chat and management client.',
    descriptionZh: '多模型对话与管理客户端。',
    url: 'https://cherry-ai.com', category: 'chat',
    icon: '/tool-icons/cherry-studio.png',
    tags: ['Desktop', 'Aggregator'],
  },
  {
    name: 'DeepSeek', nameZh: 'DeepSeek',
    description: "DeepSeek's open-source MoE LLM.",
    descriptionZh: '深度求索的开源 MoE 大模型。',
    url: 'https://www.deepseek.com', category: 'chat',
    icon: '/tool-icons/deepseek.ico',
    tags: ['DeepSeek', 'Coding', 'Open Source'],
  },
  {
    name: 'Metaso', nameZh: '秘塔搜索',
    description: 'Metaso AI search engine.',
    descriptionZh: '秘塔科技的 AI 搜索引擎。',
    url: 'https://metaso.cn', category: 'chat',
    icon: '/tool-icons/metaso.png',
    tags: ['Search', 'China'],
  },
  {
    name: 'ERNIE Bot', nameZh: '文心一言',
    description: "Baidu's knowledge-enhanced LLM.",
    descriptionZh: '百度的知识增强大语言模型。',
    url: 'https://yiyan.baidu.com', category: 'chat',
    icon: '/tool-icons/baidu.ico',
    tags: ['Baidu', 'China'],
  },
  {
    name: 'Qwen', nameZh: '通义千问',
    description: "Alibaba Cloud's large language model.",
    descriptionZh: '阿里云的超大规模语言模型。',
    url: 'https://tongyi.aliyun.com', category: 'chat',
    icon: '/tool-icons/aliyun.svg',
    tags: ['Alibaba', 'China'],
  },
  {
    name: 'Kimi', nameZh: 'Kimi',
    description: "Moonshot AI's smart assistant.",
    descriptionZh: 'Moonshot AI 的智能助手。',
    url: 'https://kimi.moonshot.cn', category: 'chat',
    icon: '/tool-icons/kimi.ico',
    tags: ['Moonshot', 'China'],
  },
  {
    name: 'Doubao', nameZh: '豆包',
    description: "ByteDance's AI chat assistant.",
    descriptionZh: '字节跳动的 AI 对话助手。',
    url: 'https://www.doubao.com', category: 'chat',
    icon: '/tool-icons/doubao.png',
    tags: ['ByteDance', 'China'],
  },
  {
    name: 'Quark', nameZh: '夸克',
    description: "Alibaba's smart search and assistant.",
    descriptionZh: '阿里巴巴的智能搜索与助手。',
    url: 'https://www.quark.cn', category: 'chat',
    icon: '/tool-icons/quark.png',
    tags: ['Alibaba', 'Search', 'China'],
  },

  // ============ 开发工具 ============
  {
    name: 'Google AI Studio', nameZh: 'Google AI Studio',
    description: 'Experience Gemini and Imagen models.',
    descriptionZh: '支持体验 Gemini 和 Imagen 模型。',
    url: 'https://aistudio.google.com', category: 'dev',
    icon: '/tool-icons/google-ai-studio.png',
    tags: ['Google', 'Gemini', 'Coding'],
  },
  {
    name: 'Cursor', nameZh: 'Cursor',
    description: 'AI-native code editor based on VS Code.',
    descriptionZh: '基于 VS Code 的 AI 原生代码编辑器。',
    url: 'https://cursor.com', category: 'dev',
    icon: '/tool-icons/cursor.png',
    tags: ['IDE', 'Desktop', 'Coding'],
  },
  {
    name: 'Windsurf', nameZh: 'Windsurf',
    description: "Codeium's AI code editor.",
    descriptionZh: 'Codeium 推出的 AI 代码编辑器。',
    url: 'https://codeium.com/windsurf', category: 'dev',
    icon: '/tool-icons/windsurf.png',
    tags: ['IDE', 'Desktop', 'Coding'],
  },
  {
    name: 'Trae', nameZh: 'Trae',
    description: "ByteDance's AI integrated dev environment.",
    descriptionZh: '字节跳动的 AI 集成开发环境。',
    url: 'https://www.trae.ai', category: 'dev',
    icon: '/tool-icons/trae.png',
    tags: ['ByteDance', 'IDE', 'Desktop'],
  },
  {
    name: 'Lovable', nameZh: 'Lovable',
    description: 'Full-stack app development platform.',
    descriptionZh: '全栈应用开发平台。',
    url: 'https://lovable.dev', category: 'dev',
    icon: '/tool-icons/lovable.png',
    tags: ['Coding', 'Cloud'],
  },
  {
    name: 'v0', nameZh: 'v0',
    description: "Vercel's UI component code generator.",
    descriptionZh: 'Vercel 的 UI 组件代码生成工具。',
    url: 'https://v0.dev', category: 'dev',
    icon: '/tool-icons/v0.svg',
    tags: ['Vercel', 'Coding'],
  },
  {
    name: 'Vercel', nameZh: 'Vercel',
    description: 'Frontend cloud platform for fast deployment.',
    descriptionZh: '前端云平台，支持快速部署。',
    url: 'https://vercel.com', category: 'dev',
    icon: '/tool-icons/vercel.png',
    tags: ['Cloud'],
  },
  {
    name: 'Cloudflare', nameZh: 'Cloudflare',
    description: 'Global edge compute and CDN with AI services.',
    descriptionZh: '全球边缘计算和 CDN 平台，提供 AI 服务。',
    url: 'https://www.cloudflare.com', category: 'dev',
    icon: '/tool-icons/cloudflare.ico',
    tags: ['Cloud'],
  },

  // ============ 写作与生产力 ============
  {
    name: 'Notion AI', nameZh: 'Notion AI',
    description: "Notion's built-in AI for writing, summary and organization.",
    descriptionZh: 'Notion 内置的 AI 助手，帮助写作、总结和组织信息。',
    url: 'https://www.notion.so/product/ai', category: 'writing',
    icon: '/tool-icons/notion-ai.png',
    tags: ['Productivity'],
  },

  // ============ 模型与工作流 ============
  {
    name: 'Hugging Face', nameZh: 'Hugging Face',
    description: "The GitHub of AI — hosts models and datasets.",
    descriptionZh: 'AI 领域的 GitHub，托管各类模型和数据集。',
    url: 'https://huggingface.co', category: 'model',
    icon: '/tool-icons/hugging-face.ico',
    tags: ['Models', 'Open Source'],
  },
  {
    name: 'Tensor.art', nameZh: 'Tensor.art',
    description: 'Run SD models online.',
    descriptionZh: '在线运行 SD 模型的平台。',
    url: 'https://tensor.art', category: 'model',
    icon: '/tool-icons/tensor-art.ico',
    tags: ['SD', 'Cloud', 'Models'],
  },
  {
    name: 'LiblibAI', nameZh: 'LiblibAI',
    description: 'Leading Chinese AI creation platform with quality models.',
    descriptionZh: '超多优质模型，国内领先的 AI 创作平台。',
    url: 'https://www.liblib.art', category: 'model',
    icon: '/tool-icons/liblibai.ico',
    tags: ['SD', 'Models', 'China'],
  },
  {
    name: 'TusiArt', nameZh: 'TusiArt',
    description: 'AI image model community and online generation.',
    descriptionZh: 'AI 绘画模型社区和在线生图。',
    url: 'https://tusiart.com', category: 'model',
    icon: '/tool-icons/tusiart.jpg',
    tags: ['SD', 'Cloud', 'China'],
  },
  {
    name: 'RunningHub', nameZh: 'RunningHub',
    description: 'Cloud ComfyUI creation platform.',
    descriptionZh: '云端 ComfyUI 创作平台。',
    url: 'https://runninghub.cn', category: 'model',
    icon: '/tool-icons/runninghub.ico',
    tags: ['ComfyUI', 'Cloud', 'Workflow'],
  },
  {
    name: 'OpenRouter', nameZh: 'OpenRouter',
    description: 'Unified LLM API aggregator.',
    descriptionZh: '统一的 LLM API 聚合平台。',
    url: 'https://openrouter.ai', category: 'model',
    icon: '/tool-icons/openrouter.ico',
    tags: ['API', 'Aggregator'],
  },
  {
    name: 'Dify', nameZh: 'Dify',
    description: 'Open-source LLM app development platform.',
    descriptionZh: '开源 LLM 应用开发平台。',
    url: 'https://dify.ai', category: 'model',
    icon: '/tool-icons/dify.svg',
    tags: ['Agent', 'Workflow', 'Open Source'],
  },
  {
    name: 'n8n', nameZh: 'n8n',
    description: 'Fair-code workflow automation tool.',
    descriptionZh: '公平代码的工作流自动化工具。',
    url: 'https://n8n.io', category: 'model',
    icon: '/tool-icons/n8n.ico',
    tags: ['Workflow', 'Open Source'],
  },
  {
    name: 'Coze', nameZh: '扣子',
    description: "ByteDance's AI Bot development platform.",
    descriptionZh: '字节跳动的 AI Bot 开发平台。',
    url: 'https://www.coze.com', category: 'model',
    icon: '/tool-icons/coze.png',
    tags: ['ByteDance', 'Agent', 'Workflow'],
  },
  {
    name: 'ModelScope', nameZh: '魔搭',
    description: "Alibaba's model community.",
    descriptionZh: '阿里的"魔搭"模型社区。',
    url: 'https://modelscope.cn', category: 'model',
    icon: '/tool-icons/modelscope.ico',
    tags: ['Alibaba', 'Models', 'China'],
  },
];

export function getToolsByCategory(cat: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === cat);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  tools.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
  return [...set].sort();
}