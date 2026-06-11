import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, locales, siteUrl, type Locale } from '@/content';
import { getAllArticles, getArticle, formatDate } from '@/lib/articles';

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  // Called once per locale from the parent segment
  const locale = (params?.locale ?? 'en') as Locale;
  return getAllArticles(locale).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const article = getArticle(slug, dict.locale as Locale);
  if (!article) return {};

  const url = `${siteUrl}/${dict.locale}/articles/${slug}/`;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l === 'pt' ? 'pt-BR' : l] = `${siteUrl}/${l}/articles/${slug}/`;
  }

  return {
    title: `${article.title} — Philip Scheer`,
    description: article.description,
    alternates: { canonical: url, languages },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: 'Philip Scheer',
      type: 'article',
      publishedTime: article.date,
      locale: dict.locale === 'pt' ? 'pt_BR' : 'en_US',
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const t = dict.articles;
  const article = getArticle(slug, dict.locale as Locale);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-20">
      <Link
        href={`/${dict.locale}/articles/`}
        className="text-sm text-slate-500 transition-colors hover:text-accent"
      >
        {t.backToArticles}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>
            {t.publishedLabel} {formatDate(article.date, dict.locale as Locale)}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {article.readingMinutes} {t.minuteRead}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">{article.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="prose prose-invert prose-slate mt-10 max-w-none prose-headings:tracking-tight prose-a:text-accent prose-strong:text-white prose-code:text-accent-soft prose-pre:bg-ink-900 prose-pre:border prose-pre:border-white/5"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />

      <footer className="mt-14 border-t border-white/5 pt-8">
        <Link
          href={`/${dict.locale}/contact/`}
          className="inline-block rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft"
        >
          {dict.home.recruiterCta.button}
        </Link>
      </footer>
    </article>
  );
}
