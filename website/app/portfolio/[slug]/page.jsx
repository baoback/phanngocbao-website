import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getProjectBySlug, getSettings } from '@/lib/posts';

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return {};
  const url = `https://phanngocbao.vn/portfolio/${slug}/`;
  const images = p.cover ? [p.cover] : [];
  return {
    title: `${p.title} · Dự án`,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { title: p.title, description: p.description, url, type: 'article', images },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description, images },
  };
}

export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) notFound();
  const s = getSettings();
  const meta = [p.role, p.year, p.tags].filter(Boolean).join(' · ');

  return (
    <div className="story" style={{ '--story-accent': s.accent || '#B0814C' }}>
      <article className="post container">
        <Link href="/portfolio" className="back-link">← Tất cả dự án</Link>
        {p.cover && <img className="cover" src={p.cover} alt={p.title} />}
        <h1>{p.title}</h1>
        {meta && <div className="post-meta">{meta}</div>}
        {p.description && (
          <p className="profile-body" style={{ fontSize: 20, color: 'var(--text-muted)', marginBottom: 28 }}>
            {p.description}
          </p>
        )}

        {p.phases.length > 0 && (
          <div className="case-timeline reveal-up" style={{ margin: '8px 0 30px' }}>
            {p.phases.map((ph, j) => (
              <div className="case-tl" key={j}>
                <span className="case-tl-yr">{ph.label}</span>
                <span className="case-tl-ev">{ph.text}</span>
              </div>
            ))}
          </div>
        )}

        {p.metrics.length > 0 && (
          <div className="case-metrics reveal-up" style={{ margin: '0 0 36px' }}>
            {p.metrics.map((m, j) => (
              <div className="case-metric" key={j}>
                <span className="case-metric-val">{m.value}</span>
                <span className="case-metric-cap">{m.caption}</span>
                {typeof m.percent === 'number' && (
                  <div className="mini-bar"><span className="mini-bar-fill" style={{ '--pct': `${m.percent}%` }} /></div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="post-body" dangerouslySetInnerHTML={{ __html: p.html }} />

        {p.url && (
          <p style={{ marginTop: 32 }}>
            <a className="btn btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">Xem dự án ↗</a>
          </p>
        )}
      </article>
    </div>
  );
}
