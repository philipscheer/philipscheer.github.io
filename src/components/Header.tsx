'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Dictionary } from '@/content';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const locale = dict.locale;
  const themeLabel = locale === 'pt' ? 'Alternar tema claro/escuro' : 'Toggle light/dark theme';

  const links = [
    { href: `/${locale}/about/`, label: dict.nav.about },
    { href: `/${locale}/experience/`, label: dict.nav.experience },
    { href: `/${locale}/projects/`, label: dict.nav.projects },
    { href: `/${locale}/leadership/`, label: dict.nav.leadership },
    { href: `/${locale}/articles/`, label: dict.nav.articles },
    { href: `/${locale}/playbook/`, label: dict.nav.playbook },
    { href: `/${locale}/resume/`, label: dict.nav.resume },
    { href: `/${locale}/contact/`, label: dict.nav.contact },
  ];

  const otherLocale = locale === 'en' ? 'pt' : 'en';
  const switchHref = pathname
    ? pathname.replace(`/${locale}`, `/${otherLocale}`)
    : `/${otherLocale}/`;

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}/` && pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-line/5 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
        <Link href={`/${locale}/`} className="text-base font-semibold tracking-tight text-fg">
          Philip<span className="text-primary"> Scheer</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={isActive(l.href) ? 'true' : 'false'}
              className={`nav-underline text-sm transition-colors hover:text-fg ${
                isActive(l.href) ? 'text-fg' : 'text-muted'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/recruiters/`}
            className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            {dict.nav.recruiters}
          </Link>
          <Link
            href={switchHref}
            className="rounded-full border border-line/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:border-primary hover:text-primary"
            aria-label={otherLocale === 'pt' ? 'Mudar para português' : 'Switch to English'}
          >
            {otherLocale === 'pt' ? 'PT' : 'EN'}
          </Link>
          <ThemeToggle label={themeLabel} />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle label={themeLabel} />
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <svg className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line/5 px-5 pb-4 lg:hidden" aria-label="Mobile navigation">
          <Link
            href={`/${locale}/recruiters/`}
            onClick={() => setOpen(false)}
            className={`block py-2.5 text-sm font-semibold ${
              isActive(`/${locale}/recruiters/`) ? 'text-primary' : 'text-primary'
            }`}
          >
            {dict.nav.recruiters}
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-sm ${isActive(l.href) ? 'text-fg' : 'text-muted'}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={switchHref}
            onClick={() => setOpen(false)}
            className="mt-2 inline-block rounded-full border border-line/15 px-3 py-1 text-xs font-medium uppercase text-muted"
          >
            {otherLocale === 'pt' ? 'Português' : 'English'}
          </Link>
        </nav>
      )}
    </header>
  );
}
