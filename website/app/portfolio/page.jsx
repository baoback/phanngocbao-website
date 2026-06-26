import Link from 'next/link';
import { getProjectsPage, getFeaturedProjects } from '@/lib/posts';

export const metadata = {
  title: 'Dự án · Phan Ngọc Bảo',
  description: 'Dự án Marketing thực chiến — thương hiệu, performance và content. Các thương hiệu đã hợp tác.',
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
  const pg = getProjectsPage();
  const projects = getFeaturedProjects().slice(0, 6);
  const marquee = Array.isArray(pg.marquee) ? pg.marquee.filter(Boolean) : [];
  const brands = Array.isArray(pg.brands) ? pg.brands.filter((b) => b && (b.name || b.logo)) : [];
  const services = Array.isArray(pg.services) ? pg.services.filter((s) => s && s.title) : [];

  return (
    <div className="pp">
      {/* Hero — tạp chí căn giữa + marquee */}
      <section className="pp-hero">
        <div className="container">
          {pg.heroEyebrow && <span className="pp-hero-eyebrow reveal-up">{pg.heroEyebrow}</span>}
          <h1 className="pp-hero-title reveal-up">{pg.heroTitle}</h1>
          {pg.heroSubtitle && <p className="pp-hero-sub reveal-up">{pg.heroSubtitle}</p>}
          <div className="pp-hero-cta reveal-up">
            {pg.heroCtaPrimaryLabel && (
              <Link className="btn btn-primary" href={pg.heroCtaPrimaryHref || '#du-an'}>{pg.heroCtaPrimaryLabel}</Link>
            )}
            {pg.heroCtaSecondaryLabel && (
              <Link className="btn btn-ghost" href={pg.heroCtaSecondaryHref || '/about#contact'}>{pg.heroCtaSecondaryLabel} →</Link>
            )}
          </div>
        </div>
        {marquee.length > 0 && (
          <div className="pp-marquee" aria-hidden="true">
            <div className="pp-marquee-track">
              {[...marquee, ...marquee].map((w, i) => (
                <span className="pp-marquee-item" key={i}>{w}<span className="pp-marquee-sep">✦</span></span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Thương hiệu đã hợp tác */}
      {brands.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal-up">
              <div>
                <h2>{pg.brandsTitle}</h2>
                {pg.brandsSubtitle && <p>{pg.brandsSubtitle}</p>}
              </div>
            </div>
            <div className="pp-brands">
              {brands.map((b, i) => (
                <div className="pp-brand reveal-up" key={i} title={b.name}>
                  {b.logo ? <img src={b.logo} alt={b.name} loading="lazy" /> : <span>{b.name}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dự án nổi bật */}
      <section className="section" id="du-an">
        <div className="container">
          <div className="section-head reveal-up">
            <div>
              <h2>{pg.featuredTitle}</h2>
              {pg.featuredSubtitle && <p>{pg.featuredSubtitle}</p>}
            </div>
          </div>
          {projects.length === 0 ? (
            <p className="empty">Chưa có dự án nào. Thêm trong /admin → Dự án.</p>
          ) : (
            <div className="pp-projects">
              {projects.map((p) => <ProjectCard key={p.slug} p={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Lĩnh vực / Dịch vụ */}
      {services.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal-up">
              <div>
                <h2>{pg.servicesTitle}</h2>
                {pg.servicesSubtitle && <p>{pg.servicesSubtitle}</p>}
              </div>
            </div>
            <div className="pp-services">
              {services.map((s, i) => (
                <div className="pp-service reveal-up" key={i}>
                  <div className="pp-service-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3>{s.title}</h3>
                  {s.desc && <p>{s.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA hợp tác */}
      {(pg.ctaTitle || pg.ctaText) && (
        <section className="section">
          <div className="container">
            <div className="cta reveal-up">
              {pg.ctaTitle && <h2>{pg.ctaTitle}</h2>}
              {pg.ctaText && <p>{pg.ctaText}</p>}
              {pg.ctaButtonLabel && (
                <Link className="btn btn-primary" href={pg.ctaButtonHref || '/about#contact'}>{pg.ctaButtonLabel}</Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
