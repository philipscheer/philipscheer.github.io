import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getDictionary, type Locale } from '@/content';
import { getAllArticles, formatDate, type ArticleMeta } from '@/lib/articles';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, 'articles');
}

const RADAR_VISIBLE = 8;

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.articles;
  const l = dict.locale as Locale;
  const articles = getAllArticles(l);
  const essays = articles
    .filter((a) => a.series === null)
    .sort((a, b) => Number(b.featured) - Number(a.featured));
  const radar = articles.filter((a) => a.series === 'tech-radar');

  const radarRow = (a: ArticleMeta) => (
    <li key={a.slug}>
      <Link
        href={`/${l}/articles/${a.slug}/`}
        className="group flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6"
      >
        <time dateTime={a.date} className="w-44 shrink-0 text-xs text-faint">
          {formatDate(a.date, l)}
        </time>
        <span className="text-sm font-medium text-fg transition-colors group-hover:text-primary">
          {a.title.replace(/^Tech Radar\s*—\s*/, '')}
        </span>
      </Link>
    </li>
  );

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{t.intro}</p>

      {articles.length === 0 ? (
        <p className="mt-12 text-faint">{t.empty}</p>
      ) : (
        <>
          <div className="mt-10 max-w-3xl">
            <NewsletterSignup dict={dict} place="articles" />
          </div>

          {essays.length > 0 && (
            <section className="mt-16" aria-labelledby="essays-title">
              <h2 id="essays-title" className="text-2xl font-bold tracking-tight text-fg">
                {t.essaysTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">{t.essaysIntro}</p>
              <div className="mt-8 space-y-6">
                {essays.map((a) => (
                  <Reveal key={a.slug}>
                    <Link
                      href={`/${l}/articles/${a.slug}/`}
                      className="block rounded-xl border border-line/5 bg-surface/50 p-7 lift transition-colors hover:border-primary/30"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint">
                        {a.featured && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
                            ★ {t.essentialLabel}
                          </span>
                        )}
                        <span>
                          {t.publishedLabel} {formatDate(a.date, l)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {a.readingMinutes} {t.minuteRead}
                        </span>
                      </div>
                      <h3 className="mt-2.5 text-xl font-semibold text-fg">{a.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{a.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {a.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-line/10 bg-line/5 px-2.5 py-0.5 text-xs text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="ml-auto text-sm font-medium text-primary">{t.readArticle} →</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {radar.length > 0 && (
            <section className="mt-16" aria-labelledby="radar-title">
              <h2 id="radar-title" className="text-2xl font-bold tracking-tight text-fg">
                {t.radarTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">{t.radarIntro}</p>
              <ul className="mt-6 divide-y divide-line/5 border-y border-line/5">
                {radar.slice(0, RADAR_VISIBLE).map(radarRow)}
              </ul>
              {radar.length > RADAR_VISIBLE && (
                <details className="mt-2">
                  <summary className="cursor-pointer py-3 text-sm font-medium text-primary">
                    {t.showAllEditions.replace('{count}', String(radar.length))}
                  </summary>
                  <ul className="divide-y divide-line/5 border-b border-line/5">
                    {radar.slice(RADAR_VISIBLE).map(radarRow)}
                  </ul>
                </details>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
