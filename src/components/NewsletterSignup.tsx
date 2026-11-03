import type { Dictionary } from '@/content';
import { integrations, trackEvent } from '@/lib/integrations';

/**
 * Tech Radar newsletter signup. Posts straight to Buttondown (no JS needed);
 * when no Buttondown username is configured it falls back to the RSS feed.
 */
export default function NewsletterSignup({ dict, place }: { dict: Dictionary; place: string }) {
  const t = dict.newsletter;
  const feed = `/${dict.locale}/feed.xml`;
  const user = integrations.buttondownUsername;

  return (
    <aside className="rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-7" aria-labelledby={`newsletter-${place}`}>
      <h2 id={`newsletter-${place}`} className="text-lg font-semibold text-fg">
        {t.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>

      {user ? (
        <form
          action={`https://buttondown.com/api/emails/embed-subscribe/${user}`}
          method="post"
          target="_blank"
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor={`newsletter-email-${place}`} className="sr-only">
            {t.emailLabel}
          </label>
          <input
            id={`newsletter-email-${place}`}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t.placeholder}
            className="min-w-0 flex-1 rounded-lg border border-line/15 bg-bg px-4 py-3 text-sm text-fg placeholder:text-faint focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            {...trackEvent('newsletter-subscribe', { place })}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            {t.button}
          </button>
        </form>
      ) : null}

      <p className="mt-4 text-xs text-faint">
        {user ? `${t.privacy} ` : ''}
        <a href={feed} className="text-primary hover:underline" {...trackEvent('rss-click', { place })}>
          {t.rssLabel}
        </a>
      </p>
    </aside>
  );
}
