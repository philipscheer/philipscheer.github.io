import Reveal from '@/components/Reveal';
import type { Dictionary } from '@/content';
import { testimonials } from '@/content/testimonials';

export default function Testimonials({ dict, limit }: { dict: Dictionary; limit?: number }) {
  if (testimonials.length === 0) return null;
  const t = dict.testimonials;
  const items = typeof limit === 'number' ? testimonials.slice(0, limit) : testimonials;

  return (
    <section className="mx-auto max-w-content px-5 py-20 md:py-24" aria-labelledby="testimonials-title">
      <Reveal>
        <h2 id="testimonials-title" className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t.intro}</p>
      </Reveal>
      <div className="stagger mt-12 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <Reveal key={`${item.name}-${item.company}`}>
            <figure className="flex h-full flex-col rounded-xl border border-line/5 bg-surface/50 p-7">
              <blockquote lang={item.lang} className="flex-1 text-base leading-relaxed text-muted">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold text-fg">{item.name}</span>
                <span className="block text-faint">
                  {item.role} · {item.company}
                  {item.relationship ? ` · ${item.relationship}` : ''}
                </span>
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-primary hover:underline"
                  >
                    {t.sourceLabel} ↗
                  </a>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
