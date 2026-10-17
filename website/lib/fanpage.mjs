// =================================================================
//  ĐĂNG BÀI LÊN FANPAGE FACEBOOK (dùng cho mục "Bài Fanpage" trong /admin)
//  - Toàn bộ logic nằm ở đây để kiểm thử được (fetch được truyền vào).
//  - Route app/api/fanpage/route.js chỉ nối request + biến môi trường vào đây.
//  - Nội dung bài đọc từ bản ĐÃ LƯU trên GitHub (nguồn gốc duy nhất).
// =================================================================
import matter from 'gray-matter';

export const REPO = 'baoback/phanngocbao-website';
export const BRANCH = 'main';
export const FANPAGE_DIR = 'website/content/fanpage/';
export const BLOG_DIR = 'website/content/blog/';
export const SITE_URL = 'https://phanngocbao.vn';
export const DEFAULT_GRAPH_VERSION = 'v23.0';
export const MAX_IMAGES = 10;
export const MIN_SCHEDULE_MS = 10 * 60 * 1000 + 30 * 1000; // 10 phút + 30 giây dự phòng
export const MAX_SCHEDULE_MS = 30 * 24 * 60 * 60 * 1000; // 30 ngày
const TIMEOUT_MS = 15000;

export const STATUS_LABELS = {
  draft: 'Nháp',
  scheduled: 'Đã hẹn giờ',
  published: 'Đã đăng',
};

export class FanpageError extends Error {
  constructor(message, status = 400, code = 'bad_request') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---------- Hàm thuần (unit test) ----------

/** Đường dẫn file bài fanpage hợp lệ: nằm trong thư mục fanpage, đuôi .md, không có "..". */
export function isSafeEntryPath(p) {
  if (typeof p !== 'string') return false;
  if (!p.startsWith(FANPAGE_DIR) || !p.endsWith('.md')) return false;
  const rest = p.slice(FANPAGE_DIR.length);
  return rest.length > 3 && !rest.includes('/') && !rest.includes('..') && !rest.includes('\\');
}

/** Slug bài blog hợp lệ (ASCII, không dấu). */
export function isSafeSlug(s) {
  return typeof s === 'string' && /^[a-z0-9][a-z0-9-]{0,150}$/i.test(s);
}

/**
 * Đổi giờ hẹn sang mili-giây. Chuỗi không có múi giờ được hiểu là giờ Việt Nam (+07:00).
 * Trả về NaN nếu không đọc được.
 */
export function parseScheduledAt(v) {
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'number') return v < 1e12 ? v * 1000 : v;
  if (typeof v !== 'string' || !v.trim()) return NaN;
  let s = v.trim().replace(' ', 'T');
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) s += ':00';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(s)) s += '+07:00';
  return Date.parse(s);
}

/** Kiểm tra giờ hẹn theo giới hạn của Facebook. Trả về chuỗi lỗi hoặc null. */
export function validateSchedule(ms, now = Date.now()) {
  if (!Number.isFinite(ms)) return 'Giờ hẹn không hợp lệ. Hãy chọn lại ngày và giờ.';
  if (ms - now < MIN_SCHEDULE_MS) return 'Giờ hẹn phải cách hiện tại ít nhất 11 phút (Facebook yêu cầu tối thiểu 10 phút).';
  if (ms - now > MAX_SCHEDULE_MS) return 'Facebook chỉ cho hẹn giờ tối đa 30 ngày tính từ bây giờ.';
  return null;
}

/** Ảnh tương đối (/uploads/...) → link tuyệt đối trên website. */
export function toAbsoluteUrl(src, site = SITE_URL) {
  if (typeof src !== 'string') return '';
  const s = src.trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('//')) return 'https:' + s;
  return site.replace(/\/$/, '') + (s.startsWith('/') ? s : '/' + s);
}

function normImages(images) {
  if (!images) return [];
  const arr = Array.isArray(images) ? images : [images];
  return arr
    .map((x) => (x && typeof x === 'object' ? x.image || x.src || '' : x))
    .filter((x) => typeof x === 'string' && x.trim())
    .map((x) => x.trim());
}

function isHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Dựng nội dung sẽ gửi Facebook từ dữ liệu bài.
 * - Có ảnh: bài ảnh/album; link (nếu có) được thêm vào cuối nội dung.
 * - Không ảnh: bài chữ, link hiện dạng thẻ xem trước.
 */
export function buildPostSpec(data = {}, site = SITE_URL) {
  const raw = typeof data.message === 'string' ? data.message.replace(/\r\n/g, '\n').trim() : '';
  const link = typeof data.link === 'string' ? data.link.trim() : '';
  const images = normImages(data.images).map((x) => toAbsoluteUrl(x, site));

  if (!raw && !link && images.length === 0) {
    throw new FanpageError('Bài chưa có nội dung, ảnh hay link nào để đăng.');
  }
  if (link && !isHttpUrl(link)) {
    throw new FanpageError('Link đính kèm không hợp lệ (phải bắt đầu bằng https://).');
  }
  if (images.length > MAX_IMAGES) {
    throw new FanpageError(`Mỗi bài tối đa ${MAX_IMAGES} ảnh (đang có ${images.length}).`);
  }
  for (const img of images) {
    if (!isHttpUrl(img)) throw new FanpageError(`Ảnh không hợp lệ: ${img}`);
  }

  let message = raw;
  if (images.length && link && !raw.includes(link)) {
    message = raw ? `${raw}\n\n${link}` : link;
  }
  return { message, link: images.length ? '' : link, images };
}

/** So sánh nội dung đang mở trong trình soạn với bản đã lưu (để bắt "chưa bấm Lưu"). */
export function sameContent(a = {}, b = {}) {
  const n = (d) => ({
    m: typeof d.message === 'string' ? d.message.replace(/\r\n/g, '\n').trim() : '',
    l: typeof d.link === 'string' ? d.link.trim() : '',
    i: normImages(d.images).join('|'),
  });
  const x = n(a);
  const y = n(b);
  return x.m === y.m && x.l === y.l && x.i === y.i;
}

/** Đổi lỗi Graph API sang tiếng Việt dễ hiểu. */
export function mapGraphError(err = {}) {
  const code = Number(err.code);
  const sub = Number(err.error_subcode);
  const msg = String(err.message || '');
  if (code === 190 || code === 102 || sub === 463 || sub === 460) {
    return 'Mã truy cập Facebook đã hết hạn hoặc không còn hợp lệ. Cần tạo mã Page mới rồi dán lại vào Vercel (biến FB_PAGE_TOKEN).';
  }
  if (code === 10 || code === 200 || (code >= 200 && code <= 299)) {
    return 'Mã truy cập thiếu quyền đăng bài (cần pages_manage_posts và pages_read_engagement, và bạn phải là quản trị viên Page).';
  }
  if (code === 4 || code === 17 || code === 32 || code === 613) {
    return 'Facebook đang giới hạn số lần gọi. Đợi vài phút rồi thử lại.';
  }
  if (code === 324 || code === 1366046 || (code === 100 && /image|photo|url/i.test(msg))) {
    return `Facebook không tải được ảnh. Kiểm tra ảnh còn mở được bằng trình duyệt. (${msg})`;
  }
  if (code === 368) return 'Facebook tạm chặn hành động này vì nghi là spam. Thử lại sau.';
  if (code === 506) return 'Nội dung trùng với bài vừa đăng gần đây, Facebook không cho đăng lặp.';
  return `Facebook báo lỗi: ${msg || 'không rõ nguyên nhân'}${code ? ` (mã ${code})` : ''}`;
}

export function postUrl(postId) {
  return `https://www.facebook.com/${postId}`;
}

// ---------- Gọi mạng ----------

async function timedFetch(fetchImpl, url, opts = {}, ms = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetchImpl(url, { ...opts, signal: ctrl.signal });
  } catch (e) {
    if (e && e.name === 'AbortError') throw new FanpageError('Hết thời gian chờ phản hồi, thử lại sau.', 504, 'timeout');
    throw new FanpageError('Không kết nối được: ' + (e && e.message ? e.message : e), 502, 'network');
  } finally {
    clearTimeout(t);
  }
}

export function makeGraph(fetchImpl, token, version = DEFAULT_GRAPH_VERSION) {
  const base = `https://graph.facebook.com/${version}`;
  return async function graph(path, { method = 'GET', params = {} } = {}) {
    const body = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue;
      body.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    }
    body.set('access_token', token);
    let url = base + path;
    const opts = { method };
    if (method === 'GET' || method === 'DELETE') {
      url += (url.includes('?') ? '&' : '?') + body.toString();
    } else {
      opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      opts.body = body.toString();
    }
    const r = await timedFetch(fetchImpl, url, opts);
    let json = {};
    try {
      json = await r.json();
    } catch {
      json = {};
    }
    if (!r.ok || json.error) {
      const e = new FanpageError(mapGraphError(json.error || { message: 'HTTP ' + r.status }), 502, 'graph');
      e.graph = json.error || null;
      throw e;
    }
    return json;
  };
}

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'phanngocbao-fanpage',
  };
}

/** Người gọi phải đăng nhập /admin bằng GitHub và có quyền ghi vào repo. */
export async function verifyRepoAccess(fetchImpl, ghToken) {
  if (!ghToken || typeof ghToken !== 'string' || ghToken.length < 20) {
    throw new FanpageError('Bạn cần đăng nhập trang quản trị để dùng chức năng này.', 401, 'unauthorized');
  }
  const r = await timedFetch(fetchImpl, `https://api.github.com/repos/${REPO}`, { headers: ghHeaders(ghToken) });
  if (r.status === 401) throw new FanpageError('Phiên đăng nhập quản trị đã hết hạn. Đăng xuất và đăng nhập lại /admin.', 401, 'unauthorized');
  if (!r.ok) throw new FanpageError('Không xác minh được quyền quản trị.', 403, 'forbidden');
  const repo = await r.json();
  if (!repo.permissions || !repo.permissions.push) {
    throw new FanpageError('Tài khoản này không có quyền quản trị website.', 403, 'forbidden');
  }
  return true;
}

export async function getRepoFile(fetchImpl, ghToken, path) {
  const url = `https://api.github.com/repos/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`;
  const r = await timedFetch(fetchImpl, url, { headers: ghHeaders(ghToken), cache: 'no-store' });
  if (r.status === 404) throw new FanpageError('Chưa tìm thấy bài đã lưu. Hãy bấm Lưu (Publish) bài trước rồi mới đăng.', 404, 'not_saved');
  if (!r.ok) throw new FanpageError('Không đọc được bài từ GitHub (HTTP ' + r.status + ').', 502, 'github');
  const json = await r.json();
  const raw = Buffer.from(json.content || '', 'base64').toString('utf-8');
  const parsed = matter(raw, {}); // truyền {} để gray-matter không dùng cache
  return { sha: json.sha, data: parsed.data || {}, body: parsed.content || '' };
}

export async function putRepoFile(fetchImpl, ghToken, path, { data, body, sha, message }) {
  const text = matter.stringify(body || '', data);
  const r = await timedFetch(fetchImpl, `https://api.github.com/repos/${REPO}/contents/${encodeURI(path)}`, {
    method: 'PUT',
    headers: { ...ghHeaders(ghToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(text, 'utf-8').toString('base64'),
      sha,
      branch: BRANCH,
    }),
  });
  return r.ok;
}

/** Ảnh phải mở được từ Internet thì Facebook mới tải được. */
export async function checkImagesReachable(fetchImpl, images) {
  const results = await Promise.all(
    images.map(async (url) => {
      try {
        const r = await timedFetch(fetchImpl, url, { method: 'HEAD', redirect: 'follow' }, 8000);
        if (r.status === 404 || r.status === 410) return url;
        const type = r.headers && r.headers.get ? r.headers.get('content-type') : '';
        if (r.ok && type && /text\/html/i.test(type)) return url;
        return null;
      } catch {
        return null; // mạng chập chờn thì để Facebook tự thử
      }
    })
  );
  const bad = results.filter(Boolean);
  if (bad.length) {
    throw new FanpageError(
      `Chưa mở được ${bad.length} ảnh: ${bad.join(', ')}. Nếu vừa tải ảnh lên, đợi 1–2 phút để website cập nhật rồi bấm lại.`,
      409,
      'image_not_ready'
    );
  }
}

// ---------- Các thao tác ----------

function fbState(status, extra = {}) {
  return {
    status,
    statusLabel: STATUS_LABELS[status] || status,
    postId: '',
    url: '',
    scheduledAt: '',
    publishedAt: '',
    ...extra,
    updatedAt: new Date().toISOString(),
  };
}

async function getPage(graph) {
  try {
    const me = await graph('/me', { params: { fields: 'id,name,category' } });
    return { id: me.id, name: me.name };
  } catch (e) {
    if (e.graph && Number(e.graph.code) === 100) {
      throw new FanpageError('Mã đang dán vào Vercel là mã người dùng, không phải mã Page. Cần lấy "Page access token" của fanpage.', 400, 'not_page_token');
    }
    throw e;
  }
}

async function createPost(graph, pageId, spec, scheduledMs) {
  const scheduled = Number.isFinite(scheduledMs);
  const mediaIds = await Promise.all(
    spec.images.map((url) =>
      graph(`/${pageId}/photos`, {
        method: 'POST',
        params: { url, published: 'false', temporary: scheduled ? 'true' : undefined },
      }).then((r) => r.id)
    )
  );
  const params = { message: spec.message || undefined };
  if (mediaIds.length) params.attached_media = mediaIds.map((id) => ({ media_fbid: id }));
  if (spec.link) params.link = spec.link;
  if (scheduled) {
    params.published = 'false';
    params.scheduled_publish_time = Math.floor(scheduledMs / 1000);
  }
  const res = await graph(`/${pageId}/feed`, { method: 'POST', params });
  let url = postUrl(res.id);
  try {
    const info = await graph(`/${res.id}`, { params: { fields: 'permalink_url' } });
    if (info.permalink_url) url = info.permalink_url;
  } catch {
    // không lấy được permalink thì dùng link mặc định
  }
  return { postId: res.id, url };
}

/**
 * Chạy một thao tác. Trả về { status, json }.
 * body: { action, path?, slug?, scheduledAt?, editor? }
 */
export async function runAction({ fetchImpl = fetch, env = {}, ghToken, body = {}, now = Date.now() }) {
  try {
    const action = body.action;
    await verifyRepoAccess(fetchImpl, ghToken);

    // Tạo nhanh từ bài blog: không cần Facebook
    if (action === 'blog') {
      if (!isSafeSlug(body.slug)) throw new FanpageError('Bài blog không hợp lệ.');
      const site = env.SITE_URL || SITE_URL;
      const f = await getRepoFile(fetchImpl, ghToken, `${BLOG_DIR}${body.slug}.md`).catch((e) => {
        if (e.code === 'not_saved') throw new FanpageError('Không tìm thấy bài blog này.', 404, 'not_found');
        throw e;
      });
      return {
        status: 200,
        json: {
          ok: true,
          title: f.data.title || body.slug,
          description: f.data.description || '',
          cover: f.data.cover ? toAbsoluteUrl(String(f.data.cover), site) : '',
          url: `${site}/blog/${body.slug}/`,
        },
      };
    }

    const token = env.FB_PAGE_TOKEN;
    if (!token) {
      if (action === 'status') return { status: 200, json: { ok: true, configured: false } };
      throw new FanpageError('Chưa kết nối Facebook: thiếu biến FB_PAGE_TOKEN trên Vercel.', 400, 'not_configured');
    }
    const graph = makeGraph(fetchImpl, token, env.FB_GRAPH_VERSION || DEFAULT_GRAPH_VERSION);

    if (action === 'status') {
      const page = await getPage(graph);
      return { status: 200, json: { ok: true, configured: true, pageName: page.name, pageId: page.id } };
    }

    if (!isSafeEntryPath(body.path)) throw new FanpageError('Đường dẫn bài không hợp lệ. Hãy lưu bài trước.');
    const file = await getRepoFile(fetchImpl, ghToken, body.path);
    const current = file.data.facebook || {};
    const slug = body.path.slice(FANPAGE_DIR.length, -3);
    let next;

    if (action === 'publish' || action === 'schedule') {
      if (current.status === 'published') throw new FanpageError('Bài này đã được đăng lên fanpage rồi.', 409, 'already_published');
      if (current.status === 'scheduled') throw new FanpageError('Bài này đã được hẹn giờ. Huỷ hẹn giờ trước nếu muốn đổi.', 409, 'already_scheduled');
      if (body.editor && !sameContent(body.editor, file.data)) {
        throw new FanpageError('Bạn có thay đổi chưa lưu. Bấm Lưu (Publish) bài trước, rồi mới đăng.', 409, 'unsaved');
      }
      let scheduledMs = NaN;
      if (action === 'schedule') {
        scheduledMs = parseScheduledAt(body.scheduledAt);
        const err = validateSchedule(scheduledMs, now);
        if (err) throw new FanpageError(err);
      }
      const spec = buildPostSpec(file.data, env.SITE_URL || SITE_URL);
      await checkImagesReachable(fetchImpl, spec.images);
      const page = await getPage(graph);
      const created = await createPost(graph, page.id, spec, scheduledMs);
      next =
        action === 'schedule'
          ? fbState('scheduled', { ...created, scheduledAt: new Date(scheduledMs).toISOString(), pageName: page.name })
          : fbState('published', { ...created, publishedAt: new Date(now).toISOString(), pageName: page.name });
    } else if (action === 'cancel') {
      if (current.status !== 'scheduled' || !current.postId) throw new FanpageError('Bài này không ở trạng thái hẹn giờ.', 409, 'not_scheduled');
      try {
        await graph(`/${current.postId}`, { method: 'DELETE' });
      } catch (e) {
        // Bài đã bị xoá bên Facebook thì vẫn coi như huỷ xong
        if (!(e.graph && Number(e.graph.code) === 100)) throw e;
      }
      next = fbState('draft');
    } else if (action === 'refresh') {
      if (current.status !== 'scheduled' || !current.postId) {
        return { status: 200, json: { ok: true, changed: false, facebook: current } };
      }
      const info = await graph(`/${current.postId}`, { params: { fields: 'is_published,permalink_url,created_time' } });
      if (!info.is_published) return { status: 200, json: { ok: true, changed: false, facebook: current } };
      next = fbState('published', {
        postId: current.postId,
        url: info.permalink_url || current.url || postUrl(current.postId),
        pageName: current.pageName || '',
        publishedAt: current.scheduledAt || new Date(now).toISOString(),
      });
    } else if (action === 'reset') {
      if (current.status === 'scheduled') throw new FanpageError('Bài đang hẹn giờ. Bấm "Huỷ hẹn giờ" thay vì xoá trạng thái.', 409, 'is_scheduled');
      next = fbState('draft');
    } else {
      throw new FanpageError('Thao tác không hợp lệ.');
    }

    const saved = await putRepoFile(fetchImpl, ghToken, body.path, {
      data: { ...file.data, facebook: next },
      body: file.body,
      sha: file.sha,
      message: `Fanpage: ${next.statusLabel} — ${slug}`,
    }).catch(() => false);

    return { status: 200, json: { ok: true, changed: true, saved, facebook: next } };
  } catch (e) {
    if (e instanceof FanpageError) {
      return { status: e.status, json: { ok: false, code: e.code, error: e.message } };
    }
    return { status: 500, json: { ok: false, code: 'internal', error: 'Lỗi không mong muốn: ' + (e && e.message ? e.message : String(e)) } };
  }
}
