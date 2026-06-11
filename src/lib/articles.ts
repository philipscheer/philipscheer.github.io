import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Locale } from '@/content';

export interface ArticleMeta {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes: number;
}

export interface Article extends ArticleMeta {
  html: string;
}

const ARTICLES_DIR = path.join(process.cwd(), 'src', 'content', 'articles');

function parseFile(fileName: string): { slug: string; locale: Locale } | null {
  // Pattern: {slug}.{locale}.md
  const match = fileName.match(/^(.*)\.(en|pt)\.md$/);
  if (!match) return null;
  return { slug: match[1], locale: match[2] as Locale };
}

function readArticleFile(slug: string, locale: Locale) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.${locale}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const meta: ArticleMeta = {
    slug,
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
  return { meta, content };
}

export function getAllArticles(locale: Locale): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const slugs = new Set<string>();
  for (const f of fs.readdirSync(ARTICLES_DIR)) {
    const parsed = parseFile(f);
    if (parsed && parsed.locale === locale) slugs.add(parsed.slug);
  }
  const articles: ArticleMeta[] = [];
  for (const slug of slugs) {
    const file = readArticleFile(slug, locale);
    if (file) articles.push(file.meta);
  }
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string, locale: Locale): Article | null {
  const file = readArticleFile(slug, locale);
  if (!file) return null;
  const html = marked.parse(file.content, { async: false }) as string;
  return { ...file.meta, html };
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
