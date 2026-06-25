import Link from 'next/link';
import { getAbout, getSettings, getFeaturedProjects } from '@/lib/posts';
import ProfileFX from '@/app/components/ProfileFX';
import ImageRotator from '@/app/components/ImageRotator';

export function generateMetadata() {
  const a = getAbout();
  return { title: `${a.name} · Hồ sơ`, description: a.tagline };
}

export default function AboutPage() {
  const a = getAbout();
  const cfg = getSettings();
  const cases = getFeaturedProjects();

  const links = [
    a.email && { label: 'Email', href: `mailto:${a.email}` },
    a.phone && { label: 'Gọi điện', href: `tel:${a.phone}` },
    ...a.socials.map((sc) => ({ label: sc.label, href: sc.url })),
  ].filter(Boolean);

  return (
    <div className="story" style={{ '--story-accent': cfg.accent || '#B0814C' }}>
      <ProfileFX />
      <div className="story-spine" aria-hidden="true"><span className="story-spine-fill" /></div>

      {/* HERO */}
      <section className="story-hero">
        <div className="story-hero-media">
          {a.heroImage ? (
            <img className="parallax-img" src={a.heroImage} alt="" aria-hidden="true" />
          ) : (
            <div className="story-hero-fallback" />
          )}
          <div className="story-hero-veil" />
        </div>
        <div className="container story-hero-inner">
          {a.heroEyebrow && <span className="story-eyebrow reveal-up">{a.heroEyebrow}</span>}
          <h1 className="story-display reveal-up">{a.heroTitle || a.tagline || a.name}</h1>
          <span className="story-scroll reveal-up">scroll ↓</span>
        </div>
      </section>

      {/* LEAD */}
      {(a.lead || a.tagline) && (
        <section className="story-section">
          <div className="container narrow">
            <p className="story-lead reveal-up">{a.lead || a.tagline}</p>
          </div>
        </section>
      )}

      {/* STATS — count-up + bar */}
      {a.stats.length > 0 && (
        <section className="story-section story-stats-sec">
          <div className="container story-stats">
            {a.stats.map((st, i) => (
              <div className="story-stat reveal-up" key={i} style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="story-stat-num countup">{st.number}</span>
                <span className="story-stat-label">{st.label}</span>
                {typeof st.percent === 'number' && (
                  <div className="mini-bar"><span className="mini-bar-fill" style={{ '--pct': `${st.percent}%` }} /></div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STORY BLOCKS */}
      {a.storyBlocks.map((b, i) => (
        <section className={`story-section story-block${i % 2 ? ' reverse' : ''}`} key={i}>
          <div className="container story-block-grid">
            {b.image && (
              <div className="story-block-media reveal-up">
                <img className="parallax-img" src={b.image} alt={b.heading || ''} />
              </div>
            )}
            <div className="story-block-text reveal-up">
              {b.heading && <h2 className="story-h2">{b.heading}</h2>}
              {b.text && <p>{b.text}</p>}
            </div>
          </div>
        </section>
      ))}

      {/* CAPABILITIES — skill bars */}
      {a.skills.length > 0 && (
        <section className="story-section">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Năng lực</span>
              <h2 className="story-h2">Bốn mảng mình tạo ra giá trị rõ nhất.</h2>
            </div>
            <div className="cap-grid">
              {a.skills.map((sk, i) => (
                <div className="cap-card reveal-up" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                  <span className="cap-no">{String(i + 1).padStart(2, '0')}</span>
                  <div className="cap-top">
                    <h3>{sk.title}</h3>
                    {typeof sk.level === 'number' && <span className="cap-pct countup">{`${sk.level}%`}</span>}
                  </div>
                  {sk.desc && <p>{sk.desc}</p>}
                  {typeof sk.level === 'number' && (
                    <div className="cap-bar"><span className="cap-bar-fill" style={{ '--pct': `${sk.level}%` }} /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CASE STUDIES — from featured projects */}
      {cases.length > 0 && (
        <section className="story-section">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Dự án thực chiến</span>
              <h2 className="story-h2">Mỗi dự án là một bài toán tăng trưởng có lời giải.</h2>
            </div>
            {cases.map((c) => (
              <article className="case reveal-up" key={c.slug}>
                <div className="case-top">
                  <h3>{c.title}</h3>
                  {(c.role || c.year) && (
                    <span className="case-role">{[c.role, c.year].filter(Boolean).join(' · ')}</span>
                  )}
                </div>
                {c.description && <p className="case-obj">{c.description}</p>}
                {c.phases.length > 0 && (
                  <div className="case-timeline">
                    {c.phases.map((ph, j) => (
                      <div className="case-tl" key={j}>
                        <span className="case-tl-yr">{ph.label}</span>
                        <span className="case-tl-ev">{ph.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {c.metrics.length > 0 && (
                  <div className="case-metrics">
                    {c.metrics.map((m, j) => (
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
                <Link href={`/portfolio/${c.slug}/`} className="case-link">Xem chi tiết →</Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* TOOLKIT — dark, tag groups */}
      {a.toolkit.length > 0 && (
        <section className="story-section">
          <div className="container">
            <div className="toolkit-box">
              <div className="sec-head reveal-up">
                <span className="story-eyebrow on-dark">Bộ công cụ</span>
                <h2 className="story-h2 on-dark">Công cụ mình dùng để xây, đo và tăng trưởng.</h2>
              </div>
              <div className="tk-grid">
                {a.toolkit.map((g, i) => (
                  <div className="tk reveal-up" key={i} style={{ transitionDelay: `${i * 50}ms` }}>
                    <h4>{g.group}</h4>
                    <ul>
                      {(g.items || []).map((it, j) => (
                        <li key={j}>{typeof it === 'string' ? it : it.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SHOWCASE — ảnh lướt lên */}
      {a.showcaseImages.length > 0 && (
        <section className="story-showcase">
          <div className="showcase-reveal">
            <ImageRotator images={a.showcaseImages} />
            <div className="story-showcase-veil" />
          </div>
          <div className="container story-showcase-inner">
            {a.showcaseSubtitle && <span className="story-eyebrow reveal-up">{a.showcaseSubtitle}</span>}
            {a.showcaseTitle && <h2 className="story-display reveal-up">{a.showcaseTitle}</h2>}
          </div>
        </section>
      )}

      {/* CTA / CONTACT */}
      <section className="story-cta-sec">
        <div className="container story-cta reveal-up">
          <span className="story-eyebrow alt">Kết nối</span>
          <h2 className="story-display sm">{a.ctaTitle || 'Kết nối với mình'}</h2>
          {a.ctaText && <p>{a.ctaText}</p>}
          {links.length > 0 && (
            <div className="story-links">
              {links.map((l) => (
                <a
                  key={l.label}
                  className="story-pill"
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
