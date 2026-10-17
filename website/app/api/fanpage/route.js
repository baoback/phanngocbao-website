// API cho mục "Bài Fanpage" trong /admin: kiểm tra kết nối, đăng ngay, hẹn giờ, huỷ hẹn giờ...
// Bảo mật: chỉ người đã đăng nhập /admin (GitHub, có quyền ghi repo) mới gọi được.
// Mã truy cập Page nằm ở biến môi trường FB_PAGE_TOKEN trên Vercel, không nằm trong code/CMS.
import { runAction } from '@/lib/fanpage.mjs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function bearer(request) {
  const h = request.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

const ENV = () => ({
  FB_PAGE_TOKEN: process.env.FB_PAGE_TOKEN,
  FB_GRAPH_VERSION: process.env.FB_GRAPH_VERSION,
  SITE_URL: process.env.SITE_URL,
});

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Dữ liệu gửi lên không hợp lệ.' });
  }
  const { status, json: data } = await runAction({ env: ENV(), ghToken: bearer(request), body });
  return json(status, data);
}

export async function GET() {
  return json(405, { ok: false, error: 'Dùng POST.' });
}
