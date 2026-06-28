import { getAbout, getSettings } from '@/lib/posts';
import ProfileFX from '@/app/components/ProfileFX';
import ImageRotator from '@/app/components/ImageRotator';
import LifeGallery from '@/app/components/LifeGallery';

export function generateMetadata() {
  const a = getAbout();
  const title = `${a.name} · Hồ sơ`;
  const description = a.tagline;
  return {
    title,
    description,
    alternates: { canonical: '/about' },
    openGraph: { title, description, url: 'https://phanngocbao.vn/about', type: 'profile' },
  };
}

export default function AboutPage() {
  const a = getAbout();
  const cfg = getSettings();

  const links = [
    a.email && { label: 'Email', href: `mailto:${a.email}` },
    a.phone && { label: 'Gọi điện', href: `tel:${a.phone}` },
    ...a.socials.map((sc) => ({ label: sc.label, href: sc.url })),
  ].filter(Boolean);

  return (
    <div className="story" style={{ '--story-accent': cfg.accent || '#B0814C' }}>
      <ProfileFX />
      <div className="story-spine" aria-hidden="true"><span className="story-spine-fill" /></div>

      {/* HERO v2 — split, kinetic, spotlight + grain */}
      <section className="story-hero hero-v2" id="top">
        <div className="hero-bg" aria-hidden="true">
          {a.heroImage && <img className="parallax-img hero-bg-img" src={a.heroImage} alt="" />}
          <div className="hero-grain" />
          <div className="hero-spot" />
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            {a.heroBadge && (
              <span className="hero-badge"><i className="dot" />{a.heroBadge}</span>
            )}
            {a.heroEyebrow && <span className="story-eyebrow hero-eyebrow">{a.heroEyebrow}</span>}
            <h1 className="story-display hero-headline">{a.heroTitle || a.name}</h1>
            {a.heroWords.length > 0 && (
              <p className="hero-rotate">
                {a.heroRotatePrefix ? `${a.heroRotatePrefix} ` : ''}
                <span className="hero-rotate-word" data-words={JSON.stringify(a.heroWords)}>
                  {a.heroWords[0]}
                </span>
              </p>
            )}
            {(a.lead || a.tagline) && <p className="hero-lead">{a.lead || a.tagline}</p>}
            {(a.heroCtaPrimaryLabel || a.heroCtaSecondaryLabel) && (
              <div className="hero-actions">
                {a.heroCtaPrimaryLabel && <a className="btn-bronze" href="#hanh-trinh">{a.heroCtaPrimaryLabel}</a>}
                {a.heroCtaSecondaryLabel && <a className="btn-outline" href="#contact">{a.heroCtaSecondaryLabel}</a>}
              </div>
            )}
          </div>
          <div className="hero-portrait-wrap">
            {a.heroPortrait ? (
              <img className="hero-portrait" src={a.heroPortrait} alt={a.name} />
            ) : (
              <div className="hero-portrait placeholder" />
            )}
          </div>
        </div>
        <span className="story-scroll hero-scroll">scroll ↓</span>
      </section>

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

      {/* JOURNEY — timeline dọc */}
      {a.journey.length > 0 && (
        <section className="story-section" id="hanh-trinh">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Hành trình</span>
              <h2 className="story-h2">Đi qua nhiều vai, mỗi chặng để lại một bài học.</h2>
            </div>
            <div className="jty">
              {a.journey.map((j, i) => (
                <div className="jty-item reveal-up" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="jty-marker" aria-hidden="true"><span /></div>
                  <div className="jty-card">
                    <div className="jty-head">
                      <div className="jty-headmain">
                        {j.period && <span className="jty-period">{j.period}</span>}
                        {j.role && <h3 className="jty-role">{j.role}</h3>}
                        {j.place && <span className="jty-place">{j.place}</span>}
                      </div>
                      {j.logo && (
                        <div className="jty-logo-wrap">
                          <img className="jty-logo" src={j.logo} alt={j.place || ''} loading="lazy" decoding="async" />
                        </div>
                      )}
                    </div>
                    {j.text && (
                      <div className="jty-block">
                        <span className="jty-block-tag">Trách nhiệm</span>
                        <p>{j.text}</p>
                      </div>
                    )}
                    {j.takeaway && (
                      <div className="jty-block jty-block--win">
                        <span className="jty-block-tag">Thành tựu</span>
                        <p>{j.takeaway}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* LIFE — ngoài công việc */}
      {a.life.length > 0 && (
        <section className="story-section" id="cuoc-song">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Ngoài công việc</span>
              <h2 className="story-h2">Vài điều làm nên mình, ngoài những con số.</h2>
            </div>
            <LifeGallery items={a.life} />
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
      <section className="story-cta-sec" id="contact">
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
