// Lấy Google Trends VN + tin tổng hợp (server-side, có cache revalidate) để render vào HTML (tốt cho SEO).

function stripTag(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function field(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? stripTag(m[1]) : '';
}

function items(xml) {
  const parts = xml.split(/<item[\s>]/i).slice(1);
  return parts.map((p) => '<item ' + p.split(/<\/item>/i)[0] + '</item>');
}

async function getXml(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PNBmarket/1.0)' },
    next: { revalidate: 1800 },
  });
  if (!r.ok) throw new Error(url + ' ' + r.status);
  return r.text();
}

const TREND_URLS = [
  'https://trends.google.com/trending/rss?geo=VN',
  'https://trends.google.com.vn/trending/rss?geo=VN',
  'https://trends.google.com/trends/trendingsearches/daily/rss?geo=VN',
];

export async function getTrends(limit = 8) {
  for (const url of TREND_URLS) {
    try {
      const xml = await getXml(url);
      const list = items(xml)
        .slice(0, limit)
        .map((b) => ({ title: field(b, 'title'), traffic: field(b, 'ht:approx_traffic') }))
        .filter((x) => x.title);
      if (list.length) return list;
    } catch (e) {
      // thử endpoint tiếp theo
    }
  }
  return [];
}

const NEWS_FEEDS = [
  { source: 'VnExpress Kinh doanh', url: 'https://vnexpress.net/rss/kinh-doanh.rss' },
  { source: 'CafeF Chứng khoán', url: 'https://cafef.vn/thi-truong-chung-khoan.rss' },
  { source: 'VnExpress Số hoá', url: 'https://vnexpress.net/rss/so-hoa.rss' },
];

export async function getNews(limit = 9) {
  const all = [];
  await Promise.all(
    NEWS_FEEDS.map(async (feed) => {
      try {
        const xml = await getXml(feed.url);
        items(xml)
          .slice(0, 6)
          .forEach((b) => {
            const title = field(b, 'title');
            const link = field(b, 'link');
            const pub = field(b, 'pubDate');
            if (title && link) all.push({ title, link, source: feed.source, date: pub ? new Date(pub).getTime() : 0 });
          });
      } catch (e) {
        // bỏ qua feed lỗi
      }
    })
  );
  all.sort((a, b) => b.date - a.date);
  return all.slice(0, limit);
}
