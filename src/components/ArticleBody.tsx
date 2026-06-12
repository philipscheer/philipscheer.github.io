'use client';

import { useEffect, useRef } from 'react';

/**
 * Renders article HTML and upgrades fenced ```mermaid code blocks into
 * rendered SVG diagrams on the client. Diagrams are themed to match the
 * dark site palette. Runs once after mount; static export safe.
 */
export default function ArticleBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const blocks = Array.from(
      root.querySelectorAll<HTMLElement>('code.language-mermaid'),
    );
    if (blocks.length === 0) return;

    let cancelled = false;

    (async () => {
      const mermaid = (await import('mermaid')).default;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'dark',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        themeVariables: {
          background: 'transparent',
          primaryColor: '#1e293b',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#334155',
          lineColor: '#64748b',
          secondaryColor: '#0f172a',
          tertiaryColor: '#0b1220',
        },
      });

      const targets: HTMLElement[] = [];
      for (const code of blocks) {
        const pre = code.closest('pre') ?? code;
        const container = document.createElement('div');
        container.className = 'mermaid not-prose my-8 flex justify-center overflow-x-auto';
        container.textContent = code.textContent ?? '';
        pre.replaceWith(container);
        targets.push(container);
      }

      if (cancelled) return;
      try {
        await mermaid.run({ nodes: targets });
      } catch {
        // If a diagram fails to parse, leave its source text in place.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose prose-invert prose-slate mt-10 max-w-none prose-headings:tracking-tight prose-a:text-accent prose-strong:text-white prose-code:text-accent-soft prose-pre:bg-ink-900 prose-pre:border prose-pre:border-white/5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
