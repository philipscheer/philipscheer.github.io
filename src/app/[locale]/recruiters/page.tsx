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
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">{r.title}</h1>
      <p className="mt-3 text-lg text-muted">{r.intro}</p>

      <Reveal className="mt-10">
        <p className="max-w-3xl rounded-xl border border-line/5 bg-surface/50 p-6 text-base leading-relaxed text-muted">
          {r.summary}
        </p>
      </Reveal>

      <div className="stagger mt-10 grid gap-8 md:grid-cols-2">
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">{r.rolesTitle}</h2>
          <ul className="mt-4 space-y-2.5">
            {r.roles.map((role) => (
              <li key={role} className="flex gap-3 text-sm text-muted">
                <span className="text-primary" aria-hidden="true">▸</span>
                {role}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">
            {r.workModelTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{r.workModel}</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">
            {r.leadershipTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{r.leadership}</p>
        </Reveal>

        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            {r.competenciesTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {r.competencies.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted">
                <span className="text-primary" aria-hidden="true">▸</span>
                {c}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">
            {r.resultsTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {r.results.map((res) => (
              <li key={res} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="text-ok" aria-hidden="true">✓</span>
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
          className="rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          {r.downloadCta}
        </a>
        <Link
          href={`/${dict.locale}/contact/`}
          className="rounded-lg border border-line/15 px-6 py-3.5 text-sm font-semibold text-fg transition hover:border-primary hover:text-primary"
        >
          {r.contactCta}
        </Link>
      </div>
    </div>
  );
}
