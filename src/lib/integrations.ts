/**
 * Third-party integrations, configured through public build-time env vars
 * (GitHub repository variables in CI). Every integration is optional:
 * when a value is empty the site falls back to a no-JS / mailto experience.
 */
export const integrations = {
  /** Umami Cloud (free Hobby plan) website ID — enables cookie-less analytics. */
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '',
  umamiScriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js',
  /** Public Calendly scheduling link, e.g. https://calendly.com/<user>/20min */
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? '',
  /** Formspree form ID (the part after /f/ in the endpoint). */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? '',
  /** Buttondown newsletter username. */
  buttondownUsername: process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME ?? '',
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
