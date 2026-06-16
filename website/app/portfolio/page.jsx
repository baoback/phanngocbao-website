import Link from 'next/link';
import { getAllProjects, getSettings } from '@/lib/posts';

export const metadata = {
  title: 'Dự án · Phan Ngọc Bảo',
  description: 'Các dự án Marketing thực chiến của Phan Ngọc Bảo.',
};

function ProjectCard({ p }) {
  const meta = [p.role, p.year].filter(Boolean).join(' · ');
  if (p.cover) {
    return (
      <Link href={`/portfolio/${p.slug}/`} className="card has-cover reveal">
        <div className="thumb-wrap">
          <img className="thumb" src={p.cover} alt={p.title} loading="lazy" />
        </div>
        <div className="veil" />
        <div className="card-body">
          {meta && <div className="meta">{meta}</div>}
          <h3>{p.title}</h3>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/portfolio/${p.slug}/`} className="card text-card reveal">
      <div className="card-body" style={{ padding: 0 }}>
        {meta && <div className="meta">{meta}</div>}
        <h3>{p.title}</h3>
        {p.description && <p className="excerpt">{p.description}</p>}
      </div>
    </Link>
  );
}

export default function PortfolioPage() {
  const projects = getAllProjects();
  const s = getSettings();
  return (
    <>
      <section className="page-hero">
        <div className="container reveal-up">
          <h1>{s.portfolioTitle}</h1>
          <p>{s.portfolioSubtitle}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {projects.length === 0 ? (
            <p className="empty">Chưa có dự án nào. Thêm trong /admin → Dự án.</p>
          ) : (
            <div className="bento">
              {projects.map((p) => <ProjectCard key={p.slug} p={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
