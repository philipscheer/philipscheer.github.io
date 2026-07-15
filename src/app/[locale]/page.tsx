import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { getDictionary, social } from '@/content';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, 'home');
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const { home } = dict;

  return (
    <>
      {/* Layer 1 — recruiter-focused hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(20,184,166,0.12),transparent)]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-content px-5 pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            {home.availability}
          </p>

          <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-fg md:text-6xl">
            {home.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            {home.subheadline}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-faint">{home.pitch}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-faint">
              {home.targetRolesLabel}:
            </span>
            {home.targetRoles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-line/10 bg-line/5 px-3 py-1 text-xs text-muted"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${dict.locale}/resume/`}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
            >
              {home.ctas.resume}
            </Link>
            <Link
              href={`/${dict.locale}/contact/`}
              className="rounded-lg border border-line/15 px-5 py-3 text-sm font-semibold text-fg transition hover:border-primary hover:text-primary"
            >
              {home.ctas.contact}
            </Link>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line/15 px-5 py-3 text-sm font-semibold text-fg transition hover:border-primary hover:text-primary"
            >
              {home.ctas.linkedin}
            </a>
            <Link
              href={`/${dict.locale}/projects/`}
              className="rounded-lg px-5 py-3 text-sm font-semibold text-muted transition hover:text-fg"
            >
              {home.ctas.cases} →
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-y border-line/5 bg-surface/60">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-px px-5 py-10 md:grid-cols-4 md:py-12">
          {home.metrics.map((m) => (
            <Reveal key={m.value} className="px-4 py-3 text-center md:text-left">
              <p className="text-3xl font-extrabold text-fg md:text-4xl">{m.value}</p>
              <p className="mt-2 text-sm leading-snug text-faint">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Layer 2 — technical authority */}
      <section className="mx-auto max-w-content px-5 py-20 md:py-24">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
            {home.technical.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {home.technical.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {home.technical.areas.map((area) => (
            <Reveal key={area.title}>
              <article className="h-full rounded-xl border border-line/5 bg-surface/50 p-6 transition-colors hover:border-primary/30">
                <h3 className="text-base font-semibold text-fg">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{area.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recruiter CTA */}
      <section className="border-t border-line/5 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(20,184,166,0.08),transparent)]">
        <div className="mx-auto max-w-content px-5 py-20 text-center md:py-24">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
              {home.recruiterCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
              {home.recruiterCta.body}
            </p>
            <Link
              href={`/${dict.locale}/contact/`}
              className="mt-8 inline-block rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
            >
              {home.recruiterCta.button}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
