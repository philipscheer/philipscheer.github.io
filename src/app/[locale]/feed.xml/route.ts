import { getDictionary, locales, siteUrl, type Locale } from '@/content';
import { getAllArticles } from '@/lib/articles';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS 2.0 feed per locale: /en/feed.xml and /pt/feed.xml */
export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const l = dict.locale as Locale;
  const articles = getAllArticles(l);
  const home = `${siteUrl}/${l}/articles/`;

  const items = articles
    .map((a) => {
      const url = `${siteUrl}/${l}/articles/${a.slug}/`;
      const pubDate = new Date(`${a.date}T12:00:00Z`).toUTCString();
      const categories = a.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n');
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(a.description)}</description>
${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${dict.articles.title} — Philip Scheer`)}</title>
    <link>${home}</link>
    <description>${esc(dict.meta.articles.description)}</description>
    <language>${l === 'pt' ? 'pt-BR' : 'en'}</language>
    <atom:link href="${siteUrl}/${l}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
