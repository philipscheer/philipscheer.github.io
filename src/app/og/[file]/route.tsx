import { ImageResponse } from 'next/og';
import { getDictionary, locales } from '@/content';

export const dynamic = 'force-static';

const size = { width: 1200, height: 630 };

/** Static Open Graph images served as /og/en.png and /og/pt.png (real .png files for GitHub Pages). */
export function generateStaticParams() {
  return locales.map((locale) => ({ file: `${locale}.png` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const locale = file.replace(/\.png$/, '');
  const dict = getDictionary(locale);
  const roles = dict.home.targetRoles.slice(0, 3).join('  ·  ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0b1220',
          color: '#e6edf3',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, color: '#2dd4bf' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#2dd4bf' }} />
          {dict.home.availability}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            {dict.home.headline}
          </div>
          <div style={{ fontSize: 32, color: '#9fb0c3' }}>{roles}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 30, color: '#9fb0c3' }}>
          <span style={{ color: '#e6edf3', fontWeight: 700 }}>Philip Scheer</span>
          <span>philipscheer.github.io</span>
        </div>
      </div>
    ),
    size,
  );
}
