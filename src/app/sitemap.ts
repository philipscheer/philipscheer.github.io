import type { MetadataRoute } from 'next';
import { locales, siteUrl } from '@/content';
import { getAllArticles } from '@/lib/articles';
import { pagePaths } from '@/lib/seo';

export const dynamic = 'force-static';

const hreflang = (l: string) => (l === 'pt' ? 'pt-BR' : l);

function entry(path: string, lastModified?: string): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[hreflang(l)] = `${siteUrl}/${l}${path}/`;
  languages['x-default'] = `${siteUrl}/en${path}/`;
  return locales.map((l) => ({
    url: `${siteUrl}/${l}${path}/`,
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  }));
}

/** Generated at build time: every page and every article in both locales. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.values(pagePaths).flatMap((p) => entry(p));
  const slugs = new Map<string, string>();
  for (const l of locales) for (const a of getAllArticles(l)) slugs.set(a.slug, a.date);
  const articles = [...slugs.entries()]
    .sort(([, a], [, b]) => (a < b ? 1 : -1))
    .flatMap(([slug, date]) => entry(`/articles/${slug}`, date));
  return [...pages, ...articles];
}
