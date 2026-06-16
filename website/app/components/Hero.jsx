import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-eyebrow">Chiến lược · Thương hiệu · Performance</span>
          <h1>
            Marketing là tư duy<br />
            hệ thống, <span className="accent">không phải may rủi.</span>
          </h1>
          <p className="lead">
            Mình chia sẻ cách xây thương hiệu và tối ưu hiệu suất bằng những nguyên tắc thực chiến —
            đo lường được, lặp lại được, và bền vững theo thời gian.
          </p>
          <div className="hero-actions">
            <Link href="#bai-viet" className="btn btn-primary">Đọc bài viết mới nhất</Link>
            <Link href="/about" className="btn btn-ghost">Về mình →</Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="node" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
            </defs>
            <g stroke="#c9c9cc" strokeWidth="1" fill="none">
              <circle className="orbit" cx="250" cy="250" r="210" strokeDasharray="2 7" />
              <circle className="orbit rev" cx="250" cy="250" r="160" strokeDasharray="2 9" />
              <circle cx="250" cy="250" r="110" />
            </g>
            <g className="orbit">
              <circle cx="250" cy="40" r="9" fill="#0a0a0a" />
              <circle cx="460" cy="250" r="6" fill="#1a1a1a" />
              <circle cx="250" cy="460" r="7" fill="#2a2a2a" />
              <circle cx="40" cy="250" r="5" fill="#3a3a3a" />
            </g>
            <g className="orbit rev">
              <circle cx="250" cy="90" r="5" fill="#555555" />
              <circle cx="410" cy="250" r="7" fill="#0a0a0a" />
              <circle cx="250" cy="410" r="5" fill="#444444" />
              <circle cx="90" cy="250" r="6" fill="#222222" />
            </g>
            <g stroke="#0a0a0a" strokeWidth="1.4" opacity="0.45">
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
