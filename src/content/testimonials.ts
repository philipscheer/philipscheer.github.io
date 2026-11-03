/**
 * Recommendations shown on Home and For Recruiters.
 *
 * Add entries copied verbatim from LinkedIn recommendations (or another written
 * source) only with the author's permission. Keep the quote in its original
 * language and set `lang` accordingly. The section stays hidden while the list
 * is empty, so the site never shows placeholder or invented quotes.
 */
export interface Testimonial {
  quote: string;
  name: string;
  /** Author's role at the time, e.g. "Director of Engineering". */
  role: string;
  company: string;
  /** How you worked together, e.g. "Managed Philip directly" (optional). */
  relationship?: string;
  /** Public URL of the original recommendation, e.g. the LinkedIn profile (optional). */
  sourceUrl?: string;
  lang: 'en' | 'pt';
}

export const testimonials: Testimonial[] = [];
