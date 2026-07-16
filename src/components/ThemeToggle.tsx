'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * Theme switch. The initial theme is resolved pre-paint by the inline script
 * in the layout head; this component reads it on mount, then persists and
 * broadcasts (`themechange`) manual toggles so live views (e.g. Mermaid
 * diagrams) can re-theme without a reload.
 */
export default function ThemeToggle({ label }: { label?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage may be unavailable */
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    setTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={label ?? 'Toggle color theme'}
      title={label ?? 'Toggle color theme'}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-line/20 text-faint transition-colors duration-300 hover:border-primary hover:text-primary"
    >
      {/* Both icons are stacked and cross-faded/rotated; nothing shows until
          mounted to avoid a hydration mismatch. */}
      {/* Sun — visible in dark mode (click to go light) */}
      <svg
        className={`absolute h-4 w-4 transition-all duration-300 motion-reduce:transition-none ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"
        />
      </svg>
      {/* Moon — visible in light mode (click to go dark) */}
      <svg
        className={`absolute h-4 w-4 transition-all duration-300 motion-reduce:transition-none ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
        }`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
