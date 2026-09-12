import type { APIRoute } from 'astro';
import { prompts } from '../../data/prompts';

// 中文站全站搜索索引：与 /zh/ai-image-prompts/ 等中文聚合页配套使用。
// 输出全部 prompt（按 slug 去重），标题用中文原文，便于中文用户检索。
export const GET: APIRoute = () => {
  const seen = new Set<string>();
  const data = prompts
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      titleEn: p.titleEn || '',
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
