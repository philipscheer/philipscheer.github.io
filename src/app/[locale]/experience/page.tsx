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
  return buildMetadata(locale, 'experience');
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const e = dict.experience;

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{e.title}</h1>
      <p className="mt-3 text-lg text-slate-400">{e.intro}</p>

      <ol className="relative mt-12 space-y-12 border-l border-white/10 pl-8">
        {e.items.map((item) => (
          <li key={`${item.company}-${item.period}`} className="relative">
            <span
              className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-ink-950"
              aria-hidden="true"
            />
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {item.period} · {item.location}
              </p>
              <h2 className="mt-1.5 text-xl font-semibold text-white">{item.role}</h2>
              <p className="mt-0.5 text-sm font-medium text-accent">{item.company}</p>
              <ul className="mt-4 space-y-3">
                {item.bullets.map((b, i) => (
                  <li key={i} className="text-sm leading-relaxed text-slate-400">
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {e.educationTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{e.education}</p>
        </Reveal>
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {e.certificationsTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{e.certifications}</p>
        </Reveal>
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {e.languagesTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{e.languages}</p>
        </Reveal>
      </div>
    </div>
  );
}
