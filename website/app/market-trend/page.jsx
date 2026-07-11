import Link from 'next/link';
import { getMarketPage, getSettings } from '@/lib/posts';
import { getTrends, getNews } from '@/lib/market';
import MarketDashboard from '@/app/components/MarketDashboard';

export const revalidate = 1800;

export async function generateMetadata() {
  const pg = getMarketPage();
  const url = 'https://phanngocbao.vn/market-trend';
  return {
    title: `${pg.heroTitle} · Market Trend`,
    description: pg.heroSubtitle,
    alternates: { canonical: url },
    openGraph: { title: pg.heroTitle, description: pg.heroSubtitle, url, type: 'website' },
  };
}

export default async function MarketTrendPage() {
  const pg = getMarketPage();
  const cfg = getSettings();
  const [trends, news] = await Promise.all([getTrends(8), getNews(9)]);

  return (
    <div className="mk">
      <section className="mk-hero">
        <div className="container">
          <span className="mk-eyebrow">{pg.heroEyebrow}</span>
          <h1 className="mk-title">{pg.heroTitle}</h1>
          {pg.heroSubtitle && <p className="mk-sub">{pg.heroSubtitle}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MarketDashboard />
        </div>
      </section>

      {trends.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Xu hướng</span>
              <h2 className="story-h2">{pg.trendsTitle}</h2>
            </div>
            <div className="mk-trends">
              {trends.map((t, i) => (
                <div className="mk-trend reveal-up" key={i} style={{ transitionDelay: `${i * 40}ms` }}>
                  <span className="mk-trend-rank">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mk-trend-title">{t.title}</span>
                  {t.traffic && <span className="mk-trend-traffic">{t.traffic}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Tin mới</span>
              <h2 className="story-h2">{pg.newsTitle}</h2>
            </div>
            <div className="mk-news">
              {news.map((n, i) => (
                <a
                  className="mk-news-item reveal-up"
                  key={i}
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className="mk-news-source">{n.source}</span>
                  <span className="mk-news-title">{n.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="mk-newsletter reveal-up">
            <h2>{pg.newsletterTitle}</h2>
            {pg.newsletterText && <p>{pg.newsletterText}</p>}
            {cfg.newsletterAction ? (
              <form className="mk-form" action={cfg.newsletterAction} method="post" target="_blank">
                <input type="email" name="email" required placeholder="Email của bạn" aria-label="Email" />
                <button type="submit">{cfg.newsletterButton || 'Đăng ký'}</button>
              </form>
            ) : (
              <Link className="btn btn-primary" href="/about#contact">Kết nối để nhận bản tin</Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
