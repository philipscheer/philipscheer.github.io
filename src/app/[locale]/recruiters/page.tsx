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
  return buildMetadata(locale, 'recruiters');
}

export default async function RecruitersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const r = dict.recruiters;
  const resumeFile = dict.locale === 'pt' ? '/resume/philip-scheer-cv-pt.pdf' : '/resume/philip-scheer-cv-en.pdf';

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{r.title}</h1>
      <p className="mt-3 text-lg text-slate-400">{r.intro}</p>

      <Reveal className="mt-10">
        <p className="max-w-3xl rounded-xl border border-white/5 bg-ink-900/50 p-6 text-base leading-relaxed text-slate-300">
          {r.summary}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">{r.rolesTitle}</h2>
          <ul className="mt-4 space-y-2.5">
            {r.roles.map((role) => (
              <li key={role} className="flex gap-3 text-sm text-slate-300">
                <span className="text-accent" aria-hidden="true">▸</span>
                {role}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-accent">
            {r.workModelTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{r.workModel}</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-accent">
            {r.leadershipTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{r.leadership}</p>
        </Reveal>

        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {r.competenciesTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {r.competencies.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-slate-300">
                <span className="text-accent" aria-hidden="true">▸</span>
                {c}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-accent">
            {r.resultsTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {r.results.map((res) => (
              <li key={res} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                <span className="text-accent-emerald" aria-hidden="true">✓</span>
                {res}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-14 flex flex-wrap gap-3">
        <a
          href={resumeFile}
          download
          className="rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft"
        >
          {r.downloadCta}
        </a>
        <Link
          href={`/${dict.locale}/contact/`}
          className="rounded-lg border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
        >
          {r.contactCta}
        </Link>
      </div>
    </div>
  );
}
