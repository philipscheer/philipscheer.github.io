import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { getDictionary, social } from '@/content';
import { buildMetadata } from '@/lib/seo';
import { integrations, trackEvent } from '@/lib/integrations';
import ContactForm from '@/components/ContactForm';

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
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">{c.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{c.intro}</p>

      <Reveal className="mt-12">
        <dl className="max-w-2xl divide-y divide-white/5 rounded-2xl border border-line/5 bg-surface/50">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-6 py-5 md:flex-row md:items-baseline md:gap-6">
              <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wider text-faint">
                {row.label}
              </dt>
              <dd className="text-sm leading-relaxed text-muted">
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.href.startsWith('http') ? '_blank' : undefined}
                    rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-primary transition-colors hover:text-primary"
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

      <p className="mt-8 max-w-2xl text-sm italic leading-relaxed text-faint">{c.note}</p>

      {(integrations.formspreeId || integrations.calendlyUrl) && (
        <div id="form" className="mt-14 grid scroll-mt-24 gap-8 lg:grid-cols-[2fr_1fr]">
          {integrations.formspreeId && (
            <section aria-labelledby="form-title" className="rounded-2xl border border-line/5 bg-surface/50 p-6 md:p-8">
              <h2 id="form-title" className="text-xl font-semibold text-fg">{c.form.title}</h2>
              <p className="mb-6 mt-2 text-sm text-muted">{c.form.intro}</p>
              <ContactForm dict={dict} formspreeId={integrations.formspreeId} />
            </section>
          )}
          {integrations.calendlyUrl && (
            <aside className="h-fit rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-fg">{c.schedule.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.schedule.body}</p>
              <a
                href={integrations.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                {...trackEvent('schedule-click', { place: 'contact' })}
                className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
              >
                {c.schedule.button}
              </a>
            </aside>
          )}
        </div>
      )}

      <a
        href={`mailto:${c.email}`}
        {...trackEvent('email-click', { place: 'contact' })}
        className="mt-9 inline-block rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
      >
        {c.emailLabel} →
      </a>
    </div>
  );
}
