// Route handler: dữ liệu thị trường (server-side, không cần API key, tránh CORS).
// Nguồn: Yahoo Finance (vàng thế giới, USD/VND, crypto, S&P 500) + VNDirect (VN-Index).
// Nguyên tắc: nguồn lỗi thì card VẪN hiện với trạng thái "chưa có dữ liệu", không biến mất im lặng.
export const revalidate = 300;

const YQ = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const VNDIRECT = 'https://dchart-api.vndirect.com.vn/dchart/history';
// Bảo Tín Minh Châu: API công khai, trả XML, giá theo VNĐ/chỉ. Chỉ có vàng BTMC, không có vàng miếng SJC.
const BTMC = 'http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v';
const TIMEOUT_MS = 6000;

const SYMBOLS = [
  { key: 'vnindex', label: 'VN-Index', unit: 'điểm', src: 'vndirect', code: 'VNINDEX', digits: 2 },
  { key: 'goldvn', label: 'Vàng BTMC', unit: 'triệu đ/lượng', src: 'btmc', digits: 2 },
  { key: 'gold', label: 'Vàng thế giới', unit: 'USD/oz', src: 'yahoo', y: 'GC=F', digits: 1 },
  { key: 'usdvnd', label: 'USD / VND', unit: 'VND', src: 'yahoo', y: 'VND=X', digits: 0 },
  { key: 'btc', label: 'Bitcoin', unit: 'USD', src: 'yahoo', y: 'BTC-USD', digits: 0 },
  { key: 'eth', label: 'Ethereum', unit: 'USD', src: 'yahoo', y: 'ETH-USD', digits: 0 },
  { key: 'sp500', label: 'S&P 500', unit: 'điểm', src: 'yahoo', y: '%5EGSPC', digits: 1 },
];

// fetch có timeout để route không bao giờ treo.
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

// Tính giá + % thay đổi + sparkline từ mảng giá đóng cửa.
function fromCloses(closes, priceOverride, prevOverride) {
  const c = (closes || []).filter((x) => x != null && !Number.isNaN(x));
  const price = priceOverride ?? c[c.length - 1];
  const prev = prevOverride ?? c[c.length - 2] ?? price;
  if (price == null) throw new Error('no price');
  const changePct = prev ? ((price - prev) / prev) * 100 : null;
  return { price, changePct, spark: c.slice(-7) };
}

async function fromYahoo(sym) {
  const j = await getJson(`${YQ}${sym}?range=1mo&interval=1d`);
  const res = j?.chart?.result?.[0];
  if (!res) throw new Error('no result');
  const closes = res.indicators?.quote?.[0]?.close || [];
  return fromCloses(closes, res.meta?.regularMarketPrice, res.meta?.chartPreviousClose);
}

// VN-Index: Yahoo không hỗ trợ ^VNINDEX nên dùng VNDirect (định dạng UDF của TradingView).
async function fromVnDirect(code) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 60 * 24 * 60 * 60; // 60 ngày gần nhất
  const j = await getJson(`${VNDIRECT}?symbol=${code}&resolution=D&from=${from}&to=${to}`);
  if (j?.s !== 'ok' || !Array.isArray(j?.c) || j.c.length === 0) throw new Error('vndirect empty');
  return fromCloses(j.c);
}

// Vàng Bảo Tín Minh Châu (Rồng Thăng Long 999.9). API trả XML với pb_1 (mua) và ps_1 (bán), đơn vị VNĐ/chỉ.
async function fromBtmc() {
  const ctrl = new AbortController();
  // BTMC là máy chủ trong nước, gọi từ vùng nước ngoài có thể chậm nên nới timeout.
  const t = setTimeout(() => ctrl.abort(), 9000);
  let xml;
  try {
    const r = await fetch(BTMC, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        Accept: 'application/xml, text/xml, */*',
      },
      next: { revalidate: 300 },
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error('btmc http ' + r.status);
    xml = await r.text();
  } finally {
    clearTimeout(t);
  }
  const sell = Number((xml.match(/ps_1="(\d+)"/) || [])[1]);
  const buy = Number((xml.match(/pb_1="(\d+)"/) || [])[1]);
  if (!sell) throw new Error('btmc no price');
  const toLuong = (vndPerChi) => (vndPerChi * 10) / 1e6; // VNĐ/chỉ -> triệu đồng/lượng
  return {
    price: toLuong(sell),
    changePct: null,
    spark: [],
    note: buy ? `mua vào ${toLuong(buy).toFixed(2)}` : 'giá bán ra',
  };
}

async function resolveOne(s) {
  const base = { key: s.key, label: s.label, unit: s.unit, digits: s.digits };
  try {
    let d;
    if (s.src === 'vndirect') d = await fromVnDirect(s.code);
    else if (s.src === 'btmc') d = await fromBtmc();
    else d = await fromYahoo(s.y);
    return { ...base, ...d, ok: true };
  } catch (e) {
    // Không nuốt card: trả ô rỗng để giao diện hiện "--" thay vì mất hẳn.
    // Kèm lý do lỗi để dễ chẩn đoán khi một nguồn chết.
    return {
      ...base,
      price: null,
      changePct: null,
      spark: [],
      ok: false,
      err: String((e && e.message) || e || 'error').slice(0, 90),
    };
  }
}

export async function GET() {
  const settled = await Promise.allSettled(SYMBOLS.map(resolveOne));
  const items = settled.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    const s = SYMBOLS[i];
    return {
      key: s.key,
      label: s.label,
      unit: s.unit,
      digits: s.digits,
      price: null,
      changePct: null,
      spark: [],
      ok: false,
    };
  });
  const failed = items.filter((x) => !x.ok).map((x) => x.key);
  return Response.json(
    { updatedAt: new Date().toISOString(), items, failed },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } }
  );
}
