// Route handler: các mã cổ phiếu đáng chú ý trong rổ theo dõi (bấm vào card VN-Index để xem).
// Nguồn: VNDirect (định dạng UDF của TradingView) — cùng nguồn đang dùng cho VN-Index.
// Giá trả về theo đơn vị nghìn đồng/cổ phiếu.
export const revalidate = 300;

const VNDIRECT = 'https://dchart-api.vndirect.com.vn/dchart/history';
const TIMEOUT_MS = 6000;

// Rổ mặc định: các mã vốn hoá lớn, thanh khoản cao. Có thể ghi đè bằng ?codes=...
const DEFAULT_CODES = ['VCB', 'VIC', 'VHM', 'HPG', 'FPT', 'MWG', 'MSN', 'TCB', 'SSI', 'VNM', 'GAS', 'VPB'];

async function getJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PNBmarket/1.0)' },
      next: { revalidate: 300 },
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error('http ' + r.status);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

async function one(code) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 20 * 24 * 60 * 60; // 20 ngày gần nhất là đủ để có 2 phiên gần nhất
  const j = await getJson(`${VNDIRECT}?symbol=${code}&resolution=D&from=${from}&to=${to}`);
  const c = (j?.c || []).filter((x) => x != null && !Number.isNaN(x));
  if (j?.s !== 'ok' || c.length === 0) throw new Error('empty');
  const price = c[c.length - 1];
  const prev = c[c.length - 2] ?? price;
  const vol = Array.isArray(j?.v) ? j.v[j.v.length - 1] : null;
  return {
    code,
    price,
    changePct: prev ? ((price - prev) / prev) * 100 : null,
    vol: vol != null ? Number(vol) : null,
    spark: c.slice(-7),
  };
}

export async function GET(request) {
  let codes = [];
  try {
    const raw = new URL(request.url).searchParams.get('codes') || '';
    codes = raw
      .toUpperCase()
      .split(',')
      .map((s) => s.trim())
      .filter((s) => /^[A-Z0-9]{3,5}$/.test(s));
  } catch (e) {
    codes = [];
  }
  if (codes.length === 0) codes = DEFAULT_CODES;
  codes = Array.from(new Set(codes)).slice(0, 15);

  const settled = await Promise.allSettled(codes.map(one));
  const items = settled.filter((r) => r.status === 'fulfilled').map((r) => r.value);

  // Sắp xếp theo biên độ biến động lớn nhất: đây chính là "mã đang nóng" của phiên.
  items.sort((a, b) => Math.abs(b.changePct ?? 0) - Math.abs(a.changePct ?? 0));

  return Response.json(
    { updatedAt: new Date().toISOString(), items },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } }
  );
}
