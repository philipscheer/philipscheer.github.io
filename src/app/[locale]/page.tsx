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
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(56,189,248,0.12),transparent)]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-content px-5 pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-emerald" />
            </span>
            {home.availability}
          </p>

          <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            {home.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            {home.subheadline}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500">{home.pitch}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {home.targetRolesLabel}:
            </span>
            {home.targetRoles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${dict.locale}/resume/`}
              className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft"
            >
              {home.ctas.resume}
            </Link>
            <Link
              href={`/${dict.locale}/contact/`}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
            >
              {home.ctas.contact}
            </Link>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
            >
              {home.ctas.linkedin}
            </a>
            <Link
              href={`/${dict.locale}/projects/`}
              className="rounded-lg px-5 py-3 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              {home.ctas.cases} →
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-y border-white/5 bg-ink-900/60">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-px px-5 py-10 md:grid-cols-4 md:py-12">
          {home.metrics.map((m) => (
            <Reveal key={m.value} className="px-4 py-3 text-center md:text-left">
              <p className="text-3xl font-extrabold text-white md:text-4xl">{m.value}</p>
              <p className="mt-2 text-sm leading-snug text-slate-500">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Layer 2 — technical authority */}
      <section className="mx-auto max-w-content px-5 py-20 md:py-24">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {home.technical.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            {home.technical.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {home.technical.areas.map((area) => (
            <Reveal key={area.title}>
              <article className="h-full rounded-xl border border-white/5 bg-ink-900/50 p-6 transition-colors hover:border-accent/30">
                <h3 className="text-base font-semibold text-white">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{area.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recruiter CTA */}
      <section className="border-t border-white/5 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(56,189,248,0.08),transparent)]">
        <div className="mx-auto max-w-content px-5 py-20 text-center md:py-24">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {home.recruiterCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
              {home.recruiterCta.body}
            </p>
            <Link
              href={`/${dict.locale}/contact/`}
              className="mt-8 inline-block rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft"
            >
              {home.recruiterCta.button}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
