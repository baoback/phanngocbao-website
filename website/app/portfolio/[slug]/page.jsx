import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getProjectBySlug } from '@/lib/posts';

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
  const meta = [p.role, p.year].filter(Boolean).join(' · ');

  return (
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
      <div className="post-body" dangerouslySetInnerHTML={{ __html: p.html }} />
      {p.url && (
        <p style={{ marginTop: 32 }}>
          <a className="btn btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">Xem dự án ↗</a>
        </p>
      )}
    </article>
  );
}
