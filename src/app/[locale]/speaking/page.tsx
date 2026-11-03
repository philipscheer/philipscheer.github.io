import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { getDictionary } from '@/content';
import { buildMetadata } from '@/lib/seo';
import { trackEvent } from '@/lib/integrations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, 'speaking');
}

export default async function SpeakingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const s = dict.speaking;

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">{s.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{s.intro}</p>

      <section className="mt-14" aria-labelledby="topics-title">
        <h2 id="topics-title" className="text-sm font-semibold uppercase tracking-wider text-primary">
          {s.topicsTitle}
        </h2>
        <div className="stagger mt-6 grid gap-6 md:grid-cols-3">
          {s.topics.map((t) => (
            <Reveal key={t.title}>
              <article className="flex h-full flex-col rounded-xl border border-line/5 bg-surface/50 p-6">
                <h3 className="text-base font-semibold text-fg">{t.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t.body}</p>
                {t.link && (
                  <Link
                    href={`/${dict.locale}/articles/${t.link}/`}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    {s.readRelated} →
                  </Link>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="bios-title">
          <h2 id="bios-title" className="text-sm font-semibold uppercase tracking-wider text-primary">
            {s.biosTitle}
          </h2>
          <div className="mt-6 space-y-5">
            {s.bios.map((b) => (
              <div key={b.label} className="rounded-xl border border-line/5 bg-surface/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-faint">{b.label}</p>
                <p className="mt-3 select-all text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-10">
          <section aria-labelledby="facts-title">
            <h2 id="facts-title" className="text-sm font-semibold uppercase tracking-wider text-primary">
              {s.factsTitle}
            </h2>
            <dl className="mt-6 divide-y divide-line/5 rounded-xl border border-line/5 bg-surface/50">
              {s.facts.map((f) => (
                <div key={f.label} className="px-5 py-3.5">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-faint">{f.label}</dt>
                  <dd className="mt-1 text-sm text-muted">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="formats-title">
            <h2 id="formats-title" className="text-sm font-semibold uppercase tracking-wider text-primary">
              {s.formatsTitle}
            </h2>
            <ul className="mt-6 space-y-2.5">
              {s.formats.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-muted">
                  <span className="text-primary" aria-hidden="true">▸</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <Link
            href={`/${dict.locale}/contact/?topic=other#form`}
            {...trackEvent('speaking-invite-click')}
            className="inline-block rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            {s.cta}
          </Link>
        </aside>
      </div>
    </div>
  );
}
