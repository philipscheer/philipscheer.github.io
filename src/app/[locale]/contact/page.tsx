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
  return buildMetadata(locale, 'contact');
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const c = dict.contact;

  const rows = [
    {
      label: c.emailLabel,
      value: c.email,
      href: `mailto:${c.email}`,
    },
    {
      label: c.linkedinLabel,
      value: 'linkedin.com/in/philip-scheer-52752218',
      href: social.linkedin,
    },
    {
      label: c.locationLabel,
      value: c.location,
    },
    {
      label: c.availabilityLabel,
      value: c.availability,
    },
  ];

  return (
    <div className="mx-auto max-w-content px-5 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{c.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-400">{c.intro}</p>

      <Reveal className="mt-12">
        <dl className="max-w-2xl divide-y divide-white/5 rounded-2xl border border-white/5 bg-ink-900/50">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-6 py-5 md:flex-row md:items-baseline md:gap-6">
              <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {row.label}
              </dt>
              <dd className="text-sm leading-relaxed text-slate-300">
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.href.startsWith('http') ? '_blank' : undefined}
                    rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-accent transition-colors hover:text-accent-soft"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <p className="mt-8 max-w-2xl text-sm italic leading-relaxed text-slate-500">{c.note}</p>

      <a
        href={`mailto:${c.email}`}
        className="mt-9 inline-block rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft"
      >
        {c.emailLabel} →
      </a>
    </div>
  );
}
