import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { getDictionary, type Locale } from '@/content';
import { getAllArticles, formatDate } from '@/lib/articles';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, 'articles');
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.articles;
  const articles = getAllArticles(dict.locale as Locale);

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-400">{t.intro}</p>

      {articles.length === 0 ? (
        <p className="mt-12 text-slate-500">{t.empty}</p>
      ) : (
        <div className="mt-12 space-y-6">
          {articles.map((a) => (
            <Reveal key={a.slug}>
              <Link
                href={`/${dict.locale}/articles/${a.slug}/`}
                className="block rounded-xl border border-white/5 bg-ink-900/50 p-7 transition-colors hover:border-accent/30"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>
                    {t.publishedLabel} {formatDate(a.date, dict.locale as Locale)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {a.readingMinutes} {t.minuteRead}
                  </span>
                </div>
                <h2 className="mt-2.5 text-xl font-semibold text-white">{a.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{a.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-sm font-medium text-accent">
                    {t.readArticle} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
