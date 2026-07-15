'use client';

import { useEffect, useRef } from 'react';

const MERMAID_THEME = {
  dark: {
    theme: 'dark' as const,
    themeVariables: {
      background: 'transparent',
      primaryColor: '#0f2b31',
      primaryTextColor: '#e7eef0',
      primaryBorderColor: '#14b8a6',
      lineColor: '#5f8f94',
      secondaryColor: '#0d2126',
      tertiaryColor: '#0a1418',
    },
  },
  light: {
    theme: 'base' as const,
    themeVariables: {
      background: 'transparent',
      primaryColor: '#e6f4f2',
      primaryTextColor: '#0e2229',
      primaryBorderColor: '#0f766e',
      lineColor: '#5b8f89',
      secondaryColor: '#f0f5f4',
      tertiaryColor: '#ffffff',
    },
  },
};

function currentTheme(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Renders article HTML and upgrades fenced ```mermaid code blocks into
 * rendered SVG diagrams on the client. Diagrams follow the active site theme
 * and re-render when the visitor toggles light/dark. Static export safe.
 */
export default function ArticleBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const blocks = Array.from(root.querySelectorAll<HTMLElement>('code.language-mermaid'));
    if (blocks.length === 0) return;

    let cancelled = false;
    const containers: HTMLElement[] = [];

    // Replace each fenced block with a container that caches its source, so we
    // can re-render on theme change without losing the diagram definition.
    for (const code of blocks) {
      const pre = code.closest('pre') ?? code;
      const container = document.createElement('div');
      container.className = 'mermaid not-prose my-8 flex justify-center overflow-x-auto';
      container.dataset.src = code.textContent ?? '';
      pre.replaceWith(container);
      containers.push(container);
    }

    const render = async () => {
      const mermaid = (await import('mermaid')).default;
      const conf = MERMAID_THEME[currentTheme()];
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        theme: conf.theme,
        themeVariables: conf.themeVariables,
      });
      for (const c of containers) {
        c.removeAttribute('data-processed');
        c.innerHTML = '';
        c.textContent = c.dataset.src ?? '';
      }
      if (cancelled) return;
      try {
        await mermaid.run({ nodes: containers });
      } catch {
        // If a diagram fails to parse, leave its source text in place.
      }
    };

    void render();

    // Re-theme on manual toggle and on any external data-theme change.
    const onThemeChange = () => void render();
    window.addEventListener('themechange', onThemeChange);
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      cancelled = true;
      window.removeEventListener('themechange', onThemeChange);
      observer.disconnect();
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose prose-slate dark:prose-invert mt-10 max-w-none prose-headings:text-fg prose-headings:tracking-tight prose-a:text-primary prose-strong:text-fg prose-code:text-primary prose-pre:border prose-pre:border-line/10 prose-pre:bg-surface"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
