import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, locales, siteUrl, type Locale } from '@/content';
import { getAllArticles, getArticle, formatDate } from '@/lib/articles';
import ArticleBody from '@/components/ArticleBody';
import NewsletterSignup from '@/components/NewsletterSignup';
import { ogImage } from '@/lib/seo';

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
  languages['x-default'] = `${siteUrl}/en/articles/${slug}/`;

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
      tags: article.tags,
      locale: dict.locale === 'pt' ? 'pt_BR' : 'en_US',
      images: [ogImage(dict.locale)],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [ogImage(dict.locale).url],
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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: dict.locale === 'pt' ? 'pt-BR' : 'en',
    keywords: article.tags.join(', '),
    url: `${siteUrl}/${dict.locale}/articles/${slug}/`,
    mainEntityOfPage: `${siteUrl}/${dict.locale}/articles/${slug}/`,
    author: { '@type': 'Person', name: 'Philip Scheer', url: siteUrl },
    publisher: { '@type': 'Person', name: 'Philip Scheer', url: siteUrl },
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Link
        href={`/${dict.locale}/articles/`}
        className="text-sm text-faint transition-colors hover:text-primary"
      >
        {t.backToArticles}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint">
          <span>
            {t.publishedLabel} {formatDate(article.date, dict.locale as Locale)}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {article.readingMinutes} {t.minuteRead}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-fg md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{article.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line/10 bg-line/5 px-2.5 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <ArticleBody html={article.html} />

      <footer className="mt-14 border-t border-line/5 pt-8">
        <div className="mb-8">
          <NewsletterSignup dict={dict} place="article" />
        </div>
        <Link
          href={`/${dict.locale}/contact/`}
          className="inline-block rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          {dict.home.recruiterCta.button}
        </Link>
      </footer>
    </article>
  );
}
