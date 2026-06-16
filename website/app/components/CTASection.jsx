import Link from 'next/link';
import { getSettings } from '@/lib/posts';

export default function CTASection() {
  const s = getSettings();
  return (
    <section className="section">
      <div className="container">
        <div className="cta reveal-up">
          <h2>{s.ctaTitle}</h2>
          <p>{s.ctaText}</p>
          <Link href="/about" className="btn btn-primary">{s.ctaButton}</Link>
        </div>
      </div>
    </section>
  );
}
