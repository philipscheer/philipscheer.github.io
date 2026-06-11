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
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{l.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-400">{l.intro}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {l.sections.map((s, i) => (
          <Reveal key={s.title}>
            <article className="h-full rounded-xl border border-white/5 bg-ink-900/50 p-7 transition-colors hover:border-accent/30">
              <p className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, '0')}</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <p className="max-w-3xl text-base leading-relaxed text-slate-300">{l.closing}</p>
        <Link
          href={`/${dict.locale}/projects/`}
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft"
        >
          {dict.home.ctas.cases} →
        </Link>
      </Reveal>
    </div>
  );
}
