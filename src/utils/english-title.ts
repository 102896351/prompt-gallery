const WORD_OVERRIDES: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  cgi: 'CGI',
  gpt: 'GPT',
  id: 'ID',
  ios: 'iOS',
  lego: 'LEGO',
  loki: 'Loki',
  pro: 'Pro',
  seo: 'SEO',
  sns: 'SNS',
  x: 'X',
  y2k: 'Y2K',
};

export function hasCJK(value: string | undefined | null): boolean {
  return /[\u3400-\u9fff]/.test(value || '');
}

export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (WORD_OVERRIDES[lower]) return WORD_OVERRIDES[lower];
      if (/^\d+k$/i.test(part)) return part.toUpperCase();
      if (/^\d+d$/i.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ') || 'AI Image Prompt';
}

export function safeEnglishTitle(titleEn: string | undefined, title: string, slug: string): string {
  if (titleEn && !hasCJK(titleEn)) return titleEn;
  if (title && !hasCJK(title)) return title;
  return titleFromSlug(slug);
}
