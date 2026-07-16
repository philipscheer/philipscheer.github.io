import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { getDictionary } from '@/content';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, 'leadership');
}

export default async function LeadershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const l = dict.leadership;

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">{l.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{l.intro}</p>

      <div className="stagger mt-12 grid gap-6 md:grid-cols-2">
        {l.sections.map((s, i) => (
          <Reveal key={s.title}>
            <article className="h-full rounded-xl border border-line/5 bg-surface/50 p-7 lift transition-colors hover:border-primary/30">
              <p className="text-xs font-semibold text-primary">{String(i + 1).padStart(2, '0')}</p>
              <h2 className="mt-2 text-lg font-semibold text-fg">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <p className="max-w-3xl text-base leading-relaxed text-muted">{l.closing}</p>
        <Link
          href={`/${dict.locale}/projects/`}
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          {dict.home.ctas.cases} →
        </Link>
      </Reveal>
    </div>
  );
}
