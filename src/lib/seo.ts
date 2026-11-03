import type { Metadata } from 'next';
import { getDictionary, locales, siteUrl } from '@/content';

export type PageKey =
  | 'home'
  | 'recruiters'
  | 'experience'
  | 'projects'
  | 'resume'
  | 'contact'
  | 'about'
  | 'leadership'
  | 'articles'
  | 'playbook'
  | 'play'
  | 'speaking';

export const pagePaths: Record<PageKey, string> = {
  home: '',
  recruiters: '/recruiters',
  experience: '/experience',
  projects: '/projects',
  resume: '/resume',
  contact: '/contact',
  about: '/about',
  leadership: '/leadership',
  articles: '/articles',
  playbook: '/playbook',
  play: '/play',
  speaking: '/speaking',
};

export function ogImage(locale: string) {
  return {
    url: `${siteUrl}/og/${locale === 'pt' ? 'pt' : 'en'}.png`,
    width: 1200,
    height: 630,
    alt: 'Philip Scheer — Engineering & Technology Manager',
  };
}

export function buildMetadata(locale: string, page: PageKey): Metadata {
  const dict = getDictionary(locale);
  const meta = dict.meta[page];
  const path = pagePaths[page];
  const url = `${siteUrl}/${dict.locale}${path}/`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l === 'pt' ? 'pt-BR' : l] = `${siteUrl}/${l}${path}/`;
  }
  languages['x-default'] = `${siteUrl}/en${path}/`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: 'Philip Scheer',
      type: 'website',
      locale: dict.locale === 'pt' ? 'pt_BR' : 'en_US',
      images: [ogImage(dict.locale)],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage(dict.locale).url],
    },
  };
}
