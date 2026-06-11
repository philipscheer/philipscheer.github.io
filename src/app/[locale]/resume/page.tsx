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
  return buildMetadata(locale, 'resume');
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const r = dict.resume;

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{r.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-400">{r.intro}</p>

      <div className="mt-9 flex flex-wrap gap-3">
        <a
          href="/resume/philip-scheer-cv-en.pdf"
          download
          className="rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft"
        >
          {r.downloadEn}
        </a>
        <a
          href="/resume/philip-scheer-cv-pt.pdf"
          download
          className="rounded-lg border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
        >
          {r.downloadPt}
        </a>
      </div>

      <Reveal className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {r.highlightsTitle}
        </h2>
        <ul className="mt-5 max-w-2xl space-y-3">
          {r.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm leading-relaxed text-slate-300">
              <span className="text-accent" aria-hidden="true">▸</span>
              {h}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
