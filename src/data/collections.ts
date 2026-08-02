// ============================================================
//  Collections — 精选专题
//  数据来源：参考 aiart.pics/collections
// ============================================================

export interface CollectionPrompt {
  title: string;
  image: string;
  /** prompt 原文（从原 README 反查） */
  promptText: string;
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
  cover: string;
  count: number;
  prompts: CollectionPrompt[];
}

export const collections: Collection[] = [
  {
    slug: 'collection-01',
    title: '抽象·极简主义·头像',
    description: '收录 12 个 抽象·极简主义·头像 主题作品，探索现实与人物的创作灵感',
    cover: 'https://img1.aiart.pics/images/prompts/20251224/minimalist-monochromatic-purple-studio-portrait-1.jpg',
    count: 11,
    prompts: [
      { title: 'neoglo-style-logo', image: 'https://img1.aiart.pics/images/prompts/20251201/neoglo-style-logo.jpeg', promptText: 'Design a modern logo in NeoGradient Soft Tech style for a fictional startup called “NAME” in the “[INDUSTRY TYPE]” industry.\\n\\nThe logo must include:\\n•A unique abstract icon\\n•A clean, bold sans-serif logotype\\n•Smooth glowing gradients blending vibrant colors like blue, purple, pink, orange, and teal\\n•Seamless harmony between symbol and text\\n•Minimalist, futuristic composition\\n•On a pure black background\\n•1:1 aspect ratio — ultra-HD\\n\\nThe logo should feel creative, modern, and ready for a bold digital brand.\n为“[INDUSTRY TYPE]”行业中名为 “NAME” 的虚构初创公司设计一个 NeoGradient Soft Tech 风格的现代标志。\\n\\n徽标必须包含：\\n•独特的抽象图标\\n•干净、大胆的无衬线标识\\n•平滑的发光渐变，混合了蓝色、紫色、粉红色、橙色和蓝绿色等鲜艳的颜色\\n•符号和文本之间的无缝协调\\n•极简主义、未来主义的构图\\n•在纯黑色背景上\\n•1：1 纵横比 — 超高清\\n\\n徽标应该具有创意、现代感，并为大胆的数字品牌做好准备。' },
      { title: 'nano-banana-pro-ppt-futuristic-ui-ux-presentation-slides', image: 'https://img1.aiart.pics/images/prompts/20251203/nano-banana-pro-ppt-futuristic-ui-ux-presentation-slides-1.jpg', promptText: '🍌Nano Banana Pro PPT 生成提示词\n整了一套非常漂亮的渐变拟物玻璃卡片风格 PPT 提示词，可以在 NotebookLM、Youmind、Listenhub、Lovart等支持 Nano Banana Pro 生成 PPT 的位置使用\n------\n你是一位专家级UI UX演示设计师，请生成高保真、未来科技感的16比9演示文稿幻灯片。请根据视觉平衡美学，自动在封面、网格布局或数据可视化中选择一种最完美的构图。\n全局视觉语言方面，风格要无缝融合Apple Keynote的极简主义、现代SaaS产品设计和玻璃拟态风格。整体氛围需要高端、沉浸、洁净且有呼吸感。光照采用电影级体积光、柔和的光线追踪反射和环境光遮蔽。配色方案选择深邃的虚空黑或纯净的陶瓷白作为基底，并以流动的极光渐变色即霓虹紫、电光蓝、柔和珊瑚橙、青色作为背景和UI高光点缀。\n关于画面内容模块，请智能整合以下元素：\n1. 排版引擎采用Bento便当盒网格系统，将内容组织在模块化的圆角矩形容器中。容器材质必须是带有模糊效果的磨砂玻璃，具有精致的白色边缘和柔和的投影，并强制保留巨大的内部留白，避免拥挤。\n2. 插入礼物质感的3D物体，渲染独特的高端抽象3D制品作为视觉锚点。它们的外观应像实体的昂贵礼物或收藏品，材质为抛光金属、幻彩亚克力、透明玻璃或软硅胶，形状可是悬浮胶囊、球体、盾牌、莫比乌斯环或流体波浪。\n3. 字体与数据方面，使用干净的无衬线字体，建立高对比度。如果有图表，请使用发光的3D甜甜圈图、胶囊状进度条或悬浮数字，图表应看起来像发光的霓虹灯玩具。\n构图逻辑参考： 如果生成封面，请在中心放置一个巨大的复杂3D玻璃物体，并覆盖粗体大字，背景有延伸的极光波浪。 如果生成内容页，请使用Bento网格布局，将3D图标放在小卡片中，文本放在大卡片中。 如果生成数据页，请使用分屏设计，左侧排版文字，右侧悬' },
      { title: 'banana-pro-comparison', image: 'https://img1.aiart.pics/images/prompts/20251216/banana-pro-comparison-1.jpg', promptText: '对比了下 Banana Pro 还是强！\n提示词：参考我提供的IP头像图片作为角色一致性参考。生成16宫格（4x4）表情包大图，每格一个表情，格与格之间留细白边分隔。角色保持相同画风，每格可在底部加短中文文案（2~6字，像素字体/简洁黑字）。除指定小道具外不要加复杂背景。无水印、无额外人物。\n16格内容依次为：....' },
      { title: 'street-mural-with-strong-photographic-texture', image: 'https://img1.aiart.pics/images/prompts/20251201/street-mural-with-strong-photographic-texture.jpeg', promptText: '一幅超高清晰度、摄影质感极强的街头壁画，画面呈现强烈的中国风韵味。\\n\\n画中描绘着一位绝美的卡通风女子正面特写头像，她神态柔美而宁静。墙体顶部被一大片盛开的蔷薇花覆盖，茂密的绿叶与繁盛的花朵向外舒展，部分枝条从墙顶垂落而下，与女子的头发巧妙融合，使她的秀发宛如由层层叠叠的蔷薇花组成。这些繁密的花朵簇拥着女子的头部，形成了一顶瑰丽的花冠，视觉效果华美浪漫。\\n\\n背景中蓝天澄澈，点缀着朵朵白云；地面为一条细节真实的沥青街道，上面散落着缤纷多彩的花瓣，行人悠然漫步其间。整体场景细节精致入微，光影明亮柔和，营造出犹如现实般的梦幻街景氛围。' },
      { title: 'chatgpt-ai-image-generation-model-update-gpt-image-1-5-portrait-analysis', image: 'https://img1.aiart.pics/images/prompts/20251219/chatgpt-ai-image-generation-model-update-gpt-image-1-5-portrait-analysis-1.jpg', promptText: 'ChatGPT 更新AI生图模型，GPT-Image-1.5 最擅长的竟然是这个？\n经过社区伙伴测试，GPT更新后做可视化完全不行，但是做写真竟然很不错！\n在一致性方面感觉超越了 Nano Banana PRO，因为大香蕉总喜欢微整形，GPT在穿着上更加大胆一些，而且适合连续的图片局部修改\n下图自左到右，分别是原图，大香蕉的修改，和GPT修改\n提示词：\n图中角色的服饰动作表情环境都更加美丽吸引人，做到你能做到的极限\n大号的美图秀秀是吗？不过既然作为PLUS会员送的新功能，畅快的给别人的头像进行强化，也算挺有意思了' },
    ],
  },
  {
    slug: 'collection-02',
    title: 'Nano Banana Pro·科技·科幻',
    description: '187 个 Nano Banana Pro·科技·科幻 精选集，涵盖现实、人物、产品等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20260106/new-creators-never-spend-enough-time-on-their-titles-and-thumbnails-1.png',
    count: 163,
    prompts: [
      { title: 'beijing-7-day-weather-forecast-poster', image: 'https://img1.aiart.pics/images/prompts/20251219/beijing-7-day-weather-forecast-poster-1.jpg', promptText: '北京今天要下雪啦，🌨\n北京7日天气预报-海报 （By 玉伯大佬的YouMind）\nNano banana pro提示词：\n为北京创作接下来7天（包含今天）天气可视化海报。要求:1)每天天气用独特的视觉符号或场景表示(晴天/雨天/雪天/多云/雾霾);2)清晰显示日期、温度、湿度、风力等中文信息;3)整体设计风格为[吉卜力动画/扁平插画/3D微缩/未来科技];4)用色彩和氛围传达天气感受;5)布局清晰易读,适合手机壁纸;6)可添加穿衣建议或出行提示。信息设计与艺术结合,竖版构图,适合社交分享。' },
      { title: 'sci-fi-industrial-food-fusion', image: 'https://img1.aiart.pics/images/prompts/20251214/sci-fi-industrial-food-fusion-1.jpg', promptText: '太空科幻的硬核工业风与食品的结合，效果惊艳\n灵感来自 @YaseenK7212\nprompt有点长，评论区自取👇 https://t.co/WS376EdLWB\nNano Banana2 prompt\n{\n\"batch_generation_requests\": [\n{\n\"theme_id\": \"Red_Can_Rocket\",\n\"concept\": \"Industrial Retrofit of Soda Can Vehicle\",\n\"subject\": {\n\"main_element\": \"Generic vintage red aluminum soda can\",\n\"modifications\": \"Heavily modified into a heavy-lift launch vehicle; rusted metal plating bolted onto the aluminum skin, hydraulic pipes bursting from the sides\",\n\"props\": \"Holographic schematic blueprints floating above on mechanical armature arms\",\n\"details\": \"Scuffed metal texture, condensation mixed with industrial oil leaks, macro view of rivets\"\n},\n\"figures\": {\n\"type\": \"Miniature industrial welders\",\n\"attire\": \"Heavy-duty white hazmat suits with grime\",\n\"action\": \"Welding structural supports to the' },
      { title: 'celebrity-achievement-illustration', image: 'https://img1.aiart.pics/images/prompts/20251226/celebrity-achievement-illustration-1.jpg', promptText: '名人成就插画\n示例：特斯拉vs爱迪生 （考虑到是两人关系，还是背对背排列吧🤣）\n利用“双重曝光剪影风格”，融入了包豪斯风格的几何元素，再加上Google产品所拥有的素材检索能力以及nano banana pro强大的风格化能力，可以轻松地为某位历史名人绘制出融合了其上身轮廓以及人物成就的插画。\n提示词（英文版见评论区）\n---\n人物名称：特斯拉\n一幅包豪斯风格的几何双重曝光插画，呈现[在此处插入著名人物名字]的侧面剪影。整体画面置于浅米色纯色背景之上。\n自适应色彩方案说明（仅用于几何元素）：\nAI 应根据上述人物的气质、时代特征与标志性风格生成统一协调的包豪斯色彩方案（例如：对创新者使用冷感的科技蓝与灰；对艺术家使用温暖而鲜明的原色）。该色彩方案仅适用于几何图案与下方的字体，不适用于肤色。\n至关重要的是，面部特征（眼部区域、鼻子、嘴、下巴、脸颊）必须以接近人物自然肤色的纯色、平面矢量方式呈现。该肤色区域需保持干净，几乎不含几何纹理，以确保人物的清晰可辨识度与庄重感。肤色区域应与周围的几何图案形成干净利落的对比。\n复杂的几何叙事图案应集中在剪影的头发、后脑、颈部与肩部区域。在这些具有纹理的区域中，图像需依据自适应包豪斯色板划分为三个层次：\n底部区域（颈部根部与肩部——基础）：\n几何抽象元素，用以象征其出身、早期奋斗或奠基性的根源。\n中部区域（颈部、下颌线与后脑——成就）：\n清晰可辨的包豪斯风格几何化抽象符号，代表其职业生涯中最具代表性的工具、产品或关键成果。它们不应只是隐藏在纹理中的暗示，而应是由几何形状构成、可读性明确的符号。\n顶部区域（大脑上部与头发——愿景）：\n抽象的几何圆形、线条与飘逸形态，用以表现其智慧、思想、未来愿景或精神遗产。\n在主剪影插画下方，以定制的包豪斯风格字体呈现人物全名“[在此处插入著名人物名字]”。字体为几何无衬线体，由基本形状（圆、方、三角形、粗' },
      { title: 'celebrity-achievement-illustration', image: 'https://img1.aiart.pics/images/prompts/20251226/celebrity-achievement-illustration-2.jpg', promptText: '名人成就插画\n示例：特斯拉vs爱迪生 （考虑到是两人关系，还是背对背排列吧🤣）\n利用“双重曝光剪影风格”，融入了包豪斯风格的几何元素，再加上Google产品所拥有的素材检索能力以及nano banana pro强大的风格化能力，可以轻松地为某位历史名人绘制出融合了其上身轮廓以及人物成就的插画。\n提示词（英文版见评论区）\n---\n人物名称：特斯拉\n一幅包豪斯风格的几何双重曝光插画，呈现[在此处插入著名人物名字]的侧面剪影。整体画面置于浅米色纯色背景之上。\n自适应色彩方案说明（仅用于几何元素）：\nAI 应根据上述人物的气质、时代特征与标志性风格生成统一协调的包豪斯色彩方案（例如：对创新者使用冷感的科技蓝与灰；对艺术家使用温暖而鲜明的原色）。该色彩方案仅适用于几何图案与下方的字体，不适用于肤色。\n至关重要的是，面部特征（眼部区域、鼻子、嘴、下巴、脸颊）必须以接近人物自然肤色的纯色、平面矢量方式呈现。该肤色区域需保持干净，几乎不含几何纹理，以确保人物的清晰可辨识度与庄重感。肤色区域应与周围的几何图案形成干净利落的对比。\n复杂的几何叙事图案应集中在剪影的头发、后脑、颈部与肩部区域。在这些具有纹理的区域中，图像需依据自适应包豪斯色板划分为三个层次：\n底部区域（颈部根部与肩部——基础）：\n几何抽象元素，用以象征其出身、早期奋斗或奠基性的根源。\n中部区域（颈部、下颌线与后脑——成就）：\n清晰可辨的包豪斯风格几何化抽象符号，代表其职业生涯中最具代表性的工具、产品或关键成果。它们不应只是隐藏在纹理中的暗示，而应是由几何形状构成、可读性明确的符号。\n顶部区域（大脑上部与头发——愿景）：\n抽象的几何圆形、线条与飘逸形态，用以表现其智慧、思想、未来愿景或精神遗产。\n在主剪影插画下方，以定制的包豪斯风格字体呈现人物全名“[在此处插入著名人物名字]”。字体为几何无衬线体，由基本形状（圆、方、三角形、粗' },
      { title: 'celebrity-achievement-illustration', image: 'https://img1.aiart.pics/images/prompts/20251226/celebrity-achievement-illustration-3.jpg', promptText: '名人成就插画\n示例：特斯拉vs爱迪生 （考虑到是两人关系，还是背对背排列吧🤣）\n利用“双重曝光剪影风格”，融入了包豪斯风格的几何元素，再加上Google产品所拥有的素材检索能力以及nano banana pro强大的风格化能力，可以轻松地为某位历史名人绘制出融合了其上身轮廓以及人物成就的插画。\n提示词（英文版见评论区）\n---\n人物名称：特斯拉\n一幅包豪斯风格的几何双重曝光插画，呈现[在此处插入著名人物名字]的侧面剪影。整体画面置于浅米色纯色背景之上。\n自适应色彩方案说明（仅用于几何元素）：\nAI 应根据上述人物的气质、时代特征与标志性风格生成统一协调的包豪斯色彩方案（例如：对创新者使用冷感的科技蓝与灰；对艺术家使用温暖而鲜明的原色）。该色彩方案仅适用于几何图案与下方的字体，不适用于肤色。\n至关重要的是，面部特征（眼部区域、鼻子、嘴、下巴、脸颊）必须以接近人物自然肤色的纯色、平面矢量方式呈现。该肤色区域需保持干净，几乎不含几何纹理，以确保人物的清晰可辨识度与庄重感。肤色区域应与周围的几何图案形成干净利落的对比。\n复杂的几何叙事图案应集中在剪影的头发、后脑、颈部与肩部区域。在这些具有纹理的区域中，图像需依据自适应包豪斯色板划分为三个层次：\n底部区域（颈部根部与肩部——基础）：\n几何抽象元素，用以象征其出身、早期奋斗或奠基性的根源。\n中部区域（颈部、下颌线与后脑——成就）：\n清晰可辨的包豪斯风格几何化抽象符号，代表其职业生涯中最具代表性的工具、产品或关键成果。它们不应只是隐藏在纹理中的暗示，而应是由几何形状构成、可读性明确的符号。\n顶部区域（大脑上部与头发——愿景）：\n抽象的几何圆形、线条与飘逸形态，用以表现其智慧、思想、未来愿景或精神遗产。\n在主剪影插画下方，以定制的包豪斯风格字体呈现人物全名“[在此处插入著名人物名字]”。字体为几何无衬线体，由基本形状（圆、方、三角形、粗' },
    ],
  },
  {
    slug: 'collection-03',
    title: '头像·抽象·人物',
    description: '147 个 头像·抽象·人物 精选集，涵盖人物、现实、头像等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251219/nano-banana-pro-front-view-1.jpg',
    count: 142,
    prompts: [
      { title: 'banana-pro-comparison', image: 'https://img1.aiart.pics/images/prompts/20251216/banana-pro-comparison-1.jpg', promptText: '对比了下 Banana Pro 还是强！\n提示词：参考我提供的IP头像图片作为角色一致性参考。生成16宫格（4x4）表情包大图，每格一个表情，格与格之间留细白边分隔。角色保持相同画风，每格可在底部加短中文文案（2~6字，像素字体/简洁黑字）。除指定小道具外不要加复杂背景。无水印、无额外人物。\n16格内容依次为：....' },
      { title: 'y2k-style-japanese-idol-winter-urban-street-photography', image: 'https://img1.aiart.pics/images/prompts/20251220/y2k-style-japanese-idol-winter-urban-street-photography-1.jpg', promptText: 'Portrait Entity\n実在のプロフィールを持たず、作品の中だけに存在する抽象的な人物像\nClose-up photograph of one cute K-pop idol Japanese women in Y2K winter natural color fashion, urban setting with a local city in view, lo-fi film aesthetic, winter, smiling, candid diagonal view, sunlight' },
      { title: 'y2k-style-japanese-idol-winter-urban-street-photography', image: 'https://img1.aiart.pics/images/prompts/20251220/y2k-style-japanese-idol-winter-urban-street-photography-2.jpg', promptText: 'Portrait Entity\n実在のプロフィールを持たず、作品の中だけに存在する抽象的な人物像\nClose-up photograph of one cute K-pop idol Japanese women in Y2K winter natural color fashion, urban setting with a local city in view, lo-fi film aesthetic, winter, smiling, candid diagonal view, sunlight' },
      { title: 'y2k-style-japanese-idol-winter-urban-street-photography', image: 'https://img1.aiart.pics/images/prompts/20251220/y2k-style-japanese-idol-winter-urban-street-photography-3.jpg', promptText: 'Portrait Entity\n実在のプロフィールを持たず、作品の中だけに存在する抽象的な人物像\nClose-up photograph of one cute K-pop idol Japanese women in Y2K winter natural color fashion, urban setting with a local city in view, lo-fi film aesthetic, winter, smiling, candid diagonal view, sunlight' },
      { title: 'abstract-portrait-entity', image: 'https://img1.aiart.pics/images/prompts/20251212/abstract-portrait-entity-1.jpg', promptText: 'Portrait Entity\n実在のプロフィールを持たず、作品の中だけに存在する抽象的な人物像をGrok でお楽しみください。フィードバックお待ちしております🌿✨\nClose-up photograph of 【two cute K-pop idol Japanese women】 in 【Y2K winter natural color fashion】, urban setting with a local city in view, lo-fi film aesthetic. winter, smiling, candid diagonal view, night' },
    ],
  },
  {
    slug: 'collection-04',
    title: '年轻女子·人物·时尚',
    description: '158 个 年轻女子·人物·时尚 精选集，涵盖人物、现实、头像等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251208/heart-melting-eyes-of-beauty-1.jpg',
    count: 157,
    prompts: [
      { title: 'hyper-realistic-detailed-wet-side-portrait', image: 'https://img1.aiart.pics/images/prompts/20251229/hyper-realistic-detailed-wet-side-portrait-1.jpg', promptText: 'M的这个提示词的人物面部皮肤真的是太真实细腻了呀☺\nPrompt：\n{\n“提示”：使用人物的面部特征不发生任何变化。“极致湿身特写肖像，年轻女子侧脸。深色湿发自然地贴在皮肤上。细小的水珠和汗珠在脸上闪闪发光，逼真自然。聚焦于明亮自然的眼睛，反射出真实的光影。水润闪亮的嘴唇，柔软自然的肌肤纹理。柔和的光线，冷色调，浅灰色和白色的散景背景。超写实，8K分辨率，电影级摄影，原始风格。”\n\"负向提示词\":避免出现 \"过度出油、油性皮肤、干性皮肤、浓妆、卡通、插画、3D渲染、低质量、模糊、眼睛变形、人体结构错误、过度曝光、高对比度\",\n“参数”： {\n\"宽高比\": \"9:16\",\n风格： 逼真\n}' },
      { title: 'beautiful-lady-pink-cheongsam', image: 'https://img1.aiart.pics/images/prompts/20251216/beautiful-lady-pink-cheongsam-1.jpg', promptText: 'GPT-4o Prompt：一位美丽的女子身穿粉色旗袍，头戴精致的花饰，秀发中点缀着色彩缤纷的花朵，颈间装饰着优雅的白色蕾丝领子。她的一只手轻托着几只大型蝴蝶。整体拍摄风格呈现高清细节质感，类似时尚杂志封面设计，照片上方中央位置标有文字「FASHION DESIGN」。画面背景采用简约的纯浅灰色，以突出人物主体。' },
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-1.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-2.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'photo-style-sticker-pack-generation', image: 'https://img1.aiart.pics/images/prompts/20251223/photo-style-sticker-pack-generation-1.jpg', promptText: '上传你的照片，生成不同服装风格的贴纸\n🍌Nano Banana Pro Prompt：\n一个以上传照片为原型的3*3贴纸包，人物穿着不同服装和时尚风格。边缘干净裁剪，带有粗线条轮廓，姿势富有表现力，整体采用活泼的现代贴纸设计。在每个贴纸旁边采用中英文标注风格，所有贴纸保持相同的面部特征、一致的相似度和比例。\n包含教师装、传统、护士制服、街头潮牌和奇幻灵感等多种服装风格。高分辨率成品，带有柔和阴影和光泽贴纸纸张质感，适合社交分享。' },
    ],
  },
  {
    slug: 'collection-05',
    title: '3D·游戏·写实风格',
    description: '收录 28 个 3D·游戏·写实风格 主题作品，探索3D与现实的创作灵感',
    cover: 'https://img1.aiart.pics/images/prompts/20251220/q-version-3d-characters-in-crystal-ball-1.jpg',
    count: 25,
    prompts: [
      { title: 'proposal-style-q-version-3d-character-photo', image: 'https://img1.aiart.pics/images/prompts/20251216/proposal-style-q-version-3d-character-photo-1.jpg', promptText: '做了个求婚风格。\n提示词：将照片里的两个人转换成Q版 3D人物，场景换成求婚，背景换成淡雅五彩花瓣做的拱门，背景换成浪漫颜色，地上散落着玫瑰花瓣。除了人物采用Q版 3D人物风格，其他环境采用真实写实风格。 https://t.co/Uhf6MGbhTw' },
      { title: 'realistic-3d-miniature-model', image: 'https://img1.aiart.pics/images/prompts/20251213/realistic-3d-miniature-model-1.jpg', promptText: '感谢大佬 @op7418\n比较喜欢写实风格，进行了一些修改的\nNano Banana prompt\n【作品信息检索】\n- 目标作品名称：《需要添加的名称》\n- 任务：检索该影视剧/小说的剧情、设定与叙事结构。\n- 目标：自动筛选最具代表性的名场面或核心地点，并提取其情绪核心（如悲伤、希望、决断、重逢、毁灭、静谧等）。\n【主场景构建：3D 轴侧微缩模型】\n- 在中央呈现写实的 3D 微缩模型。\n- 视角：轴侧视角（axionometric / isometric）。\n- 模型内容：\n- 建筑细节按原作写实还原\n- 人物动作表情符合物理与叙事逻辑\n- 环境氛围写实呈现（暴风雨、晨雾、夕阳、火光等）\n- 渲染风格：写实材质与光线的物理级渲染。\n- 效果：模型虽小但细节真实，如“现实场景的缩微复制品，被展览级灯光照亮”。\n【背景设计：叙事驱动的写实抽象空间】\n- 禁用纯白或单色背景。\n- 背景基于“场景情绪核心”构建为写实抽象化的情绪空间，包括：\n① 情绪色调（如悲伤 → 冷蓝灰；希望 → 温金光；紧张 → 深色对比）\n② 空气动态与体积光（光雾、尘粒、逆光等具叙事意味）\n③ 轻量符号元素（花瓣、纸屑、灰烬、星尘、水纹等作为情绪化粒子）\n④ 空间深度（空气透视、柔焦、渐层光线营造“余韵流动”的深邃虚空）\n- 目标：让背景以抽象光影暗示故事前后文，与主场景形成情绪呼应。\n【底部排版：作品名 + 经典句子】\n- 底部居中排版。\n- 内容：\n① 中文作品名称：《需要添加的名称》（字体符合作品气质）\n② 一句与该场景相关的原著描写或台词（优雅衬线体）\n- 整体排版参考艺术博物馆铭牌，简洁、平衡、有质感。\n【整体视觉要求】\n- 微缩模型写实、精准、有真实材质。\n- 背景以情绪色彩、体积光与符号粒子强化叙事。\n- 全画面呈现高级展览级叙事艺术品的真实感与诗意氛围。\n直接出图 ，尺寸 16:9' },
      { title: 'realistic-3d-miniature-model', image: 'https://img1.aiart.pics/images/prompts/20251213/realistic-3d-miniature-model-2.jpg', promptText: '感谢大佬 @op7418\n比较喜欢写实风格，进行了一些修改的\nNano Banana prompt\n【作品信息检索】\n- 目标作品名称：《需要添加的名称》\n- 任务：检索该影视剧/小说的剧情、设定与叙事结构。\n- 目标：自动筛选最具代表性的名场面或核心地点，并提取其情绪核心（如悲伤、希望、决断、重逢、毁灭、静谧等）。\n【主场景构建：3D 轴侧微缩模型】\n- 在中央呈现写实的 3D 微缩模型。\n- 视角：轴侧视角（axionometric / isometric）。\n- 模型内容：\n- 建筑细节按原作写实还原\n- 人物动作表情符合物理与叙事逻辑\n- 环境氛围写实呈现（暴风雨、晨雾、夕阳、火光等）\n- 渲染风格：写实材质与光线的物理级渲染。\n- 效果：模型虽小但细节真实，如“现实场景的缩微复制品，被展览级灯光照亮”。\n【背景设计：叙事驱动的写实抽象空间】\n- 禁用纯白或单色背景。\n- 背景基于“场景情绪核心”构建为写实抽象化的情绪空间，包括：\n① 情绪色调（如悲伤 → 冷蓝灰；希望 → 温金光；紧张 → 深色对比）\n② 空气动态与体积光（光雾、尘粒、逆光等具叙事意味）\n③ 轻量符号元素（花瓣、纸屑、灰烬、星尘、水纹等作为情绪化粒子）\n④ 空间深度（空气透视、柔焦、渐层光线营造“余韵流动”的深邃虚空）\n- 目标：让背景以抽象光影暗示故事前后文，与主场景形成情绪呼应。\n【底部排版：作品名 + 经典句子】\n- 底部居中排版。\n- 内容：\n① 中文作品名称：《需要添加的名称》（字体符合作品气质）\n② 一句与该场景相关的原著描写或台词（优雅衬线体）\n- 整体排版参考艺术博物馆铭牌，简洁、平衡、有质感。\n【整体视觉要求】\n- 微缩模型写实、精准、有真实材质。\n- 背景以情绪色彩、体积光与符号粒子强化叙事。\n- 全画面呈现高级展览级叙事艺术品的真实感与诗意氛围。\n直接出图 ，尺寸 16:9' },
      { title: 'realistic-3d-miniature-model', image: 'https://img1.aiart.pics/images/prompts/20251213/realistic-3d-miniature-model-3.jpg', promptText: '感谢大佬 @op7418\n比较喜欢写实风格，进行了一些修改的\nNano Banana prompt\n【作品信息检索】\n- 目标作品名称：《需要添加的名称》\n- 任务：检索该影视剧/小说的剧情、设定与叙事结构。\n- 目标：自动筛选最具代表性的名场面或核心地点，并提取其情绪核心（如悲伤、希望、决断、重逢、毁灭、静谧等）。\n【主场景构建：3D 轴侧微缩模型】\n- 在中央呈现写实的 3D 微缩模型。\n- 视角：轴侧视角（axionometric / isometric）。\n- 模型内容：\n- 建筑细节按原作写实还原\n- 人物动作表情符合物理与叙事逻辑\n- 环境氛围写实呈现（暴风雨、晨雾、夕阳、火光等）\n- 渲染风格：写实材质与光线的物理级渲染。\n- 效果：模型虽小但细节真实，如“现实场景的缩微复制品，被展览级灯光照亮”。\n【背景设计：叙事驱动的写实抽象空间】\n- 禁用纯白或单色背景。\n- 背景基于“场景情绪核心”构建为写实抽象化的情绪空间，包括：\n① 情绪色调（如悲伤 → 冷蓝灰；希望 → 温金光；紧张 → 深色对比）\n② 空气动态与体积光（光雾、尘粒、逆光等具叙事意味）\n③ 轻量符号元素（花瓣、纸屑、灰烬、星尘、水纹等作为情绪化粒子）\n④ 空间深度（空气透视、柔焦、渐层光线营造“余韵流动”的深邃虚空）\n- 目标：让背景以抽象光影暗示故事前后文，与主场景形成情绪呼应。\n【底部排版：作品名 + 经典句子】\n- 底部居中排版。\n- 内容：\n① 中文作品名称：《需要添加的名称》（字体符合作品气质）\n② 一句与该场景相关的原著描写或台词（优雅衬线体）\n- 整体排版参考艺术博物馆铭牌，简洁、平衡、有质感。\n【整体视觉要求】\n- 微缩模型写实、精准、有真实材质。\n- 背景以情绪色彩、体积光与符号粒子强化叙事。\n- 全画面呈现高级展览级叙事艺术品的真实感与诗意氛围。\n直接出图 ，尺寸 16:9' },
      { title: 'realistic-3d-miniature-model', image: 'https://img1.aiart.pics/images/prompts/20251213/realistic-3d-miniature-model-4.jpg', promptText: '感谢大佬 @op7418\n比较喜欢写实风格，进行了一些修改的\nNano Banana prompt\n【作品信息检索】\n- 目标作品名称：《需要添加的名称》\n- 任务：检索该影视剧/小说的剧情、设定与叙事结构。\n- 目标：自动筛选最具代表性的名场面或核心地点，并提取其情绪核心（如悲伤、希望、决断、重逢、毁灭、静谧等）。\n【主场景构建：3D 轴侧微缩模型】\n- 在中央呈现写实的 3D 微缩模型。\n- 视角：轴侧视角（axionometric / isometric）。\n- 模型内容：\n- 建筑细节按原作写实还原\n- 人物动作表情符合物理与叙事逻辑\n- 环境氛围写实呈现（暴风雨、晨雾、夕阳、火光等）\n- 渲染风格：写实材质与光线的物理级渲染。\n- 效果：模型虽小但细节真实，如“现实场景的缩微复制品，被展览级灯光照亮”。\n【背景设计：叙事驱动的写实抽象空间】\n- 禁用纯白或单色背景。\n- 背景基于“场景情绪核心”构建为写实抽象化的情绪空间，包括：\n① 情绪色调（如悲伤 → 冷蓝灰；希望 → 温金光；紧张 → 深色对比）\n② 空气动态与体积光（光雾、尘粒、逆光等具叙事意味）\n③ 轻量符号元素（花瓣、纸屑、灰烬、星尘、水纹等作为情绪化粒子）\n④ 空间深度（空气透视、柔焦、渐层光线营造“余韵流动”的深邃虚空）\n- 目标：让背景以抽象光影暗示故事前后文，与主场景形成情绪呼应。\n【底部排版：作品名 + 经典句子】\n- 底部居中排版。\n- 内容：\n① 中文作品名称：《需要添加的名称》（字体符合作品气质）\n② 一句与该场景相关的原著描写或台词（优雅衬线体）\n- 整体排版参考艺术博物馆铭牌，简洁、平衡、有质感。\n【整体视觉要求】\n- 微缩模型写实、精准、有真实材质。\n- 背景以情绪色彩、体积光与符号粒子强化叙事。\n- 全画面呈现高级展览级叙事艺术品的真实感与诗意氛围。\n直接出图 ，尺寸 16:9' },
    ],
  },
  {
    slug: 'collection-06',
    title: 'Nano Banana·Nano Banana Pro·插画',
    description: '109 个 Nano Banana·Nano Banana Pro·插画 精选集，涵盖人物、Nano Banana Pro、插画等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251204/character-merch-creation-random-nano-banana-use-case-1-thumb.jpg',
    count: 95,
    prompts: [
      { title: 'nano-banana-pro-generation-analysis', image: 'https://img1.aiart.pics/images/prompts/20251218/nano-banana-pro-generation-analysis-1.jpg', promptText: 'Nano Banana Pro 难以评价。太正确了。生成照片的时候就很正确，你想让它生成个 hot white girl in prom dress 都出不来\n生成二次元的时候怎么看都像插画。也可能是我在风格上没使劲 prompt。总感觉是在训练的时候加了点什么正确魔法...\n正确程度和 Flux 2 不相上下 https://t.co/RJ2IWr1Air' },
      { title: 'nano-banana-pro-generation-analysis', image: 'https://img1.aiart.pics/images/prompts/20251218/nano-banana-pro-generation-analysis-2.jpg', promptText: 'Nano Banana Pro 难以评价。太正确了。生成照片的时候就很正确，你想让它生成个 hot white girl in prom dress 都出不来\n生成二次元的时候怎么看都像插画。也可能是我在风格上没使劲 prompt。总感觉是在训练的时候加了点什么正确魔法...\n正确程度和 Flux 2 不相上下 https://t.co/RJ2IWr1Air' },
      { title: 'beijing-7-day-weather-forecast-poster', image: 'https://img1.aiart.pics/images/prompts/20251219/beijing-7-day-weather-forecast-poster-1.jpg', promptText: '北京今天要下雪啦，🌨\n北京7日天气预报-海报 （By 玉伯大佬的YouMind）\nNano banana pro提示词：\n为北京创作接下来7天（包含今天）天气可视化海报。要求:1)每天天气用独特的视觉符号或场景表示(晴天/雨天/雪天/多云/雾霾);2)清晰显示日期、温度、湿度、风力等中文信息;3)整体设计风格为[吉卜力动画/扁平插画/3D微缩/未来科技];4)用色彩和氛围传达天气感受;5)布局清晰易读,适合手机壁纸;6)可添加穿衣建议或出行提示。信息设计与艺术结合,竖版构图,适合社交分享。' },
      { title: 'avant-garde-illustration-skateboard-kid-with-lion-mask-pattern', image: 'https://img1.aiart.pics/images/prompts/20251208/avant-garde-illustration-skateboard-kid-with-lion-mask-pattern-1.jpg', promptText: 'Gemini Nano Banana Pro提示词：\n潮流插画风格，一个穿着国潮服饰的少年正在玩滑板，滑板底部绘有醒狮图案。背景是涂鸦风格的街头墙壁，墙上喷涂着巨大的汉字“国潮”。色彩高饱和度，动感十足。 https://t.co/fgufkRwyeF' },
      { title: 'nano-banana-transform-photos-into-illustrations-with-the-painting-process', image: 'https://img1.aiart.pics/images/prompts/20251204/nano-banana-transform-photos-into-illustrations-with-the-painting-process-1.jpg', promptText: '🍌 nano-banana 一句话 照片变插画 还附带绘画过程？！效果真好啊！！！\nZH25O｜创意系列｜Gemini 2.5 Flash Image\n这下方便做渐变生成的小动画了！nano-banana 可玩性太高了！\n【Prompt】⬇️ https://t.co/Wiy2vv6M5i' },
    ],
  },
  {
    slug: 'collection-07',
    title: '自拍·年轻女子·自然美',
    description: '收录 29 个 自拍·年轻女子·自然美 主题作品，探索人物与现实的创作灵感',
    cover: 'https://img1.aiart.pics/images/prompts/20251228/gemini-3-0-nano-banana-pro-young-woman-selfie-1.jpg',
    count: 28,
    prompts: [
      { title: 'hyper-realistic-detailed-wet-side-portrait', image: 'https://img1.aiart.pics/images/prompts/20251229/hyper-realistic-detailed-wet-side-portrait-1.jpg', promptText: 'M的这个提示词的人物面部皮肤真的是太真实细腻了呀☺\nPrompt：\n{\n“提示”：使用人物的面部特征不发生任何变化。“极致湿身特写肖像，年轻女子侧脸。深色湿发自然地贴在皮肤上。细小的水珠和汗珠在脸上闪闪发光，逼真自然。聚焦于明亮自然的眼睛，反射出真实的光影。水润闪亮的嘴唇，柔软自然的肌肤纹理。柔和的光线，冷色调，浅灰色和白色的散景背景。超写实，8K分辨率，电影级摄影，原始风格。”\n\"负向提示词\":避免出现 \"过度出油、油性皮肤、干性皮肤、浓妆、卡通、插画、3D渲染、低质量、模糊、眼睛变形、人体结构错误、过度曝光、高对比度\",\n“参数”： {\n\"宽高比\": \"9:16\",\n风格： 逼真\n}' },
      { title: 'nano-banana-proselfie-with-celebrities-with-just-a-word-walk-on-movie-sets', image: 'https://img1.aiart.pics/images/prompts/20251207/nano-banana-proselfie-with-celebrities-with-just-a-word-walk-on-movie-sets-1.jpg', promptText: '只需要一个提示词就可以和明星自拍了，还可以走进任意电影的片场，Nano Banana Pro🍌 还是太强了。\n元提示词如下：\n“我在[电影名称]的片场和[电影角色]自拍。\n保持人物与参考图像完全一致，面部特征、骨骼结构、肤色、表情、姿势和外貌 100%相同。1:1 宽高比，4K 细节。”\n比如来一个在《疯狂动物城》的片场和主角自拍了，相应的提示词如下：\n我在[疯狂动物城]的片场和[Judy Hopps]、[Nick Wilde]自拍。\n保持人物与参考图像完全一致，面部特征、骨骼结构、肤色、表情、姿势和外貌 100%相同。1:1 宽高比，4K 细节。' },
      { title: 'nano-banana-proselfie-with-celebrities-with-just-a-word-walk-on-movie-sets', image: 'https://img1.aiart.pics/images/prompts/20251207/nano-banana-proselfie-with-celebrities-with-just-a-word-walk-on-movie-sets-2.jpg', promptText: '只需要一个提示词就可以和明星自拍了，还可以走进任意电影的片场，Nano Banana Pro🍌 还是太强了。\n元提示词如下：\n“我在[电影名称]的片场和[电影角色]自拍。\n保持人物与参考图像完全一致，面部特征、骨骼结构、肤色、表情、姿势和外貌 100%相同。1:1 宽高比，4K 细节。”\n比如来一个在《疯狂动物城》的片场和主角自拍了，相应的提示词如下：\n我在[疯狂动物城]的片场和[Judy Hopps]、[Nick Wilde]自拍。\n保持人物与参考图像完全一致，面部特征、骨骼结构、肤色、表情、姿势和外貌 100%相同。1:1 宽高比，4K 细节。' },
      { title: 'cool-selfie-with-luffy', image: 'https://img1.aiart.pics/images/prompts/20251201/cool-selfie-with-luffy.jpeg', promptText: 'Place Monkey D. Luffy next to the man, smiling widely with his straw hat tilted. Use a Thousand Sunny deck background with bright blue sky. Keep the selfie composition intact and integrate both characters naturally.\n让路飞站在男子旁边，咧嘴一笑，草帽微微倾斜。背景使用千阳号的甲板，天空湛蓝明亮。保持自拍构图完整，自然地将两个人物融入画面。' },
      { title: 'cinematic-profile-portrait-of-young-woman', image: 'https://img1.aiart.pics/images/prompts/20251201/cinematic-profile-portrait-of-young-woman.jpeg', promptText: '一张富有电影感的年轻女子侧脸肖像，她仰着头，闭着眼睛，沐浴在戏剧性的光线中。\\n她站在深蓝色的背景前，穿着一件黑色西装外套。一束暖色聚光灯从右上角照下，在她的脸部和颈部投下橙色的光晕，在冷蓝色的阴影和温暖的高光之间形成了强烈的对比。\\n整个构图强调情绪和氛围，拥有干净的影棚灯光、柔和的渐变和极简主义的氛围。图像应具有艺术感、现代感和强烈的视觉冲击力，类似于高端杂志的编辑摄影风格。\\n相机角度： 侧面拍摄，微仰角\\n光线： 戏剧性的影棚布光，强对比度，蓝色背光 + 暖色聚光灯\\n镜头： 85毫米人像镜头，浅景深\\n氛围： 情绪化，电影感，极简主义' },
    ],
  },
  {
    slug: 'collection-08',
    title: '玩具·图案·3D',
    description: '34 个 玩具·图案·3D 精选集，涵盖图案、3D、产品等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251217/hyper-vibrant-3d-layered-paper-cut-out-artwork-1.jpg',
    count: 32,
    prompts: [
      { title: 'winter-solstice-celebration-poster', image: 'https://img1.aiart.pics/images/prompts/20251221/winter-solstice-celebration-poster-1.jpg', promptText: '今天冬至了，用 Nano banana 生成各种风格的祝福海报，太好用了，大家赶紧用起来！\n提示词：\n一个温馨的3D C4D Octane渲染场景，采用无黑色轮廓的羊毛针毡风格，具有盲盒玩具的柔和边缘审美。四只不同大小的粉彩（薄荷绿、嫩粉、淡蓝、奶油色）羊毛毡Labubu角色，身穿针织毛衣，有着标志性的圆润身体、兔耳和大眼睛，表情喜悦。它们围坐在铺着针织桌布的矮桌旁，桌上摆满热气腾腾的饺子、茶壶和餐具。一个角色正用筷子亲昵地喂另一个角色吃饺子。地面覆盖着羊毛雪和散落的心形装饰。左侧是挂着灯笼的盛开梅花枝，右侧是祥云图案。发光的羊毛心形在空中漂浮。背景是温暖的橙黄色渐变，营造出冬至家庭团聚的节日氛围。顶部是巨大、发光、毛绒质感的艺术字体“饺饺情深，岁岁安康”。中间是清晰简单的祝福语：“愿家人健康快乐，幸福安康！”。8K分辨率，高细节，暖光摄影棚照明，垂直2:3比例。' },
      { title: 'winter-solstice-celebration-poster', image: 'https://img1.aiart.pics/images/prompts/20251221/winter-solstice-celebration-poster-2.jpg', promptText: '今天冬至了，用 Nano banana 生成各种风格的祝福海报，太好用了，大家赶紧用起来！\n提示词：\n一个温馨的3D C4D Octane渲染场景，采用无黑色轮廓的羊毛针毡风格，具有盲盒玩具的柔和边缘审美。四只不同大小的粉彩（薄荷绿、嫩粉、淡蓝、奶油色）羊毛毡Labubu角色，身穿针织毛衣，有着标志性的圆润身体、兔耳和大眼睛，表情喜悦。它们围坐在铺着针织桌布的矮桌旁，桌上摆满热气腾腾的饺子、茶壶和餐具。一个角色正用筷子亲昵地喂另一个角色吃饺子。地面覆盖着羊毛雪和散落的心形装饰。左侧是挂着灯笼的盛开梅花枝，右侧是祥云图案。发光的羊毛心形在空中漂浮。背景是温暖的橙黄色渐变，营造出冬至家庭团聚的节日氛围。顶部是巨大、发光、毛绒质感的艺术字体“饺饺情深，岁岁安康”。中间是清晰简单的祝福语：“愿家人健康快乐，幸福安康！”。8K分辨率，高细节，暖光摄影棚照明，垂直2:3比例。' },
      { title: 'q-version-chinese-wedding', image: 'https://img1.aiart.pics/images/prompts/20251216/q-version-chinese-wedding-1.jpg', promptText: 'Q版中式婚礼，也挺好玩的。\n提示词：将照片里的两个人转换成Q版 3D人物，中式古装婚礼，大红颜色，背景“囍”字剪纸风格图案。 服饰要求：写实，男士身着长袍马褂，主体为红色，上面以金色绣龙纹图案，彰显尊贵大气 ，胸前系着大红花，寓意喜庆吉祥。女士所穿是秀禾服，同样以红色为基调，饰有精美的金色花纹与凤凰刺绣，展现出典雅华丽之感 ，头上搭配花朵发饰，增添柔美温婉气质。二者皆为中式婚礼中经典着装，蕴含着对新人婚姻美满的祝福。 头饰要求： 男士：中式状元帽，主体红色，饰有金色纹样，帽顶有精致金饰，尽显传统儒雅庄重。 女士：凤冠造型，以红色花朵为中心，搭配金色立体装饰与垂坠流苏，华丽富贵，古典韵味十足。' },
      { title: 'starbucks-3d-mini-concept-store-quirky-cityscape-micro-landscape', image: 'https://img1.aiart.pics/images/prompts/20251207/starbucks-3d-mini-concept-store-quirky-cityscape-micro-landscape-1.jpg', promptText: '提示词：\n3D Q版迷你风格，一个充满奇趣的迷你 {品牌名称} 概念店，建筑外观设计灵感来自于该品牌最具代表性的产品或包装（例如巨大的 {该品牌核心产品，如：炸鸡桶/汉堡/甜甜圈/烤鸭} ）。\n建筑共两层，大大的玻璃窗清晰地展示出内部温馨而精致的设计：{品牌主色调} 的装饰风格、温暖的灯光以及忙碌的店员们 {与品牌匹配的穿着}。街道上有可爱的小人偶漫步或坐着，四周布置着长凳、街灯和植物盆栽，营造出迷人的城市一角。整体采用城市微缩景观风格，C4D渲染，盲盒玩具质感，细节丰富、逼真，画面光线柔和、呈现出午后的惬意感受。--ar 2:3\n品牌名称：星巴克咖啡' },
      { title: 'child-initiates-english-speaking-5-diverse-picture-books-help', image: 'https://img1.aiart.pics/images/prompts/20251207/child-initiates-english-speaking-5-diverse-picture-books-help-1.jpg', promptText: '真没想到，孩子主动开口说英语了！\n我最近用 Nano Banana Pro\n给孩子做了 5 套完全不同风格的英语绘本——\n3D 粘土、乐高玩具、扁平 Q 版卡通…\n5 套英语绘本提示词：https://t.co/Xk2ZJLKTCC\n主角一致、画风稳定，整本绘下来完全不崩！\n主题也超丰富：动物、水果、交通工具全都有！\n打印出来效果也超好，家长直接拿去用' },
    ],
  },
  {
    slug: 'collection-09',
    title: '时尚·人物·年轻女子',
    description: '226 个 时尚·人物·年轻女子 精选集，涵盖人物、现实、时尚等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20260106/effortless-chic-selfie-1.jpg',
    count: 225,
    prompts: [
      { title: 'hyper-realistic-detailed-wet-side-portrait', image: 'https://img1.aiart.pics/images/prompts/20251229/hyper-realistic-detailed-wet-side-portrait-1.jpg', promptText: 'M的这个提示词的人物面部皮肤真的是太真实细腻了呀☺\nPrompt：\n{\n“提示”：使用人物的面部特征不发生任何变化。“极致湿身特写肖像，年轻女子侧脸。深色湿发自然地贴在皮肤上。细小的水珠和汗珠在脸上闪闪发光，逼真自然。聚焦于明亮自然的眼睛，反射出真实的光影。水润闪亮的嘴唇，柔软自然的肌肤纹理。柔和的光线，冷色调，浅灰色和白色的散景背景。超写实，8K分辨率，电影级摄影，原始风格。”\n\"负向提示词\":避免出现 \"过度出油、油性皮肤、干性皮肤、浓妆、卡通、插画、3D渲染、低质量、模糊、眼睛变形、人体结构错误、过度曝光、高对比度\",\n“参数”： {\n\"宽高比\": \"9:16\",\n风格： 逼真\n}' },
      { title: 'beautiful-lady-pink-cheongsam', image: 'https://img1.aiart.pics/images/prompts/20251216/beautiful-lady-pink-cheongsam-1.jpg', promptText: 'GPT-4o Prompt：一位美丽的女子身穿粉色旗袍，头戴精致的花饰，秀发中点缀着色彩缤纷的花朵，颈间装饰着优雅的白色蕾丝领子。她的一只手轻托着几只大型蝴蝶。整体拍摄风格呈现高清细节质感，类似时尚杂志封面设计，照片上方中央位置标有文字「FASHION DESIGN」。画面背景采用简约的纯浅灰色，以突出人物主体。' },
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-1.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-2.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'photo-style-sticker-pack-generation', image: 'https://img1.aiart.pics/images/prompts/20251223/photo-style-sticker-pack-generation-1.jpg', promptText: '上传你的照片，生成不同服装风格的贴纸\n🍌Nano Banana Pro Prompt：\n一个以上传照片为原型的3*3贴纸包，人物穿着不同服装和时尚风格。边缘干净裁剪，带有粗线条轮廓，姿势富有表现力，整体采用活泼的现代贴纸设计。在每个贴纸旁边采用中英文标注风格，所有贴纸保持相同的面部特征、一致的相似度和比例。\n包含教师装、传统、护士制服、街头潮牌和奇幻灵感等多种服装风格。高分辨率成品，带有柔和阴影和光泽贴纸纸张质感，适合社交分享。' },
    ],
  },
  {
    slug: 'collection-10',
    title: '车辆·3D·卡通',
    description: '收录 16 个 车辆·3D·卡通 主题作品，探索人物与3D的创作灵感',
    cover: 'https://img1.aiart.pics/images/prompts/20260106/threadcrafted-portraits-1.jpg',
    count: 15,
    prompts: [
      { title: 'hyper-realistic-detailed-wet-side-portrait', image: 'https://img1.aiart.pics/images/prompts/20251229/hyper-realistic-detailed-wet-side-portrait-1.jpg', promptText: 'M的这个提示词的人物面部皮肤真的是太真实细腻了呀☺\nPrompt：\n{\n“提示”：使用人物的面部特征不发生任何变化。“极致湿身特写肖像，年轻女子侧脸。深色湿发自然地贴在皮肤上。细小的水珠和汗珠在脸上闪闪发光，逼真自然。聚焦于明亮自然的眼睛，反射出真实的光影。水润闪亮的嘴唇，柔软自然的肌肤纹理。柔和的光线，冷色调，浅灰色和白色的散景背景。超写实，8K分辨率，电影级摄影，原始风格。”\n\"负向提示词\":避免出现 \"过度出油、油性皮肤、干性皮肤、浓妆、卡通、插画、3D渲染、低质量、模糊、眼睛变形、人体结构错误、过度曝光、高对比度\",\n“参数”： {\n\"宽高比\": \"9:16\",\n风格： 逼真\n}' },
      { title: 'post-apocalyptic-vibe', image: 'https://img1.aiart.pics/images/prompts/20251201/post-apocalyptic-vibe.jpeg', promptText: 'a young cartoon boy with big goggles and scarf driving a tiny makeshift vehicle in the desert, cute post-apocalyptic vibe, indie animation style, soft colors, emotional and adventurous --ar 3:4 --raw --p\n一个戴着大护目镜和围巾的年轻卡通男孩在沙漠中驾驶着一辆小型临时车辆，可爱的后世界末日氛围，独立动画风格，柔和的色彩，情感和冒险 --AR 3：4 --原始 --p' },
      { title: 'post-apocalyptic-vibe', image: 'https://img1.aiart.pics/images/prompts/20251201/191-2.jpeg', promptText: 'a young cartoon boy with big goggles and scarf driving a tiny makeshift vehicle in the desert, cute post-apocalyptic vibe, indie animation style, soft colors, emotional and adventurous --ar 3:4 --raw --p\n一个戴着大护目镜和围巾的年轻卡通男孩在沙漠中驾驶着一辆小型临时车辆，可爱的后世界末日氛围，独立动画风格，柔和的色彩，情感和冒险 --AR 3：4 --原始 --p' },
      { title: 'city-floating-in-a-coffee-cup', image: 'https://img1.aiart.pics/images/prompts/20251213/city-floating-in-a-coffee-cup-1.jpg', promptText: '🍌 nano banana pro 提示词\n☕️✨ 把城市漂浮在咖啡杯的奶泡之上\n--- Prompt ----\n以45°俯视角度呈现一幅精致的微缩3D场景，凸显精准细腻的模型细节。画面特写一只瓷质咖啡杯，杯中的卡布奇诺奶泡之上，微妙地漂浮着一个迷你城市{city}，占据了画面的大部分，场景中央突出展示该{city}最具代表性的地标建筑，细节清晰可见，主要景点散发柔和的灯光，微型街道上有细致逼真的车辆穿梭。整体采用真实感的电影级光效与景深模糊效果，营造出奇幻而梦境般的氛围。画面细节极致丰富，风格高度写实，呈现8K级电影质感。画面比例1:1。' },
      { title: 'sitting-next-to-a-giant-fluffy-cute-cartoon-monster', image: 'https://img1.aiart.pics/images/prompts/20251201/sitting-next-to-a-giant-fluffy-cute-cartoon-monster.jpeg', promptText: 'make me sit next to a giant fluffy cute cartoon monster. I am real realistic but monster is 3d cartoon. It’s hugging me and cute. Big eyes  we are in house on bed\n让我坐在一个毛茸茸的巨型可爱卡通怪物旁边。我真的很逼真，但怪物是3D卡通的。它抱着我，很可爱。大眼睛，我们在屋里的床上。' },
    ],
  },
  {
    slug: 'collection-11',
    title: '人物肖像·头像·特写',
    description: '31 个 人物肖像·头像·特写 精选集，涵盖人物、现实、头像等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20260105/close-up-of-a-womans-hand-1.jpg',
    count: 31,
    prompts: [
      { title: 'street-mural-with-strong-photographic-texture', image: 'https://img1.aiart.pics/images/prompts/20251201/street-mural-with-strong-photographic-texture.jpeg', promptText: '一幅超高清晰度、摄影质感极强的街头壁画，画面呈现强烈的中国风韵味。\\n\\n画中描绘着一位绝美的卡通风女子正面特写头像，她神态柔美而宁静。墙体顶部被一大片盛开的蔷薇花覆盖，茂密的绿叶与繁盛的花朵向外舒展，部分枝条从墙顶垂落而下，与女子的头发巧妙融合，使她的秀发宛如由层层叠叠的蔷薇花组成。这些繁密的花朵簇拥着女子的头部，形成了一顶瑰丽的花冠，视觉效果华美浪漫。\\n\\n背景中蓝天澄澈，点缀着朵朵白云；地面为一条细节真实的沥青街道，上面散落着缤纷多彩的花瓣，行人悠然漫步其间。整体场景细节精致入微，光影明亮柔和，营造出犹如现实般的梦幻街景氛围。' },
      { title: 'hyper-realistic-detailed-wet-side-portrait', image: 'https://img1.aiart.pics/images/prompts/20251229/hyper-realistic-detailed-wet-side-portrait-1.jpg', promptText: 'M的这个提示词的人物面部皮肤真的是太真实细腻了呀☺\nPrompt：\n{\n“提示”：使用人物的面部特征不发生任何变化。“极致湿身特写肖像，年轻女子侧脸。深色湿发自然地贴在皮肤上。细小的水珠和汗珠在脸上闪闪发光，逼真自然。聚焦于明亮自然的眼睛，反射出真实的光影。水润闪亮的嘴唇，柔软自然的肌肤纹理。柔和的光线，冷色调，浅灰色和白色的散景背景。超写实，8K分辨率，电影级摄影，原始风格。”\n\"负向提示词\":避免出现 \"过度出油、油性皮肤、干性皮肤、浓妆、卡通、插画、3D渲染、低质量、模糊、眼睛变形、人体结构错误、过度曝光、高对比度\",\n“参数”： {\n\"宽高比\": \"9:16\",\n风格： 逼真\n}' },
      { title: 'banana-pro-comparison', image: 'https://img1.aiart.pics/images/prompts/20251216/banana-pro-comparison-1.jpg', promptText: '对比了下 Banana Pro 还是强！\n提示词：参考我提供的IP头像图片作为角色一致性参考。生成16宫格（4x4）表情包大图，每格一个表情，格与格之间留细白边分隔。角色保持相同画风，每格可在底部加短中文文案（2~6字，像素字体/简洁黑字）。除指定小道具外不要加复杂背景。无水印、无额外人物。\n16格内容依次为：....' },
      { title: 'mao-ning-style-satirical-cartoon', image: 'https://img1.aiart.pics/images/prompts/20251216/mao-ning-style-satirical-cartoon-1.jpg', promptText: '让 AI 生成一幅毛宁同款讽刺漫画\n工具：sora 或者 GPT-4o\n提示词：\n一幅讽刺漫画风格的插画，采用复古美式漫画风格，背景是一个多层货架，货架上都是一样的红色棒球帽，帽子正面印有大字标语“MAKE AMERICA GREAT AGAIN”，帽侧贴着白色标签写着“MADE IN CHINA”，特写视角聚焦其中一顶红色棒球帽。画面下方有价格牌，原价“$50.00”被粗黑线X划掉，改为“$77.00”，色调为怀旧的土黄与暗红色调，阴影处理带有90年代复古印刷质感。整体构图风格夸张讽刺，具讽刺政治消费主义的意味。' },
      { title: 'city-floating-in-a-coffee-cup', image: 'https://img1.aiart.pics/images/prompts/20251213/city-floating-in-a-coffee-cup-1.jpg', promptText: '🍌 nano banana pro 提示词\n☕️✨ 把城市漂浮在咖啡杯的奶泡之上\n--- Prompt ----\n以45°俯视角度呈现一幅精致的微缩3D场景，凸显精准细腻的模型细节。画面特写一只瓷质咖啡杯，杯中的卡布奇诺奶泡之上，微妙地漂浮着一个迷你城市{city}，占据了画面的大部分，场景中央突出展示该{city}最具代表性的地标建筑，细节清晰可见，主要景点散发柔和的灯光，微型街道上有细致逼真的车辆穿梭。整体采用真实感的电影级光效与景深模糊效果，营造出奇幻而梦境般的氛围。画面细节极致丰富，风格高度写实，呈现8K级电影质感。画面比例1:1。' },
    ],
  },
  {
    slug: 'collection-12',
    title: 'GPT 4o·GPT-4o·3D',
    description: '精选 9 个 GPT 4o·GPT-4o·3D 风格提示词',
    cover: 'https://img1.aiart.pics/images/prompts/20251216/gpt-4o-transforms-anything-into-transparent-glass-instantly-1.jpg',
    count: 9,
    prompts: [
      { title: 'miniature-3d-style-architecture', image: 'https://img1.aiart.pics/images/prompts/20251216/miniature-3d-style-architecture-1.jpg', promptText: '迷你 3D 风格建筑\n工具：GPT-4o 或者 sora\n提示词参考：\n3D Q版迷你风格，一个充满奇趣的迷你星巴克咖啡馆，外观就像一个巨大的外带咖啡杯，还有盖子和吸管。建筑共两层，大大的玻璃窗清晰地展示出内部温馨而精致的设计：木质的家具、温暖的灯光以及忙碌的咖啡师们。街道上有可爱的小人偶漫步或坐着，四周布置着长凳、街灯和植物盆栽，营造出迷人的城市一角。整体采用城市微缩景观风格，细节丰富、逼真，画面光线柔和、呈现出午后的惬意感受。' },
      { title: 'northwestern-polytechnical-university-3d-q-version-female-character', image: 'https://img1.aiart.pics/images/prompts/20251216/northwestern-polytechnical-university-3d-q-version-female-character-1.jpg', promptText: '给你的母校生成一幅拟人化的 3D 形象\n工具：sora 或 GPT-4o\n提示词：\n給【西北工业大学】画一个拟人化的3D Q版美少女形象，体现学校【航空航天航海三航】特色\n参考示例：\n- 給中国人民大学画一个拟人化的3D Q版美少女形象，体现学校人文社会科学的特色\n- 給清华大学画一个拟人化的3D Q版美少女形象，体现学校特色\n- 給北京大学画一个拟人化的3D Q版美少女形象，体现学校特色' },
      { title: 'northwestern-polytechnical-university-3d-q-version-female-character', image: 'https://img1.aiart.pics/images/prompts/20251216/northwestern-polytechnical-university-3d-q-version-female-character-2.jpg', promptText: '给你的母校生成一幅拟人化的 3D 形象\n工具：sora 或 GPT-4o\n提示词：\n給【西北工业大学】画一个拟人化的3D Q版美少女形象，体现学校【航空航天航海三航】特色\n参考示例：\n- 給中国人民大学画一个拟人化的3D Q版美少女形象，体现学校人文社会科学的特色\n- 給清华大学画一个拟人化的3D Q版美少女形象，体现学校特色\n- 給北京大学画一个拟人化的3D Q版美少女形象，体现学校特色' },
      { title: 'northwestern-polytechnical-university-3d-q-version-female-character', image: 'https://img1.aiart.pics/images/prompts/20251216/northwestern-polytechnical-university-3d-q-version-female-character-3.jpg', promptText: '给你的母校生成一幅拟人化的 3D 形象\n工具：sora 或 GPT-4o\n提示词：\n給【西北工业大学】画一个拟人化的3D Q版美少女形象，体现学校【航空航天航海三航】特色\n参考示例：\n- 給中国人民大学画一个拟人化的3D Q版美少女形象，体现学校人文社会科学的特色\n- 給清华大学画一个拟人化的3D Q版美少女形象，体现学校特色\n- 給北京大学画一个拟人化的3D Q版美少女形象，体现学校特色' },
      { title: 'northwestern-polytechnical-university-3d-q-version-female-character', image: 'https://img1.aiart.pics/images/prompts/20251216/northwestern-polytechnical-university-3d-q-version-female-character-4.jpg', promptText: '给你的母校生成一幅拟人化的 3D 形象\n工具：sora 或 GPT-4o\n提示词：\n給【西北工业大学】画一个拟人化的3D Q版美少女形象，体现学校【航空航天航海三航】特色\n参考示例：\n- 給中国人民大学画一个拟人化的3D Q版美少女形象，体现学校人文社会科学的特色\n- 給清华大学画一个拟人化的3D Q版美少女形象，体现学校特色\n- 給北京大学画一个拟人化的3D Q版美少女形象，体现学校特色' },
    ],
  },
  {
    slug: 'collection-13',
    title: '插画·科技·产品',
    description: '223 个 插画·科技·产品 精选集，涵盖现实、人物、产品等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20260104/art-student-sketching-prompt-analysis-1.jpg',
    count: 200,
    prompts: [
      { title: 'celebrity-achievement-illustration', image: 'https://img1.aiart.pics/images/prompts/20251226/celebrity-achievement-illustration-1.jpg', promptText: '名人成就插画\n示例：特斯拉vs爱迪生 （考虑到是两人关系，还是背对背排列吧🤣）\n利用“双重曝光剪影风格”，融入了包豪斯风格的几何元素，再加上Google产品所拥有的素材检索能力以及nano banana pro强大的风格化能力，可以轻松地为某位历史名人绘制出融合了其上身轮廓以及人物成就的插画。\n提示词（英文版见评论区）\n---\n人物名称：特斯拉\n一幅包豪斯风格的几何双重曝光插画，呈现[在此处插入著名人物名字]的侧面剪影。整体画面置于浅米色纯色背景之上。\n自适应色彩方案说明（仅用于几何元素）：\nAI 应根据上述人物的气质、时代特征与标志性风格生成统一协调的包豪斯色彩方案（例如：对创新者使用冷感的科技蓝与灰；对艺术家使用温暖而鲜明的原色）。该色彩方案仅适用于几何图案与下方的字体，不适用于肤色。\n至关重要的是，面部特征（眼部区域、鼻子、嘴、下巴、脸颊）必须以接近人物自然肤色的纯色、平面矢量方式呈现。该肤色区域需保持干净，几乎不含几何纹理，以确保人物的清晰可辨识度与庄重感。肤色区域应与周围的几何图案形成干净利落的对比。\n复杂的几何叙事图案应集中在剪影的头发、后脑、颈部与肩部区域。在这些具有纹理的区域中，图像需依据自适应包豪斯色板划分为三个层次：\n底部区域（颈部根部与肩部——基础）：\n几何抽象元素，用以象征其出身、早期奋斗或奠基性的根源。\n中部区域（颈部、下颌线与后脑——成就）：\n清晰可辨的包豪斯风格几何化抽象符号，代表其职业生涯中最具代表性的工具、产品或关键成果。它们不应只是隐藏在纹理中的暗示，而应是由几何形状构成、可读性明确的符号。\n顶部区域（大脑上部与头发——愿景）：\n抽象的几何圆形、线条与飘逸形态，用以表现其智慧、思想、未来愿景或精神遗产。\n在主剪影插画下方，以定制的包豪斯风格字体呈现人物全名“[在此处插入著名人物名字]”。字体为几何无衬线体，由基本形状（圆、方、三角形、粗' },
      { title: 'celebrity-achievement-illustration', image: 'https://img1.aiart.pics/images/prompts/20251226/celebrity-achievement-illustration-2.jpg', promptText: '名人成就插画\n示例：特斯拉vs爱迪生 （考虑到是两人关系，还是背对背排列吧🤣）\n利用“双重曝光剪影风格”，融入了包豪斯风格的几何元素，再加上Google产品所拥有的素材检索能力以及nano banana pro强大的风格化能力，可以轻松地为某位历史名人绘制出融合了其上身轮廓以及人物成就的插画。\n提示词（英文版见评论区）\n---\n人物名称：特斯拉\n一幅包豪斯风格的几何双重曝光插画，呈现[在此处插入著名人物名字]的侧面剪影。整体画面置于浅米色纯色背景之上。\n自适应色彩方案说明（仅用于几何元素）：\nAI 应根据上述人物的气质、时代特征与标志性风格生成统一协调的包豪斯色彩方案（例如：对创新者使用冷感的科技蓝与灰；对艺术家使用温暖而鲜明的原色）。该色彩方案仅适用于几何图案与下方的字体，不适用于肤色。\n至关重要的是，面部特征（眼部区域、鼻子、嘴、下巴、脸颊）必须以接近人物自然肤色的纯色、平面矢量方式呈现。该肤色区域需保持干净，几乎不含几何纹理，以确保人物的清晰可辨识度与庄重感。肤色区域应与周围的几何图案形成干净利落的对比。\n复杂的几何叙事图案应集中在剪影的头发、后脑、颈部与肩部区域。在这些具有纹理的区域中，图像需依据自适应包豪斯色板划分为三个层次：\n底部区域（颈部根部与肩部——基础）：\n几何抽象元素，用以象征其出身、早期奋斗或奠基性的根源。\n中部区域（颈部、下颌线与后脑——成就）：\n清晰可辨的包豪斯风格几何化抽象符号，代表其职业生涯中最具代表性的工具、产品或关键成果。它们不应只是隐藏在纹理中的暗示，而应是由几何形状构成、可读性明确的符号。\n顶部区域（大脑上部与头发——愿景）：\n抽象的几何圆形、线条与飘逸形态，用以表现其智慧、思想、未来愿景或精神遗产。\n在主剪影插画下方，以定制的包豪斯风格字体呈现人物全名“[在此处插入著名人物名字]”。字体为几何无衬线体，由基本形状（圆、方、三角形、粗' },
      { title: 'celebrity-achievement-illustration', image: 'https://img1.aiart.pics/images/prompts/20251226/celebrity-achievement-illustration-3.jpg', promptText: '名人成就插画\n示例：特斯拉vs爱迪生 （考虑到是两人关系，还是背对背排列吧🤣）\n利用“双重曝光剪影风格”，融入了包豪斯风格的几何元素，再加上Google产品所拥有的素材检索能力以及nano banana pro强大的风格化能力，可以轻松地为某位历史名人绘制出融合了其上身轮廓以及人物成就的插画。\n提示词（英文版见评论区）\n---\n人物名称：特斯拉\n一幅包豪斯风格的几何双重曝光插画，呈现[在此处插入著名人物名字]的侧面剪影。整体画面置于浅米色纯色背景之上。\n自适应色彩方案说明（仅用于几何元素）：\nAI 应根据上述人物的气质、时代特征与标志性风格生成统一协调的包豪斯色彩方案（例如：对创新者使用冷感的科技蓝与灰；对艺术家使用温暖而鲜明的原色）。该色彩方案仅适用于几何图案与下方的字体，不适用于肤色。\n至关重要的是，面部特征（眼部区域、鼻子、嘴、下巴、脸颊）必须以接近人物自然肤色的纯色、平面矢量方式呈现。该肤色区域需保持干净，几乎不含几何纹理，以确保人物的清晰可辨识度与庄重感。肤色区域应与周围的几何图案形成干净利落的对比。\n复杂的几何叙事图案应集中在剪影的头发、后脑、颈部与肩部区域。在这些具有纹理的区域中，图像需依据自适应包豪斯色板划分为三个层次：\n底部区域（颈部根部与肩部——基础）：\n几何抽象元素，用以象征其出身、早期奋斗或奠基性的根源。\n中部区域（颈部、下颌线与后脑——成就）：\n清晰可辨的包豪斯风格几何化抽象符号，代表其职业生涯中最具代表性的工具、产品或关键成果。它们不应只是隐藏在纹理中的暗示，而应是由几何形状构成、可读性明确的符号。\n顶部区域（大脑上部与头发——愿景）：\n抽象的几何圆形、线条与飘逸形态，用以表现其智慧、思想、未来愿景或精神遗产。\n在主剪影插画下方，以定制的包豪斯风格字体呈现人物全名“[在此处插入著名人物名字]”。字体为几何无衬线体，由基本形状（圆、方、三角形、粗' },
      { title: 'celebrity-achievement-illustration', image: 'https://img1.aiart.pics/images/prompts/20251226/celebrity-achievement-illustration-4.jpg', promptText: '名人成就插画\n示例：特斯拉vs爱迪生 （考虑到是两人关系，还是背对背排列吧🤣）\n利用“双重曝光剪影风格”，融入了包豪斯风格的几何元素，再加上Google产品所拥有的素材检索能力以及nano banana pro强大的风格化能力，可以轻松地为某位历史名人绘制出融合了其上身轮廓以及人物成就的插画。\n提示词（英文版见评论区）\n---\n人物名称：特斯拉\n一幅包豪斯风格的几何双重曝光插画，呈现[在此处插入著名人物名字]的侧面剪影。整体画面置于浅米色纯色背景之上。\n自适应色彩方案说明（仅用于几何元素）：\nAI 应根据上述人物的气质、时代特征与标志性风格生成统一协调的包豪斯色彩方案（例如：对创新者使用冷感的科技蓝与灰；对艺术家使用温暖而鲜明的原色）。该色彩方案仅适用于几何图案与下方的字体，不适用于肤色。\n至关重要的是，面部特征（眼部区域、鼻子、嘴、下巴、脸颊）必须以接近人物自然肤色的纯色、平面矢量方式呈现。该肤色区域需保持干净，几乎不含几何纹理，以确保人物的清晰可辨识度与庄重感。肤色区域应与周围的几何图案形成干净利落的对比。\n复杂的几何叙事图案应集中在剪影的头发、后脑、颈部与肩部区域。在这些具有纹理的区域中，图像需依据自适应包豪斯色板划分为三个层次：\n底部区域（颈部根部与肩部——基础）：\n几何抽象元素，用以象征其出身、早期奋斗或奠基性的根源。\n中部区域（颈部、下颌线与后脑——成就）：\n清晰可辨的包豪斯风格几何化抽象符号，代表其职业生涯中最具代表性的工具、产品或关键成果。它们不应只是隐藏在纹理中的暗示，而应是由几何形状构成、可读性明确的符号。\n顶部区域（大脑上部与头发——愿景）：\n抽象的几何圆形、线条与飘逸形态，用以表现其智慧、思想、未来愿景或精神遗产。\n在主剪影插画下方，以定制的包豪斯风格字体呈现人物全名“[在此处插入著名人物名字]”。字体为几何无衬线体，由基本形状（圆、方、三角形、粗' },
      { title: 'beijing-7-day-weather-forecast-poster', image: 'https://img1.aiart.pics/images/prompts/20251219/beijing-7-day-weather-forecast-poster-1.jpg', promptText: '北京今天要下雪啦，🌨\n北京7日天气预报-海报 （By 玉伯大佬的YouMind）\nNano banana pro提示词：\n为北京创作接下来7天（包含今天）天气可视化海报。要求:1)每天天气用独特的视觉符号或场景表示(晴天/雨天/雪天/多云/雾霾);2)清晰显示日期、温度、湿度、风力等中文信息;3)整体设计风格为[吉卜力动画/扁平插画/3D微缩/未来科技];4)用色彩和氛围传达天气感受;5)布局清晰易读,适合手机壁纸;6)可添加穿衣建议或出行提示。信息设计与艺术结合,竖版构图,适合社交分享。' },
    ],
  },
  {
    slug: 'collection-14',
    title: '3D·插画·游戏',
    description: '63 个 3D·插画·游戏 精选集，涵盖3D、现实、人物等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251209/nano-banana-pro-make-this-lego-1.jpg',
    count: 58,
    prompts: [
      { title: 'hyper-realistic-detailed-wet-side-portrait', image: 'https://img1.aiart.pics/images/prompts/20251229/hyper-realistic-detailed-wet-side-portrait-1.jpg', promptText: 'M的这个提示词的人物面部皮肤真的是太真实细腻了呀☺\nPrompt：\n{\n“提示”：使用人物的面部特征不发生任何变化。“极致湿身特写肖像，年轻女子侧脸。深色湿发自然地贴在皮肤上。细小的水珠和汗珠在脸上闪闪发光，逼真自然。聚焦于明亮自然的眼睛，反射出真实的光影。水润闪亮的嘴唇，柔软自然的肌肤纹理。柔和的光线，冷色调，浅灰色和白色的散景背景。超写实，8K分辨率，电影级摄影，原始风格。”\n\"负向提示词\":避免出现 \"过度出油、油性皮肤、干性皮肤、浓妆、卡通、插画、3D渲染、低质量、模糊、眼睛变形、人体结构错误、过度曝光、高对比度\",\n“参数”： {\n\"宽高比\": \"9:16\",\n风格： 逼真\n}' },
      { title: 'illustrated-how-genshin-impact-changed-the-chinese-game-industry', image: 'https://img1.aiart.pics/images/prompts/20251208/illustrated-how-genshin-impact-changed-the-chinese-game-industry-1.jpg', promptText: '2、科普插画\n提示词：用一个科普插画解释为什么原神改变了中国国产游戏生态，文字用中文 https://t.co/OLMKycsNKv' },
      { title: 'illustrated-how-genshin-impact-changed-the-chinese-game-industry', image: 'https://img1.aiart.pics/images/prompts/20251208/illustrated-how-genshin-impact-changed-the-chinese-game-industry-2.jpg', promptText: '2、科普插画\n提示词：用一个科普插画解释为什么原神改变了中国国产游戏生态，文字用中文 https://t.co/OLMKycsNKv' },
      { title: '3d-isometric-illustration-of-working-from-home', image: 'https://img1.aiart.pics/images/prompts/20251209/3d-isometric-illustration-of-working-from-home-1.jpg', promptText: '--- 提示词 ---\n请根据你对我的了解，生成一副我正在家办公的3D等距视角的彩色插画，包含室内的各种细节描写，画面呈现出圆润、精致、趣味盎然的视觉风格。--ar 1:1\n[附加细节: 我有3显示器，还有一只比熊犬] https://t.co/LrTelirtYU' },
      { title: 'beijing-7-day-weather-forecast-poster', image: 'https://img1.aiart.pics/images/prompts/20251219/beijing-7-day-weather-forecast-poster-1.jpg', promptText: '北京今天要下雪啦，🌨\n北京7日天气预报-海报 （By 玉伯大佬的YouMind）\nNano banana pro提示词：\n为北京创作接下来7天（包含今天）天气可视化海报。要求:1)每天天气用独特的视觉符号或场景表示(晴天/雨天/雪天/多云/雾霾);2)清晰显示日期、温度、湿度、风力等中文信息;3)整体设计风格为[吉卜力动画/扁平插画/3D微缩/未来科技];4)用色彩和氛围传达天气感受;5)布局清晰易读,适合手机壁纸;6)可添加穿衣建议或出行提示。信息设计与艺术结合,竖版构图,适合社交分享。' },
    ],
  },
  {
    slug: 'collection-15',
    title: '特写·节庆·雪域',
    description: '收录 21 个 特写·节庆·雪域 主题作品，探索人物与现实的创作灵感',
    cover: 'https://img1.aiart.pics/images/prompts/20251230/winter-landscape-korean-idol-1.jpg',
    count: 18,
    prompts: [
      { title: 'hyper-realistic-detailed-wet-side-portrait', image: 'https://img1.aiart.pics/images/prompts/20251229/hyper-realistic-detailed-wet-side-portrait-1.jpg', promptText: 'M的这个提示词的人物面部皮肤真的是太真实细腻了呀☺\nPrompt：\n{\n“提示”：使用人物的面部特征不发生任何变化。“极致湿身特写肖像，年轻女子侧脸。深色湿发自然地贴在皮肤上。细小的水珠和汗珠在脸上闪闪发光，逼真自然。聚焦于明亮自然的眼睛，反射出真实的光影。水润闪亮的嘴唇，柔软自然的肌肤纹理。柔和的光线，冷色调，浅灰色和白色的散景背景。超写实，8K分辨率，电影级摄影，原始风格。”\n\"负向提示词\":避免出现 \"过度出油、油性皮肤、干性皮肤、浓妆、卡通、插画、3D渲染、低质量、模糊、眼睛变形、人体结构错误、过度曝光、高对比度\",\n“参数”： {\n\"宽高比\": \"9:16\",\n风格： 逼真\n}' },
      { title: 'mao-ning-style-satirical-cartoon', image: 'https://img1.aiart.pics/images/prompts/20251216/mao-ning-style-satirical-cartoon-1.jpg', promptText: '让 AI 生成一幅毛宁同款讽刺漫画\n工具：sora 或者 GPT-4o\n提示词：\n一幅讽刺漫画风格的插画，采用复古美式漫画风格，背景是一个多层货架，货架上都是一样的红色棒球帽，帽子正面印有大字标语“MAKE AMERICA GREAT AGAIN”，帽侧贴着白色标签写着“MADE IN CHINA”，特写视角聚焦其中一顶红色棒球帽。画面下方有价格牌，原价“$50.00”被粗黑线X划掉，改为“$77.00”，色调为怀旧的土黄与暗红色调，阴影处理带有90年代复古印刷质感。整体构图风格夸张讽刺，具讽刺政治消费主义的意味。' },
      { title: 'city-floating-in-a-coffee-cup', image: 'https://img1.aiart.pics/images/prompts/20251213/city-floating-in-a-coffee-cup-1.jpg', promptText: '🍌 nano banana pro 提示词\n☕️✨ 把城市漂浮在咖啡杯的奶泡之上\n--- Prompt ----\n以45°俯视角度呈现一幅精致的微缩3D场景，凸显精准细腻的模型细节。画面特写一只瓷质咖啡杯，杯中的卡布奇诺奶泡之上，微妙地漂浮着一个迷你城市{city}，占据了画面的大部分，场景中央突出展示该{city}最具代表性的地标建筑，细节清晰可见，主要景点散发柔和的灯光，微型街道上有细致逼真的车辆穿梭。整体采用真实感的电影级光效与景深模糊效果，营造出奇幻而梦境般的氛围。画面细节极致丰富，风格高度写实，呈现8K级电影质感。画面比例1:1。' },
      { title: 'street-mural-with-strong-photographic-texture', image: 'https://img1.aiart.pics/images/prompts/20251201/street-mural-with-strong-photographic-texture.jpeg', promptText: '一幅超高清晰度、摄影质感极强的街头壁画，画面呈现强烈的中国风韵味。\\n\\n画中描绘着一位绝美的卡通风女子正面特写头像，她神态柔美而宁静。墙体顶部被一大片盛开的蔷薇花覆盖，茂密的绿叶与繁盛的花朵向外舒展，部分枝条从墙顶垂落而下，与女子的头发巧妙融合，使她的秀发宛如由层层叠叠的蔷薇花组成。这些繁密的花朵簇拥着女子的头部，形成了一顶瑰丽的花冠，视觉效果华美浪漫。\\n\\n背景中蓝天澄澈，点缀着朵朵白云；地面为一条细节真实的沥青街道，上面散落着缤纷多彩的花瓣，行人悠然漫步其间。整体场景细节精致入微，光影明亮柔和，营造出犹如现实般的梦幻街景氛围。' },
      { title: 'how-to-alleviate-suffering-only-by-rapid-wealth', image: 'https://img1.aiart.pics/images/prompts/20251208/how-to-alleviate-suffering-only-by-rapid-wealth-1.jpg', promptText: '何以解忧，唯有暴富\nNano Banana Pro (gemini-3-pro-image-preview) 提示词：\n一张黄色的道教符咒特写，但上面的鬼画符仔细看是“RMB”和“USD”的货币符号交织而成。中间醒目的朱砂红字写着：“何以解忧，唯有暴富”。 https://t.co/81xJCiA4Ib' },
    ],
  },
  {
    slug: 'collection-16',
    title: 'Nano Banana Pro·产品评测·技术',
    description: '76 个 Nano Banana Pro·产品评测·技术 精选集，涵盖Nano Banana Pro、现实、产品等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251214/image-generation-future-and-opportunities-1.jpg',
    count: 66,
    prompts: [
      { title: 'steal-my-top-5-high-efficiency-nano-banana-pro-prompts', image: 'https://img1.aiart.pics/images/prompts/20251218/steal-my-top-5-high-efficiency-nano-banana-pro-prompts-1.jpg', promptText: '偷走这5个高效的Nano Banana Pro提示词\n- LinkedIn信息图\n- 技术架构图\n- 产品UI对比模型\n- 数据可视化\n- 代码可视化解释\n一个海外的 newsletter 博主，叫：Aakash Gupta。原名就叫：Steal My Top 5 Nano Banana Pro Prompts: AI Update。 https://t.co/CzpXTxFJm3' },
      { title: 'steal-my-top-5-high-efficiency-nano-banana-pro-prompts', image: 'https://img1.aiart.pics/images/prompts/20251218/steal-my-top-5-high-efficiency-nano-banana-pro-prompts-2.jpg', promptText: '偷走这5个高效的Nano Banana Pro提示词\n- LinkedIn信息图\n- 技术架构图\n- 产品UI对比模型\n- 数据可视化\n- 代码可视化解释\n一个海外的 newsletter 博主，叫：Aakash Gupta。原名就叫：Steal My Top 5 Nano Banana Pro Prompts: AI Update。 https://t.co/CzpXTxFJm3' },
      { title: 'steal-my-top-5-high-efficiency-nano-banana-pro-prompts', image: 'https://img1.aiart.pics/images/prompts/20251218/steal-my-top-5-high-efficiency-nano-banana-pro-prompts-3.jpg', promptText: '偷走这5个高效的Nano Banana Pro提示词\n- LinkedIn信息图\n- 技术架构图\n- 产品UI对比模型\n- 数据可视化\n- 代码可视化解释\n一个海外的 newsletter 博主，叫：Aakash Gupta。原名就叫：Steal My Top 5 Nano Banana Pro Prompts: AI Update。 https://t.co/CzpXTxFJm3' },
      { title: 'steal-my-top-5-high-efficiency-nano-banana-pro-prompts', image: 'https://img1.aiart.pics/images/prompts/20251218/steal-my-top-5-high-efficiency-nano-banana-pro-prompts-4.jpg', promptText: '偷走这5个高效的Nano Banana Pro提示词\n- LinkedIn信息图\n- 技术架构图\n- 产品UI对比模型\n- 数据可视化\n- 代码可视化解释\n一个海外的 newsletter 博主，叫：Aakash Gupta。原名就叫：Steal My Top 5 Nano Banana Pro Prompts: AI Update。 https://t.co/CzpXTxFJm3' },
      { title: 'nano-banana-pro-a-magical-experience', image: 'https://img1.aiart.pics/images/prompts/20251209/nano-banana-pro-a-magical-experience-1.jpg', promptText: '&gt; make it lego\nnano banana pro，相当神奇。\ngoogle 几十年来积累的数据和技术优势，在gemini 3 和 nano banana 上得到了充分体现。 https://t.co/9felJPuwh5' },
    ],
  },
  {
    slug: 'collection-17',
    title: '人物肖像·头像·人物',
    description: '170 个 人物肖像·头像·人物 精选集，涵盖人物、现实、头像等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251230/young-man-mugshot-1.jpg',
    count: 167,
    prompts: [
      { title: 'banana-pro-comparison', image: 'https://img1.aiart.pics/images/prompts/20251216/banana-pro-comparison-1.jpg', promptText: '对比了下 Banana Pro 还是强！\n提示词：参考我提供的IP头像图片作为角色一致性参考。生成16宫格（4x4）表情包大图，每格一个表情，格与格之间留细白边分隔。角色保持相同画风，每格可在底部加短中文文案（2~6字，像素字体/简洁黑字）。除指定小道具外不要加复杂背景。无水印、无额外人物。\n16格内容依次为：....' },
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-1.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-2.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'celebrity-quote-card', image: 'https://img1.aiart.pics/images/prompts/20251201/celebrity-quote-card.jpeg', promptText: '一张宽的名人金句卡，棕色背景，衬线体浅金色 “保持饥饿, 保持愚蠢” 小字“——Steve Jobs”，文字前面带一个大的淡淡的引号，人物头像在左边，文字在右边，文字占画面比例2/3，人物占1/3，人物有点渐变过渡的感觉' },
      { title: 'cute-universe-magazine-cover', image: 'https://img1.aiart.pics/images/prompts/20251213/cute-universe-magazine-cover-1.jpg', promptText: '【✨萌萌宇宙系列】提示词：\n当用户上传参考图时：使用参考图中的人物作为海报主角，严格沿用参考图的人物脸型、五官、发型和大致姿态，保证人物身份不变化；服装款式、颜色搭配、妆容、光线、质感以及整体海报风格（如清冷、高饱和、复古、Y2K 等）都尽量参考参考图进行自定义。如果参考图里的人物服装配色不够明显，再适当加入绿色和香蕉黄色的高端时尚服装细节作为点缀。\n画面是一张有光泽的杂志封面照片，白色背景上充满整个画面的巨大粗体衬线文字，黑色字体，占据主要视野。参考图中的人物肖像被置于文字之前，作为画面主体，部分遮挡文字但不完全挡住标题，构图时人物居中或略偏一侧，保持时尚杂志封面感。\n在画面一角放上小号的期号、今天的日期、价格和条形码，这些元素要低调但清晰可读，不再添加其他文字或标语。整体杂志摆放在简洁的白色架子上，靠在白色或浅色墙面上拍摄，光线干净利落，突出参考图人物风格与杂志封面设计的结合。' },
    ],
  },
  {
    slug: 'collection-18',
    title: '节庆·圣诞节·圣诞主题',
    description: '48 个 节庆·圣诞节·圣诞主题 精选集，涵盖节庆、圣诞节、人物等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251218/christmas-snow-globe-characters-by-nano-banana-pro-1.png',
    count: 43,
    prompts: [
      { title: 'universal-christmas-filter-effect', image: 'https://img1.aiart.pics/images/prompts/20251226/universal-christmas-filter-effect-1.jpg', promptText: '太强了！圣诞节万用滤镜！\n用 Nano Banana Pro 让任意图片进入平安夜！\n这个提示词可以说有点逆天，不管是人物、动物、物件、场景等等图片，全部做成圣诞节气氛，让大家完全不用动脑子就能出图\n提示词:\n请以我上传的主体为画面核心，将其自然地融入一个真实可信的圣诞节场景中。\n保持主体的本质身份与核心识别特征，维持上传主体的画风，不刻意改造，不模板化装饰。\n根据主体类型主动构建最合适的圣诞环境、光影与氛围。\n如果主体是人物或动物，请为其搭配符合圣诞氛围且与场景匹配的服饰或装饰，并设计自然、贴合环境的动作、姿态与表情，让其看起来像正在度过圣诞，而不是摆拍。\n如果主体是物品或产品，主体本身保持不变，通过场景、灯光与节日元素营造圣诞气氛，节日元素作为点缀，不喧宾夺主。\n整体画面呈现温暖、节庆、治愈的圣诞情绪，使用柔和的节日光影与冬季色彩对比，构图自然、真实、具有电影或广告级质感，让画面像真实世界中的一刻圣诞时光。\n欢迎大家评论区交作业\n#ChristmasEve #Gemini #NanoBananaPro' },
      { title: 'universal-christmas-filter-effect', image: 'https://img1.aiart.pics/images/prompts/20251226/universal-christmas-filter-effect-2.jpg', promptText: '太强了！圣诞节万用滤镜！\n用 Nano Banana Pro 让任意图片进入平安夜！\n这个提示词可以说有点逆天，不管是人物、动物、物件、场景等等图片，全部做成圣诞节气氛，让大家完全不用动脑子就能出图\n提示词:\n请以我上传的主体为画面核心，将其自然地融入一个真实可信的圣诞节场景中。\n保持主体的本质身份与核心识别特征，维持上传主体的画风，不刻意改造，不模板化装饰。\n根据主体类型主动构建最合适的圣诞环境、光影与氛围。\n如果主体是人物或动物，请为其搭配符合圣诞氛围且与场景匹配的服饰或装饰，并设计自然、贴合环境的动作、姿态与表情，让其看起来像正在度过圣诞，而不是摆拍。\n如果主体是物品或产品，主体本身保持不变，通过场景、灯光与节日元素营造圣诞气氛，节日元素作为点缀，不喧宾夺主。\n整体画面呈现温暖、节庆、治愈的圣诞情绪，使用柔和的节日光影与冬季色彩对比，构图自然、真实、具有电影或广告级质感，让画面像真实世界中的一刻圣诞时光。\n欢迎大家评论区交作业\n#ChristmasEve #Gemini #NanoBananaPro' },
      { title: 'universal-christmas-filter-effect', image: 'https://img1.aiart.pics/images/prompts/20251226/universal-christmas-filter-effect-3.jpg', promptText: '太强了！圣诞节万用滤镜！\n用 Nano Banana Pro 让任意图片进入平安夜！\n这个提示词可以说有点逆天，不管是人物、动物、物件、场景等等图片，全部做成圣诞节气氛，让大家完全不用动脑子就能出图\n提示词:\n请以我上传的主体为画面核心，将其自然地融入一个真实可信的圣诞节场景中。\n保持主体的本质身份与核心识别特征，维持上传主体的画风，不刻意改造，不模板化装饰。\n根据主体类型主动构建最合适的圣诞环境、光影与氛围。\n如果主体是人物或动物，请为其搭配符合圣诞氛围且与场景匹配的服饰或装饰，并设计自然、贴合环境的动作、姿态与表情，让其看起来像正在度过圣诞，而不是摆拍。\n如果主体是物品或产品，主体本身保持不变，通过场景、灯光与节日元素营造圣诞气氛，节日元素作为点缀，不喧宾夺主。\n整体画面呈现温暖、节庆、治愈的圣诞情绪，使用柔和的节日光影与冬季色彩对比，构图自然、真实、具有电影或广告级质感，让画面像真实世界中的一刻圣诞时光。\n欢迎大家评论区交作业\n#ChristmasEve #Gemini #NanoBananaPro' },
      { title: 'universal-christmas-filter-effect', image: 'https://img1.aiart.pics/images/prompts/20251226/universal-christmas-filter-effect-4.jpg', promptText: '太强了！圣诞节万用滤镜！\n用 Nano Banana Pro 让任意图片进入平安夜！\n这个提示词可以说有点逆天，不管是人物、动物、物件、场景等等图片，全部做成圣诞节气氛，让大家完全不用动脑子就能出图\n提示词:\n请以我上传的主体为画面核心，将其自然地融入一个真实可信的圣诞节场景中。\n保持主体的本质身份与核心识别特征，维持上传主体的画风，不刻意改造，不模板化装饰。\n根据主体类型主动构建最合适的圣诞环境、光影与氛围。\n如果主体是人物或动物，请为其搭配符合圣诞氛围且与场景匹配的服饰或装饰，并设计自然、贴合环境的动作、姿态与表情，让其看起来像正在度过圣诞，而不是摆拍。\n如果主体是物品或产品，主体本身保持不变，通过场景、灯光与节日元素营造圣诞气氛，节日元素作为点缀，不喧宾夺主。\n整体画面呈现温暖、节庆、治愈的圣诞情绪，使用柔和的节日光影与冬季色彩对比，构图自然、真实、具有电影或广告级质感，让画面像真实世界中的一刻圣诞时光。\n欢迎大家评论区交作业\n#ChristmasEve #Gemini #NanoBananaPro' },
      { title: 'christmas-themed-selfie', image: 'https://img1.aiart.pics/images/prompts/20251220/christmas-themed-selfie-1.jpg', promptText: '圣诞节快到了，来个圣诞主题，今年来点不一样自拍吧～\n玩法：\n可以文生图，也可以图生图（上传图片即可）\n动作可以自己来微调哈：修改这个字段\n\"panel_details\": [ { \"position\": \"左上\", \"action\": \"眨眼比出和平手势，手持拐杖糖\" }, { \"position\": \"右上\", \"action\": \"向镜头递出一份小包装礼物\" }, { \"position\": \"左下\", \"action\": \"比出手指爱心，同时吃着姜饼饼干\" }, { \"position\": \"正下\", \"action\": \"咯咯笑着，害羞地用手遮嘴，表情俏皮\" }, { \"position\": \"右下\", \"action\": \"回头看向身后，叠加“Merry Christmas”文字\" } ]\n提示词如下：\n{\n\"template_name\": \"Christmas_Gift_Box_Inception_Collage\",\n\"description\": \"A surreal and festive 3D composition where the main subject interacts with a large physical prop (gift box) that contains a photo collage of themselves.\",\n\"visual_concept\": {\n\"style\": \"3D Photo-in-Real-Life / Meta-Photography\",\n\"effect\": \"Optical illusion where the collage appears printed inside a physical object\",\n\"atmosphere\": \"Warm, cozy, festive, playful\"\n}' },
    ],
  },
  {
    slug: 'collection-19',
    title: '时尚·人物肖像·人物',
    description: '121 个 时尚·人物肖像·人物 精选集，涵盖人物、现实、时尚等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251224/dark-orange-studio-photo-1.jpg',
    count: 116,
    prompts: [
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-1.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'fashionable-seated-portrait', image: 'https://img1.aiart.pics/images/prompts/20251213/fashionable-seated-portrait-2.jpg', promptText: 'Nano banana pro\nprompt👇\n时尚的坐姿人物肖像，背景为白色 3D[TikTok]边框剪影，带有标志。深色背景，电影级灯光，超逼真。[TikTok]账号：\'@john\'，带有蓝色勾选标记。文字说明应为“#Nano banana pro！ https://t.co/HbgiX7n4Jz' },
      { title: 'cute-universe-magazine-cover', image: 'https://img1.aiart.pics/images/prompts/20251213/cute-universe-magazine-cover-1.jpg', promptText: '【✨萌萌宇宙系列】提示词：\n当用户上传参考图时：使用参考图中的人物作为海报主角，严格沿用参考图的人物脸型、五官、发型和大致姿态，保证人物身份不变化；服装款式、颜色搭配、妆容、光线、质感以及整体海报风格（如清冷、高饱和、复古、Y2K 等）都尽量参考参考图进行自定义。如果参考图里的人物服装配色不够明显，再适当加入绿色和香蕉黄色的高端时尚服装细节作为点缀。\n画面是一张有光泽的杂志封面照片，白色背景上充满整个画面的巨大粗体衬线文字，黑色字体，占据主要视野。参考图中的人物肖像被置于文字之前，作为画面主体，部分遮挡文字但不完全挡住标题，构图时人物居中或略偏一侧，保持时尚杂志封面感。\n在画面一角放上小号的期号、今天的日期、价格和条形码，这些元素要低调但清晰可读，不再添加其他文字或标语。整体杂志摆放在简洁的白色架子上，靠在白色或浅色墙面上拍摄，光线干净利落，突出参考图人物风格与杂志封面设计的结合。' },
      { title: 'cute-universe-magazine-cover', image: 'https://img1.aiart.pics/images/prompts/20251213/cute-universe-magazine-cover-2.jpg', promptText: '【✨萌萌宇宙系列】提示词：\n当用户上传参考图时：使用参考图中的人物作为海报主角，严格沿用参考图的人物脸型、五官、发型和大致姿态，保证人物身份不变化；服装款式、颜色搭配、妆容、光线、质感以及整体海报风格（如清冷、高饱和、复古、Y2K 等）都尽量参考参考图进行自定义。如果参考图里的人物服装配色不够明显，再适当加入绿色和香蕉黄色的高端时尚服装细节作为点缀。\n画面是一张有光泽的杂志封面照片，白色背景上充满整个画面的巨大粗体衬线文字，黑色字体，占据主要视野。参考图中的人物肖像被置于文字之前，作为画面主体，部分遮挡文字但不完全挡住标题，构图时人物居中或略偏一侧，保持时尚杂志封面感。\n在画面一角放上小号的期号、今天的日期、价格和条形码，这些元素要低调但清晰可读，不再添加其他文字或标语。整体杂志摆放在简洁的白色架子上，靠在白色或浅色墙面上拍摄，光线干净利落，突出参考图人物风格与杂志封面设计的结合。' },
      { title: 'beautiful-lady-pink-cheongsam', image: 'https://img1.aiart.pics/images/prompts/20251216/beautiful-lady-pink-cheongsam-1.jpg', promptText: 'GPT-4o Prompt：一位美丽的女子身穿粉色旗袍，头戴精致的花饰，秀发中点缀着色彩缤纷的花朵，颈间装饰着优雅的白色蕾丝领子。她的一只手轻托着几只大型蝴蝶。整体拍摄风格呈现高清细节质感，类似时尚杂志封面设计，照片上方中央位置标有文字「FASHION DESIGN」。画面背景采用简约的纯浅灰色，以突出人物主体。' },
    ],
  },
  {
    slug: 'collection-20',
    title: '漫画·3D·角色',
    description: '57 个 漫画·3D·角色 精选集，涵盖人物、3D、现实等丰富风格',
    cover: 'https://img1.aiart.pics/images/prompts/20251215/egg-carving-art-inspired-by-teacher-baoju-1.jpg',
    count: 49,
    prompts: [
      { title: 'ai-video-script-creation-guide', image: 'https://img1.aiart.pics/images/prompts/20251227/ai-video-script-creation-guide-1.png', promptText: 'AntiGravity新用法！做AI视频剧本，小白也能一步步出稿（Gemini通用）\n本贴附完整提示词，复制就能用👇\n做AI视频卡在剧本这步？不知道从哪开始？\n这套提示词专治「对着空白文档发呆」——\n你只需要一句话说明想要什么故事，AI会引导你一步步完成：\n• 故事世界观\n• 角色设定\n• 分镜脚本\n• 概念图\n一站式出稿，告别闷头苦想。\n我在原帖大佬的分镜提示词基础上，花了5天调试补充，做成了这套小白友好的完整工作流。\n👇复制下面的提示词，直接和它对话就行：\n⚠️ 有时香蕉🍌会不听话不出图，要求补图或让AI给你生成绘图提示词，去其他工具里跑就行\n完整提示词：\nAI视频剧本创作提示词（完整版）\n你是一位专业的视觉叙事设计师与AI视频编剧。你的任务是引导用户逐步完善故事构想，与用户一起打磨剧本，涵盖世界观、角色、故事结构、场景设定及每个分镜的详细内容。在创作过程中，主动提出问题、给出建议、帮助用户完善细节。\n你具备绘图能力：在完成场景设计、角色形象设计、分镜设计后，需询问用户是否生成图片，用户确认后立即调用 nanobananapro 模型生成对应的九宫格图片。\n---\n第一部分：工作流程\n第一步：确定创作方向\n- 确定作品形式（电影/动画/动漫/漫画/游戏CG/绘本/短视频/广告等）\n- 确定视觉风格（写实/日系动漫/美式卡通/赛博朋克/水彩/像素/3D等）\n- 确定故事类型（剧情/悬疑/爱情/动作/科幻/奇幻/日常/恐怖/喜剧等）\n- 确定画面规格（比例、时长）\n第二步：世界观构建\n- 设定故事发生的时代、地点、社会背景\n- 设计主要场景与环境\n- 规划重要道具与物件\n- 完成场景设计后，询问用户是否生成场景概念图，确认后立即调用 nanobananapro 模型生成\n第三步：角色塑造\n- 与用户讨论所有角色的基础信息与外貌形象\n- 必须设定故事中的全部角色（主角、' },
      { title: 'creative-picture-in-picture-perspective', image: 'https://img1.aiart.pics/images/prompts/20251223/creative-picture-in-picture-perspective-1.jpg', promptText: '今天来玩一个画中画的透视感。\n@YaseenK7212 的创意非常棒，我把提示词改成了模板，大家可以任意替换主题角色，效果特好！\nNano Banana prompt👇\n一只手拿着智能手机，背景是有落叶和绿色长椅的秋季公园。手机屏幕上显示着一张**{主体}的生动照片。手机屏幕内的背景景观与手机后方真实的虚化背景完美对齐，创造出一种透明的错觉。屏幕上画有白色的手写文字注释和箭头，指向{主体}**的特征。柔和的自然光，照片级真实感，4k分辨率，高细节，创意社交媒体摄影风格。3D 弹出效果：上半身从屏幕中浮现，下半身留在用户界面内。{主体}**的图片如图，保留面部和外形特征不做任何改变。' },
      { title: 'creative-picture-in-picture-perspective', image: 'https://img1.aiart.pics/images/prompts/20251223/creative-picture-in-picture-perspective-2.jpg', promptText: '今天来玩一个画中画的透视感。\n@YaseenK7212 的创意非常棒，我把提示词改成了模板，大家可以任意替换主题角色，效果特好！\nNano Banana prompt👇\n一只手拿着智能手机，背景是有落叶和绿色长椅的秋季公园。手机屏幕上显示着一张**{主体}的生动照片。手机屏幕内的背景景观与手机后方真实的虚化背景完美对齐，创造出一种透明的错觉。屏幕上画有白色的手写文字注释和箭头，指向{主体}**的特征。柔和的自然光，照片级真实感，4k分辨率，高细节，创意社交媒体摄影风格。3D 弹出效果：上半身从屏幕中浮现，下半身留在用户界面内。{主体}**的图片如图，保留面部和外形特征不做任何改变。' },
      { title: 'creative-picture-in-picture-perspective', image: 'https://img1.aiart.pics/images/prompts/20251223/creative-picture-in-picture-perspective-3.jpg', promptText: '今天来玩一个画中画的透视感。\n@YaseenK7212 的创意非常棒，我把提示词改成了模板，大家可以任意替换主题角色，效果特好！\nNano Banana prompt👇\n一只手拿着智能手机，背景是有落叶和绿色长椅的秋季公园。手机屏幕上显示着一张**{主体}的生动照片。手机屏幕内的背景景观与手机后方真实的虚化背景完美对齐，创造出一种透明的错觉。屏幕上画有白色的手写文字注释和箭头，指向{主体}**的特征。柔和的自然光，照片级真实感，4k分辨率，高细节，创意社交媒体摄影风格。3D 弹出效果：上半身从屏幕中浮现，下半身留在用户界面内。{主体}**的图片如图，保留面部和外形特征不做任何改变。' },
      { title: 'creative-picture-in-picture-perspective', image: 'https://img1.aiart.pics/images/prompts/20251223/creative-picture-in-picture-perspective-4.jpg', promptText: '今天来玩一个画中画的透视感。\n@YaseenK7212 的创意非常棒，我把提示词改成了模板，大家可以任意替换主题角色，效果特好！\nNano Banana prompt👇\n一只手拿着智能手机，背景是有落叶和绿色长椅的秋季公园。手机屏幕上显示着一张**{主体}的生动照片。手机屏幕内的背景景观与手机后方真实的虚化背景完美对齐，创造出一种透明的错觉。屏幕上画有白色的手写文字注释和箭头，指向{主体}**的特征。柔和的自然光，照片级真实感，4k分辨率，高细节，创意社交媒体摄影风格。3D 弹出效果：上半身从屏幕中浮现，下半身留在用户界面内。{主体}**的图片如图，保留面部和外形特征不做任何改变。' },
    ],
  }
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
