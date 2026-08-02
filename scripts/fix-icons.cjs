// 修复：从 entry 内的 url 字段匹配，替换该 entry 的 icon: undefined
const fs = require('fs');
let ts = fs.readFileSync('C:/Users/dell/prompt-gallery/src/data/tools.ts', 'utf8');

const manual = {
  'github.com/comfyanonymous/ComfyUI': '/tool-icons/comfyui.png',
  'klingai.com': '/tool-icons/kling-ai.ico',
  'canva.com': '/tool-icons/canva-ai.png',
  'www.bing.com/images/create': '/tool-icons/bing-image-creator.png',
  'lumi.bytedance.com': '/tool-icons/lumi.png',
  'www.pixelscake.com': '/tool-icons/pixcakeai.png',
  'www.minimaxi.com': '/tool-icons/minimax.ico',
  'kimi.moonshot.cn': '/tool-icons/kimi.ico',
  'codeium.com/windsurf': '/tool-icons/windsurf.png',
  'www.liblib.art': '/tool-icons/liblibai.ico',
  'runninghub.cn': '/tool-icons/runninghub.ico',
};

// 直接做字符串替换：把每个 url 关键字附近的 "icon: undefined," 替换
for (const [urlKey, iconPath] of Object.entries(manual)) {
  // 找 url: 'https://<urlKey>'
  const urlPattern = "url: 'https://" + urlKey;
  const idx = ts.indexOf(urlPattern);
  if (idx < 0) {
    console.log('NOT FOUND url: ' + urlKey);
    continue;
  }
  // 找这个 url 之后的第一个 'icon: undefined,'
  const afterUrl = ts.slice(idx);
  const iconIdx = afterUrl.indexOf('icon: undefined,');
  if (iconIdx < 0) {
    console.log('NO undefined icon after: ' + urlKey);
    continue;
  }
  const absoluteIdx = idx + iconIdx;
  // 替换为 icon: '<iconPath>',
  ts = ts.slice(0, absoluteIdx) + "icon: '" + iconPath + "'," + ts.slice(absoluteIdx + 'icon: undefined,'.length);
  console.log('fixed: ' + urlKey + ' -> ' + iconPath);
}

fs.writeFileSync('C:/Users/dell/prompt-gallery/src/data/tools.ts', ts);
const withIcon = (ts.match(/icon: '[^']+'/g) || []).length;
const total = (ts.match(/^\s*name:/gm) || []).length;
console.log('---');
console.log('with icon now: ' + withIcon + '/' + total);