'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { Dictionary } from '@/content';

type Topic = 'hiring' | 'consulting' | 'other';
type Status = 'idle' | 'sending' | 'sent' | 'error';

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

/**
 * Contact form posting to Formspree. Spam protection: Formspree's own filtering
 * plus a hidden `_gotcha` honeypot field that real visitors never fill.
 */
export default function ContactForm({ dict, formspreeId }: { dict: Dictionary; formspreeId: string }) {
  const f = dict.contact.form;
  const [topic, setTopic] = useState<Topic>('hiring');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('topic');
    if (t === 'hiring' || t === 'consulting' || t === 'other') setTopic(t);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      window.umami?.track('contact-submit', { topic, lang: dict.locale });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <p role="status" className="rounded-xl border border-ok/30 bg-ok/5 p-6 text-sm leading-relaxed text-fg">
        {f.success}
      </p>
    );
  }

  const input =
    'w-full rounded-lg border border-line/15 bg-bg px-4 py-3 text-sm text-fg placeholder:text-faint focus:border-primary focus:outline-none';
  const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-faint';

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="_subject" value={`[philipscheer.github.io] ${f.topics[topic]}`} />
      <input type="hidden" name="language" value={dict.locale} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-gotcha">Leave this field empty</label>
        <input id="contact-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={label}>{f.name}</label>
          <input id="contact-name" name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="contact-email" className={label}>{f.email}</label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label htmlFor="contact-company" className={label}>{f.company}</label>
          <input id="contact-company" name="company" autoComplete="organization" className={input} />
        </div>
        <div>
          <label htmlFor="contact-topic" className={label}>{f.topic}</label>
          <select
            id="contact-topic"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as Topic)}
            className={input}
          >
            <option value="hiring">{f.topics.hiring}</option>
            <option value="consulting">{f.topics.consulting}</option>
            <option value="other">{f.topics.other}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={label}>{f.message}</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder={topic === 'consulting' ? f.messageHintConsulting : f.messageHintHiring}
          className={input}
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-fg">
          {f.error}{' '}
          <a href={`mailto:${dict.contact.email}`} className="text-primary underline">
            {dict.contact.email}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover disabled:opacity-60"
      >
        {status === 'sending' ? f.sending : f.submit}
      </button>
    </form>
  );
}
