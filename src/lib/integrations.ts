/**
 * Third-party integrations, configured through public build-time env vars
 * (GitHub repository variables in CI). Every integration is optional:
 * when a value is empty the site falls back to a no-JS / mailto experience.
 */
const env = (v: string | undefined) => (v ?? '').trim();

/** Accept values typed without a scheme, e.g. "calendly.com/user" → "https://calendly.com/user". */
const withProtocol = (url: string) => (!url || /^https?:\/\//i.test(url) ? url : `https://${url}`);

export const integrations = {
  /** Umami Cloud (free Hobby plan) website ID — enables cookie-less analytics. */
  umamiWebsiteId: env(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID),
  umamiScriptUrl: withProtocol(env(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL)) || 'https://cloud.umami.is/script.js',
  /** Public Calendly scheduling link, e.g. https://calendly.com/<user>/20min */
  calendlyUrl: withProtocol(env(process.env.NEXT_PUBLIC_CALENDLY_URL)),
  /** Formspree form ID (the part after /f/ in the endpoint). */
  formspreeId: env(process.env.NEXT_PUBLIC_FORMSPREE_ID),
  /** Buttondown newsletter username. */
  buttondownUsername: env(process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME),
};

/** Where "schedule a call" points: Calendly when configured, otherwise the contact form. */
export function scheduleHref(locale: string, topic: 'hiring' | 'consulting' = 'hiring') {
  return integrations.calendlyUrl || `/${locale}/contact/?topic=${topic}#form`;
}

/** Umami custom-event attribute, e.g. {...trackEvent('resume-download', { lang: 'en' })} */
export function trackEvent(name: string, data: Record<string, string> = {}) {
  const attrs: Record<string, string> = { 'data-umami-event': name };
  for (const [k, v] of Object.entries(data)) attrs[`data-umami-event-${k}`] = v;
  return attrs;
}
