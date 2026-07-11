// Route handler: dữ liệu thị trường (server-side, không cần API key, tránh CORS).
// Nguồn chính: Yahoo Finance (giá + % thay đổi + 7 ngày). Fallback: gold-api.com, open.er-api.com.
export const revalidate = 300;

const YQ = 'https://query1.finance.yahoo.com/v8/finance/chart/';

const SYMBOLS = [
  { key: 'gold', label: 'Vàng thế giới', unit: 'USD/oz', y: 'GC=F', digits: 1 },
  { key: 'usdvnd', label: 'USD / VND', unit: 'VND', y: 'VND=X', digits: 0 },
  { key: 'btc', label: 'Bitcoin', unit: 'USD', y: 'BTC-USD', digits: 0 },
  { key: 'eth', label: 'Ethereum', unit: 'USD', y: 'ETH-USD', digits: 0 },
  { key: 'sp500', label: 'S&P 500', unit: 'điểm', y: '%5EGSPC', digits: 1 },
  { key: 'vnindex', label: 'VN-Index', unit: 'điểm', y: '%5EVNINDEX', digits: 2 },
];

async function fromYahoo(sym) {
  const url = `${YQ}${sym}?range=1mo&interval=1d`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PNBmarket/1.0)' },
    next: { revalidate: 300 },
  });
  if (!r.ok) throw new Error('yahoo ' + r.status);
  const j = await r.json();
  const res = j?.chart?.result?.[0];
  if (!res) throw new Error('no result');
  const closes = (res.indicators?.quote?.[0]?.close || []).filter((x) => x != null);
  const price = res.meta?.regularMarketPrice ?? closes[closes.length - 1];
  const prev = res.meta?.chartPreviousClose ?? closes[closes.length - 2] ?? price;
  if (price == null) throw new Error('no price');
  const spark = closes.slice(-7);
  const changePct = prev ? ((price - prev) / prev) * 100 : null;
  return { price, changePct, spark };
}

async function goldFallback() {
  const r = await fetch('https://api.gold-api.com/price/XAU', { next: { revalidate: 300 } });
  const j = await r.json();
  return j?.price ?? null;
}
async function forexFallback() {
  const r = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 300 } });
  const j = await r.json();
  return j?.rates?.VND ?? null;
}
async function coinFallback(sym) {
  const r = await fetch(`https://api.gold-api.com/price/${sym}`, { next: { revalidate: 300 } });
  const j = await r.json();
  return j?.price ?? null;
}

async function resolveOne(s) {
  try {
    const d = await fromYahoo(s.y);
    return { key: s.key, label: s.label, unit: s.unit, digits: s.digits, ...d };
  } catch (e) {
    let price = null;
    try {
      if (s.key === 'usdvnd') price = await forexFallback();
      else if (s.key === 'gold') price = await goldFallback();
      else if (s.key === 'btc') price = await coinFallback('BTC');
      else if (s.key === 'eth') price = await coinFallback('ETH');
    } catch (_) {}
    if (price != null) {
      return { key: s.key, label: s.label, unit: s.unit, digits: s.digits, price, changePct: null, spark: [], partial: true };
    }
    return null;
  }
}

export async function GET() {
  const settled = await Promise.allSettled(SYMBOLS.map(resolveOne));
  const items = settled
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value);
  return Response.json(
    { updatedAt: new Date().toISOString(), items },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } }
  );
}
