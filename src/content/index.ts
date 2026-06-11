import { en } from './en';
import { pt } from './pt';
import type { Dictionary, Locale } from './types';

export const locales: Locale[] = ['en', 'pt'];
export const defaultLocale: Locale = 'en';

export const siteUrl = 'https://philipscheer.github.io';

export const social = {
  linkedin: 'https://www.linkedin.com/in/philip-scheer-52752218/',
  github: 'https://github.com/philipscheer',
  email: 'philip.scheer.ti@gmail.com',
};

const dictionaries: Record<Locale, Dictionary> = { en, pt };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : 'en'];
}

export type { Dictionary, Locale, CaseStudy, ExperienceItem } from './types';
