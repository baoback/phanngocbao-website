import { getToolsPage } from '@/lib/posts';
import ToolsClient from '@/app/components/ToolsClient';

export const revalidate = 3600;

export async function generateMetadata() {
  const pg = getToolsPage();
  const url = 'https://phanngocbao.vn/tools';
  const enabled = (pg.tools || []).filter((t) => t.enabled !== false);
  const description =
    pg.heroSubtitle +
    (enabled.length ? ' Gồm: ' + enabled.map((t) => t.title).join(', ') + '.' : '');
  return {
    title: `${pg.heroTitle} · Công cụ`,
    description,
    alternates: { canonical: url },
    openGraph: { title: pg.heroTitle, description: pg.heroSubtitle, url, type: 'website' },
  };
}

export default function ToolsPage() {
  const pg = getToolsPage();
  return (
    <div className="tl">
      <section className="mk-hero">
        <div className="container">
          <span className="mk-eyebrow">{pg.heroEyebrow}</span>
          <h1 className="mk-title">{pg.heroTitle}</h1>
          {pg.heroSubtitle && <p className="mk-sub">{pg.heroSubtitle}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ToolsClient tools={pg.tools || []} />
          {pg.disclaimer && <p className="mk-disclaimer">{pg.disclaimer}</p>}
        </div>
      </section>
    </div>
  );
}
