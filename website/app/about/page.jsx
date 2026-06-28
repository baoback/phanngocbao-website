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

function platformIcon(label = '', href = '') {
  const s = `${label} ${href}`.toLowerCase();
  const has = (...k) => k.some((x) => s.includes(x));
  if (href.startsWith('mailto:') || has('gmail', 'email', 'mail')) {
    return (
      <svg className="pill-ic" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75L35 40h7c1.66 0 3-1.34 3-3V16.2z" />
        <path fill="#1e88e5" d="M3 16.2l3.61 1.71L13 23.7V40H6c-1.66 0-3-1.34-3-3V16.2z" />
        <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
        <path fill="#c62828" d="M3 12.3v3.9l10 7.5V11.2L9.88 8.86A4.3 4.3 0 0 0 7.3 8 4.3 4.3 0 0 0 3 12.3z" />
        <path fill="#fbc02d" d="M45 12.3v3.9l-10 7.5V11.2l3.12-2.34A4.3 4.3 0 0 1 40.7 8 4.3 4.3 0 0 1 45 12.3z" />
      </svg>
    );
  }
  if (href.startsWith('tel:') || has('gọi', 'goi', 'phone', 'điện thoại', 'sđt', 'sdt')) {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (has('facebook', 'fb.com')) {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.69 4.54-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.25h3.32l-.53 3.49h-2.79v8.44C19.61 23.08 24 18.09 24 12.07z" />
      </svg>
    );
  }
  if (has('linkedin')) {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#0A66C2" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }
  if (has('youtube', 'youtu.be')) {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#FF0000" d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12z" />
      </svg>
    );
  }
  if (has('instagram')) {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#E4405F" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.52.01-4.76.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32-1.24-.06-1.61-.07-4.76-.07zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92zm0 9a3.54 3.54 0 1 0 0-7.08 3.54 3.54 0 0 0 0 7.08zm6.95-9.22a1.27 1.27 0 1 1-2.55 0 1.27 1.27 0 0 1 2.55 0z" />
      </svg>
    );
  }
  if (has('tiktok')) {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.2a2.5 2.5 0 1 1-2.5-2.5c.24 0 .47.04.7.1v-3.37a5.86 5.86 0 0 0-.7-.04 5.86 5.86 0 1 0 5.86 5.86V8.9a7.55 7.55 0 0 0 4.4 1.41V7a4.28 4.28 0 0 1-3.3-1.18z" />
      </svg>
    );
  }
  if (has('github')) {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57A12 12 0 0 0 12 .5z" />
      </svg>
    );
  }
  if (has('twitter', 'x.com') || label.trim().toLowerCase() === 'x') {
    return (
      <svg className="pill-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.46l7.73-8.84L1.04 2.25h6.83l4.71 6.23 5.66-6.23zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64z" />
      </svg>
    );
  }
  return (
    <svg className="pill-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
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
            {a.heroContactLabel && (
              <a className="hero-portrait-cta" href={a.heroContactHref || '#contact'}>
                {a.heroContactLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
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
                  {platformIcon(l.label, l.href)}
                  <span>{l.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
