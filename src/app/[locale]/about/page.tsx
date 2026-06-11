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
  return buildMetadata(locale, 'about');
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const a = dict.about;

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{a.title}</h1>
      <p className="mt-3 text-lg text-slate-400">{a.intro}</p>

      <div className="mt-10 max-w-3xl space-y-5">
        {a.story.map((paragraph, i) => (
          <Reveal key={i}>
            <p className="text-base leading-relaxed text-slate-300">{paragraph}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <div className="max-w-3xl rounded-xl border-l-2 border-accent bg-ink-900/50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {a.positioningTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-200">{a.positioning}</p>
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {a.leadershipStyleTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300">
          {a.leadershipStyle}
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {a.valuesTitle}
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {a.values.map((v) => (
            <article
              key={v.title}
              className="rounded-xl border border-white/5 bg-ink-900/50 p-6 transition-colors hover:border-accent/30"
            >
              <h3 className="text-base font-semibold text-white">{v.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{v.body}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {a.visionTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300">{a.vision}</p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {a.languagesTitle}
        </h2>
        <p className="mt-3 text-base text-slate-300">{a.languages}</p>
      </Reveal>
    </div>
  );
}
