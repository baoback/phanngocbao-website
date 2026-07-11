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
  // Timeout để fetch không bao giờ treo (tránh treo build khi prerender trang).
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PNBmarket/1.0)' },
      next: { revalidate: 1800 },
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error(url + ' ' + r.status);
    return await r.text();
  } finally {
    clearTimeout(t);
  }
}

/* ------------------------------ Google Trends ------------------------------ */

const TREND_URLS = [
  'https://trends.google.com/trending/rss?geo=VN',
  'https://trends.google.com.vn/trending/rss?geo=VN',
  'https://trends.google.com/trends/trendingsearches/daily/rss?geo=VN',
];

// Bỏ dấu tiếng Việt để so khớp từ khoá cho chắc.
function deaccent(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

// Chỉ giữ chủ đề thuộc tài chính / kinh doanh / công nghệ. Đây là whitelist có chủ đích:
// Google Trends VN phần lớn là giải trí, nếu không lọc thì khối này thành rác.
const TOPIC_KEYWORDS = [
  'vang', 'gia vang', 'ty gia', 'usd', 'do la', 'ngoai te', 'lai suat', 'ngan hang', 'tin dung',
  'chung khoan', 'co phieu', 'vn-index', 'vnindex', 'trai phieu', 'quy dau tu', 'ipo', 'niem yet',
  'bitcoin', 'btc', 'ethereum', 'crypto', 'tien ao', 'tien so', 'blockchain',
  'bat dong san', 'dat nen', 'chung cu', 'lam phat', 'gdp', 'xuat khau', 'nhap khau', 'thue',
  'doanh nghiep', 'cong ty', 'tap doan', 'startup', 'khoi nghiep', 'ceo', 'pha san', 'sa thai',
  'kinh doanh', 'kinh te', 'thi truong', 'gia xang', 'gia dien',
  'marketing', 'quang cao', 'thuong hieu', 'tiktok shop', 'shopee', 'lazada', 'thuong mai dien tu',
  'cong nghe', 'ai', 'chatgpt', 'openai', 'google', 'apple', 'iphone', 'samsung', 'tesla', 'nvidia',
  'meta', 'microsoft', 'amazon', 'vinfast', 'vingroup', 'fpt', 'viettel', 'vnpay', 'momo',
];

// Chặn cứng mấy nhóm nhiễu hay gặp, kể cả khi lỡ khớp từ khoá nào đó.
const NOISE_KEYWORDS = [
  'xo so', 'xsmb', 'xsmn', 'xsmt', 'kqxs', 'lo de', 'soi cau',
  'bong da', 'ty so', 'lich thi dau', 'ngoai hang', 'world cup', 'sea games', 'olympic', 'u23',
  'tu vi', 'lich am', 'phim', 'hoa hau', 'ca si', 'concert', 'showbiz', 'sao viet', 'drama',
  'thoi tiet', 'bao so', 'tai nan', 'diem thi', 'diem chuan', 'diem san', 'tuyen sinh', 'bo giao duc',
];

// Loại chữ không thuộc bảng chữ cái Latin (vd tiếng Trung, Nga) vì gần như luôn là nhiễu.
function hasNonLatinScript(s) {
  return /[\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\u0600-\u06FF\uAC00-\uD7AF]/.test(String(s || ''));
}

// So khớp theo ranh giới từ, tránh việc từ ngắn như "ai" khớp bừa vào "tai nan", "mai"...
function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesAny(text, keywords) {
  return keywords.some((k) => {
    const kw = deaccent(k).trim();
    if (!kw) return false;
    return new RegExp(`(^|[^a-z0-9])${escapeRe(kw)}([^a-z0-9]|$)`, 'i').test(text);
  });
}

export function isRelevantTrend(title, extraExclude = []) {
  const t = deaccent(title);
  if (!t || t.length < 3) return false;
  if (hasNonLatinScript(title)) return false;
  if (matchesAny(t, NOISE_KEYWORDS)) return false;
  if (matchesAny(t, extraExclude)) return false;
  return matchesAny(t, TOPIC_KEYWORDS);
}

/**
 * Trends đã lọc. Trả [] nếu số mục hợp lệ quá ít (trang sẽ tự ẩn khối thay vì hiện list nhảm).
 */
export async function getTrends(limit = 8, { exclude = [], min = 3 } = {}) {
  for (const url of TREND_URLS) {
    try {
      const xml = await getXml(url);
      const raw = items(xml)
        .map((b) => ({ title: field(b, 'title'), traffic: field(b, 'ht:approx_traffic') }))
        .filter((x) => x.title);
      if (!raw.length) continue;
      const list = raw.filter((x) => isRelevantTrend(x.title, exclude)).slice(0, limit);
      return list.length >= min ? list : [];
    } catch (e) {
      // thử endpoint tiếp theo
    }
  }
  return [];
}

/* --------------------------------- Tin tức -------------------------------- */

// Chia hai nhóm để đảm bảo trang đúng lời hứa "đầu tư & marketing",
// tránh việc feed chứng khoán đăng dày rồi nuốt hết chỗ của tin marketing.
const NEWS_FEEDS = [
  { source: 'VnExpress Kinh doanh', url: 'https://vnexpress.net/rss/kinh-doanh.rss', group: 'invest' },
  { source: 'CafeF Chứng khoán', url: 'https://cafef.vn/thi-truong-chung-khoan.rss', group: 'invest' },
  { source: 'VnExpress Số hoá', url: 'https://vnexpress.net/rss/so-hoa.rss', group: 'invest' },
  { source: 'Advertising Vietnam', url: 'https://advertisingvietnam.com/rss.xml', group: 'marketing' },
  { source: 'Marketing Dive', url: 'https://www.marketingdive.com/feeds/news/', group: 'marketing' },
];

async function fetchFeed(feed, perFeed) {
  try {
    const xml = await getXml(feed.url);
    return items(xml)
      .slice(0, perFeed)
      .map((b) => {
        const title = field(b, 'title');
        const link = field(b, 'link');
        const pub = field(b, 'pubDate');
        if (!title || !link) return null;
        return { title, link, source: feed.source, group: feed.group, date: pub ? new Date(pub).getTime() : 0 };
      })
      .filter(Boolean);
  } catch (e) {
    return []; // bỏ qua feed lỗi, không làm sập trang
  }
}

export async function getNews(limit = 10, { minMarketing = 3 } = {}) {
  const perFeed = 6;
  const results = await Promise.all(NEWS_FEEDS.map((f) => fetchFeed(f, perFeed)));
  const all = results.flat();
  const byDate = (a, b) => b.date - a.date;

  const marketing = all.filter((x) => x.group === 'marketing').sort(byDate);
  const invest = all.filter((x) => x.group === 'invest').sort(byDate);

  const takeMarketing = marketing.slice(0, Math.min(minMarketing, marketing.length));
  const takeInvest = invest.slice(0, Math.max(0, limit - takeMarketing.length));

  return [...takeInvest, ...takeMarketing].sort(byDate).slice(0, limit);
}
