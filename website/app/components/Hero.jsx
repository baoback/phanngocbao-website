import Link from 'next/link';
import { getSettings } from '@/lib/posts';

export default function Hero() {
  const s = getSettings();
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy reveal-up">
          <span className="hero-eyebrow">{s.heroEyebrow}</span>
          <h1>
            {s.heroTitle} <span className="accent">{s.heroTitleAccent}</span>
          </h1>
          <p className="lead">{s.heroSubtitle}</p>
          <div className="hero-actions">
            <Link href="#bai-viet" className="btn btn-primary">{s.heroPrimaryLabel}</Link>
            <Link href="/about" className="btn btn-ghost">{s.heroSecondaryLabel} →</Link>
          </div>
        </div>

        <div className="hero-visual reveal" aria-hidden="true">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="node" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
            </defs>
            <g stroke="var(--hero-line)" strokeWidth="1" fill="none">
              <circle className="orbit" cx="250" cy="250" r="210" strokeDasharray="2 7" />
              <circle className="orbit rev" cx="250" cy="250" r="160" strokeDasharray="2 9" />
              <circle cx="250" cy="250" r="110" />
            </g>
            <g className="orbit" fill="var(--hero-dot)">
              <circle cx="250" cy="40" r="9" />
              <circle cx="460" cy="250" r="6" />
              <circle cx="250" cy="460" r="7" />
              <circle cx="40" cy="250" r="5" />
            </g>
            <g className="orbit rev" fill="var(--hero-dot)" opacity="0.7">
              <circle cx="250" cy="90" r="5" />
              <circle cx="410" cy="250" r="7" />
              <circle cx="250" cy="410" r="5" />
              <circle cx="90" cy="250" r="6" />
            </g>
            <g stroke="var(--hero-dot)" strokeWidth="1.4" opacity="0.45">
              <line x1="250" y1="250" x2="250" y2="40" />
              <line x1="250" y1="250" x2="460" y2="250" />
              <line x1="250" y1="250" x2="250" y2="460" />
              <line x1="250" y1="250" x2="40" y2="250" />
            </g>
            <circle cx="250" cy="250" r="34" fill="url(#node)" />
            <circle cx="250" cy="250" r="34" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
          </svg>
        </div>
      </div>
    </section>
  );
}
