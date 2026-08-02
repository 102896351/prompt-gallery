import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages 部署配置
// ⚠️ 绑定自定义域名后，域名走根路径，base 必须是 '/'
//    （此时原始地址 <user>.github.io/<repo> 会样式错乱，属正常，用域名访问即可）
export default defineConfig({
  site: 'https://prompt-gallery.example.com', // TODO: 上线时改为真实域名
  base: '/',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // 中英双语：让 sitemap 为每个 URL 输出 hreflang alternate 标签
      // locales 的 key = URL 路径前缀（用于匹配），value = 输出的 hreflang lang 值（BCP-47）
      // 英文走根路径（无前缀，由 defaultLocale 兜底），中文走 /zh/ 前缀
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-Hans',
        },
      },
      // 把所有静态页面（首页、4 个信息页、所有 prompt 详情页的中英版本）都加入 sitemap
      changefreq: 'weekly',
      lastmod: new Date(),
      // 排除 404 页面（如果有的话）
      filter: (page) => !page.includes('/404'),
      // 按 URL 类型分级 priority
      serialize(item) {
        const url = item.url;
        // 首页最高
        if (url.endsWith('/') && !url.includes('/prompt/') && !url.includes('/collections/') && !url.includes('/tools/') && !url.includes('/about/') && !url.includes('/contact/') && !url.includes('/disclaimer/') && !url.includes('/privacy/')) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // prompt 详情页
        else if (url.includes('/prompt/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // 列表页（collections / tools）
        else if (url.includes('/collections') || url.includes('/tools')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }
        // 信息页
        else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
});