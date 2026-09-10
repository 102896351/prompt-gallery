import type { APIRoute } from 'astro';
import { prompts } from '../data/prompts';

// 全站搜索索引：与 HTML 解耦，避免像旧版首页那样把 1,228 条数据
// 全部内联进 DOM（首页曾因此达到 2MB）。构建时生成静态 JSON。
export const GET: APIRoute = () => {
  const data = prompts.map((p) => ({
    slug: p.slug,
    title: p.titleEn || p.title,
    tags: p.tags.join(' '),
    img: p.images[0]?.src || '',
  }));

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
