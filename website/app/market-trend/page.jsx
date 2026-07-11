import Link from 'next/link';
import { getMarketPage, getSettings, getMarketBriefs, formatDate } from '@/lib/posts';
import { getTrends, getNews, getUpcomingEvents } from '@/lib/market';
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

// Ưu tiên danh sách chủ đề do CMS nhập tay; nếu trống thì dùng Google Trends đã lọc.
async function resolveTrends(pg) {
  const manual = (pg.trendsManual || []).filter((t) => t && (t.title || typeof t === 'string'));
  if (manual.length) {
    return manual.map((t) => (typeof t === 'string' ? { title: t, traffic: '' } : { title: t.title, traffic: t.note || '' }));
  }
  if (pg.trendsEnabled === false) return [];
  return getTrends(8, { exclude: pg.trendsExclude || [] });
}

export default async function MarketTrendPage() {
  const pg = getMarketPage();
  const cfg = getSettings();
  const briefs = getMarketBriefs();
  const [trends, news] = await Promise.all([resolveTrends(pg), getNews(10, { minMarketing: 3 })]);
  // Sự kiện nhập tay trong CMS được ghim lên đầu; phần còn lại tự sinh theo lịch lặp hằng năm/quý.
  const manualEvents = (pg.events || []).filter((e) => e && e.label);
  const events = [...manualEvents, ...getUpcomingEvents(Math.max(0, 6 - manualEvents.length))];

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
          <MarketDashboard manualCards={pg.manualCards || []} />
        </div>
      </section>

      {briefs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Bản tin</span>
              <h2 className="story-h2">Nhận định thị trường theo ngày</h2>
            </div>
            <div className="mk-briefs">
              {briefs.slice(0, 12).map((b, i) => (
                <Link
                  className="mk-brief reveal-up"
                  key={b.slug}
                  href={`/market-trend/${b.slug}`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className="mk-brief-date">{formatDate(b.date)}</span>
                  <span className="mk-brief-title">{b.title}</span>
                  {b.description && <span className="mk-brief-desc">{b.description}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head reveal-up">
              <span className="story-eyebrow alt">Sắp tới</span>
              <h2 className="story-h2">{pg.eventsTitle}</h2>
            </div>
            <div className="mk-events">
              {events.map((e, i) => (
                <div className="mk-event reveal-up" key={i} style={{ transitionDelay: `${i * 30}ms` }}>
                  <span className="mk-event-date">{e.date}</span>
                  <span className="mk-event-label">{e.label}</span>
                  {e.note && <span className="mk-event-note">{e.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

          {pg.disclaimer && <p className="mk-disclaimer">{pg.disclaimer}</p>}
        </div>
      </section>
    </div>
  );
}
