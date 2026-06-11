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
  return buildMetadata(locale, 'playbook');
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const p = dict.playbook;

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{p.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-400">{p.intro}</p>

      <Reveal className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {p.templatesTitle}
        </h2>
      </Reveal>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {p.templates.map((t) => (
          <Reveal key={t.name}>
            <article className="flex h-full flex-col rounded-xl border border-white/5 bg-ink-900/50 p-6 transition-colors hover:border-accent/30">
              <h3 className="font-mono text-base font-semibold text-white">{t.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{t.description}</p>
              <a
                href={t.file}
                download
                className="mt-5 inline-block rounded-lg border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
              >
                {p.downloadLabel}
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {p.checklistsTitle}
        </h2>
      </Reveal>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {p.checklists.map((c) => (
          <Reveal key={c.title}>
            <article className="h-full rounded-xl border border-white/5 bg-ink-900/50 p-6">
              <h3 className="text-base font-semibold text-white">{c.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-400">
                    <span className="mt-0.5 text-accent-emerald" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
