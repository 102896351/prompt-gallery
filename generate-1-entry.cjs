// Generate 1 prompt entry for "骑粉色飞猪" from Xiaohongshu
const fs = require('fs');

const slug = 'ride-giant-pink-flying-pig-fairy-tale-portrait';

const title = '骑粉色飞猪奇幻人像写真';
const titleEn = 'Riding a Giant Pink Flying Pig - Fairy Tale Portrait';
const tagline = '竖版超写实电影风格奇幻照片，主角骑粉色飞猪飞越古朴村庄。One-click copy, AI Image prompt.';
const taglineEn = 'Vertical cinematic fantasy photo: protagonist rides a giant pink flying pig over ancient village rooftops.';
const category = 'concept-art'; // 奇幻主题
const engines = ['nano-banana-pro']; // 默认 Nano Banana Pro
const difficulty = 3;

// 完整 prompt 文本（来自小红书）
const promptText = '请仅使用上传的肖像照片作为主角的面部特征和发型参考。请保留上传肖像照片中可辨识的脸型、眼睛、鼻子、嘴唇、肤色和发型。请勿直接复制参考照片中的面部。\n\n请创作一张竖版超写实电影风格奇幻照片，照片中主角骑着一头巨大的粉色飞猪，飞越古朴的村庄屋顶。主角坐在猪背上，双手握着简单的绳索缰绳，面带平静而略带俏皮的表情，温柔地看向镜头。\n\n飞猪应体型较大，柔软可爱，栩栩如生，拥有淡粉色的皮肤、自然的猪耳朵、猪鼻子、小巧的蹄子以及逼真的身体纹理。飞猪在古老的瓦片屋顶上空翱翔，背景是湛蓝的天空和朵朵白云。\n\n主角身穿舒适的粉色绗缝套装，饰以柔软的白色绒毛滚边，搭配同色系长裤和深色短靴。整体造型应可爱、温暖，充满童话般的梦幻感。构图应采用俯视低角度，使猪看起来体型庞大，仿佛漂浮在空中。添加自然光、柔和的阴影、逼真的皮肤纹理、细腻的织物质感、轻微的动感、电影般的景深，以及奇幻的魔幻现实主义氛围。\n\n照片级写实，高分辨率，自然光，真实的解剖结构，简洁的构图，高端奇幻主题摄影，无文字、无标志、无水印。';

const negativePrompt = '水印、标志、签名、文字、字幕、海报文字、低质量、模糊的脸、扭曲的脸、不同的人、复制的参考图、塑料皮肤、伪AI皮肤、变形的手、多余的手指、缺失的手指、不自然的胳膊、糟糕的解剖结构、重复的人、重复的脸、诡异的表情、扭曲的猪身、不真实的猪的解剖结构、多余的腿、断裂的蹄子、丑陋的鼻子、杂乱的构图、曝光过度、曝光不足、严重模糊、卡通风格、动漫风格、绘画风格、3D渲染效果、娃娃脸、恐怖谷效应、噪点、瑕疵。';

// images 数组（暂时用 img1.aiart.pics 占位图，但提示要补真实图）
const images = [
  {
    src: 'https://img1.aiart.pics/images/prompts/xhs-flying-pig-1.jpg',
    alt: title,
    width: 500,
    isThumb: false,
  },
];

const source = {
  platform: 'Xiaohongshu',
  sourceUrl: 'https://www.xiaohongshu.com/explore/6a019ca30000000008001eac?xsec_token=ABKL6kq3_plAYx2lJmZR1B1x5clY2tRSPhF4F3u2n2pvk=&xsec_source=pc_search&source=web_explore_feed',
  statusId: null,
  authorName: '红猫杂货店',
};

const entry = `  {
    slug: "${slug}",
    title: "${title}",
    titleEn: "${titleEn}",
    tagline: "${tagline}",
    taglineEn: "${taglineEn}",
    category: "${category}",
    engines: [${engines.map(e => `"${e}"`).join(',')}],
    difficulty: ${difficulty},
    prompt: ${JSON.stringify(promptText)},
    negativePrompt: ${JSON.stringify(negativePrompt)},
    rawBlock: ${JSON.stringify(promptText)},
    images: [${images.map(i => `{"src":"${i.src}","alt":"${i.alt.replace(/"/g, '\\"')}","width":${i.width},"isThumb":${i.isThumb ? 'true' : 'false'}}`).join(',')}],
    source: {"platform":"${source.platform}","sourceUrl":"${source.sourceUrl}","statusId":${source.statusId ? `"${source.statusId}"` : 'null'},"authorName":"${source.authorName}"},
    dateAdded: "2026-08-06",
    tags: ["fresh","community","xiaohongshu"],
    verdict: "Community submission from Xiaohongshu. Creative fairy-tale portrait with pink flying pig.",
    reusable: false,
    language: "zh",
    structuredData: null,
  }`;

console.log('Entry generated:');
console.log(entry);
console.log('');
console.log('Images (placeholder, will need real URL):');
console.log(JSON.stringify(images, null, 2));