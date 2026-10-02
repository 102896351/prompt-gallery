// ============================================================
//  Content Collections — 博客 / 指南（双语）
//  - blog:     英文指南，源文件位于 src/content/blog/*.md
//  - blogZh:   中文指南，源文件位于 src/content/blogZh/*.md
//  路由镜像与全站一致：/blog/<slug>/ (EN) 与 /zh/blog/<slug>/ (ZH)
// ============================================================

import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  topic: z.string(),
  cover: z.string().optional(),
  readingTime: z.string().optional(),
  draft: z.boolean().default(false),
});

export const collections = {
  blog: defineCollection({ type: 'content', schema: blogSchema }),
  blogZh: defineCollection({ type: 'content', schema: blogSchema }),
};
