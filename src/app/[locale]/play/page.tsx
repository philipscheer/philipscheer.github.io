import type { Metadata } from 'next';
import { social } from '@/content';
import { getGameDictionary } from '@/content/game';
import { buildMetadata } from '@/lib/seo';
import CareerQuest from '@/components/game/CareerQuest';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, 'play');
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const gdict = getGameDictionary(locale);
  const safeLocale = locale === 'pt' ? 'pt' : 'en';

  return (
    <div className="mx-auto max-w-content px-5 py-12 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">
        {gdict.page.title}
        <span className="ml-3 align-middle font-mono text-base text-primary">▶ 2005–2026</span>
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{gdict.page.intro}</p>

      <CareerQuest dict={gdict} locale={safeLocale} linkedinUrl={social.linkedin} />

      <noscript>
        <p className="mt-6 text-sm text-muted">{gdict.page.noscript}</p>
      </noscript>
    </div>
  );
}
