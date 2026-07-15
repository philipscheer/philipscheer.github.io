import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('--c-bg'),
        surface: token('--c-surface'),
        line: token('--c-line'),
        fg: token('--c-fg'),
        muted: token('--c-muted'),
        faint: token('--c-faint'),
        primary: {
          DEFAULT: token('--c-primary'),
          hover: token('--c-primary-hover'),
          fg: token('--c-primary-fg'),
        },
        accent: token('--c-accent'),
        ok: token('--c-ok'),
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [typography],
};

export default config;
