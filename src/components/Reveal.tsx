'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export default function Reveal({
  children,
  className = '',
  delay,
}: {
  children: ReactNode;
  className?: string;
  /** Reveal delay in ms (for manual staggering outside a .stagger parent). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style =
    delay != null ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
