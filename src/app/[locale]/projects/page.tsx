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
  return buildMetadata(locale, 'projects');
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const p = dict.projects;
  const labels = p.labels;

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">{p.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{p.intro}</p>

      <div className="mt-12 space-y-10">
        {p.cases.map((c) => (
          <Reveal key={c.slug}>
            <article
              id={c.slug}
              className="rounded-2xl border border-line/5 bg-surface/50 p-7 transition-colors hover:border-primary/25 md:p-9"
            >
              <header>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {c.tagline}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-fg">{c.name}</h2>
              </header>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-5">
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                      {labels.context}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.context}</p>
                  </section>
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                      {labels.challenge}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.challenge}</p>
                  </section>
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                      {labels.role}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.role}</p>
                  </section>
                </div>

                <div className="space-y-5">
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                      {labels.solution}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.solution}</p>
                  </section>
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                      {labels.impact}
                    </h3>
                    <ul className="mt-1.5 space-y-1.5">
                      {c.impact.map((i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
                          <span className="text-ok" aria-hidden="true">✓</span>
                          {i}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                  {labels.stack}
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {c.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line/10 bg-line/5 px-3 py-1 text-xs text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mt-6 rounded-lg border-l-2 border-primary/50 bg-surface/40 px-5 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                  {labels.learnings}
                </h3>
                <p className="mt-1.5 text-sm italic leading-relaxed text-muted">{c.learnings}</p>
              </section>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
