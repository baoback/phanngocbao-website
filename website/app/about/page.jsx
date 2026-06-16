import { getAbout } from '@/lib/posts';
import ProfileFX from '@/app/components/ProfileFX';
import ImageRotator from '@/app/components/ImageRotator';

export function generateMetadata() {
  const a = getAbout();
  return { title: `${a.name} · Hồ sơ`, description: a.tagline };
}

export default function AboutPage() {
  const a = getAbout();
  const links = [
    a.email && { label: 'Email', href: `mailto:${a.email}` },
    a.linkedin && { label: 'LinkedIn', href: a.linkedin },
    a.facebook && { label: 'Facebook', href: a.facebook },
  ].filter(Boolean);

  return (
    <div className="story">
      <ProfileFX />

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

      {/* SHOWCASE — khối ảnh tự chuyển (crossfade) */}
      {a.showcaseImages.length > 0 && (
        <section className="story-showcase">
          <ImageRotator images={a.showcaseImages} />
          <div className="story-showcase-veil" />
          <div className="container story-showcase-inner">
            {a.showcaseSubtitle && (
              <span className="story-eyebrow reveal-up">{a.showcaseSubtitle}</span>
            )}
            {a.showcaseTitle && <h2 className="story-display reveal-up">{a.showcaseTitle}</h2>}
          </div>
        </section>
      )}

      {/* STATS */}
      {a.stats.length > 0 && (
        <section className="story-section story-stats-sec">
          <div className="container story-stats">
            {a.stats.map((s, i) => (
              <div className="story-stat reveal-up" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="story-stat-num">{s.number}</span>
                <span className="story-stat-label">{s.label}</span>
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

      {/* SKILLS / BENTO */}
      {a.skills.length > 0 && (
        <section className="story-section">
          <div className="container">
            <h2 className="story-h2 reveal-up" style={{ marginBottom: 32 }}>Mình làm gì</h2>
            <div className="story-bento">
              {a.skills.map((s, i) => (
                <div className="story-card reveal-up" key={i} style={{ transitionDelay: `${i * 70}ms` }}>
                  <span className="story-card-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  {s.desc && <p>{s.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXTRA PROSE */}
      {a.html && a.html.replace(/<[^>]+>/g, '').trim() && (
        <section className="story-section">
          <div className="container narrow">
            <div className="story-prose reveal-up" dangerouslySetInnerHTML={{ __html: a.html }} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="story-cta-sec">
        <div className="container story-cta reveal-up">
          <h2 className="story-display sm">{a.ctaTitle || 'Kết nối với mình'}</h2>
          {a.ctaText && <p>{a.ctaText}</p>}
          {links.length > 0 && (
            <div className="story-links">
              {links.map((l) => (
                <a
                  key={l.label}
                  className="story-pill"
                  href={l.href}
                  target={l.href.startsWith('mailto:') ? undefined : '_blank'}
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
