import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const ABOUT_FILE = path.join(process.cwd(), 'content', 'about.md');

function readPostFile(file) {
  const slug = file.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    pubDate: data.pubDate ? new Date(data.pubDate).toISOString() : new Date().toISOString(),
    cover: data.cover || null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    category: data.category || '',
    draft: !!data.draft,
    content,
  };
}

export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readPostFile)
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

function slugifyVi(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function enhanceHtml(html) {
  const headings = [];
  const used = {};
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (m, lvl, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugifyVi(text) || 'muc';
    if (used[id]) { used[id] += 1; id = `${id}-${used[id]}`; } else { used[id] = 1; }
    headings.push({ id, text, level: Number(lvl) });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, headings };
}

export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const post = readPostFile(`${slug}.md`);
  const { html, headings } = enhanceHtml(marked.parse(post.content));
  const words = post.content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));
  return { ...post, html, headings, readingTime };
}

export function getRelatedPosts(slug, tags = [], limit = 3) {
  const scored = getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: p.tags.filter((t) => tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || new Date(b.p.pubDate) - new Date(a.p.pubDate));
  return scored.slice(0, limit).map((s) => s.p);
}

export function getAllTags() {
  const tags = new Set();
  getAllPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
}

export function getPostsByTag(tag) {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export const CATEGORIES = ['Quản trị', 'Marketing', 'Kinh doanh', 'Cuộc sống'];

export function categorySlug(c) {
  return slugifyVi(c || '');
}

export function getPostsByCategory(cat) {
  return getAllPosts().filter((p) => p.category === cat);
}

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => slugifyVi(c) === slug) || '';
}

export function getAbout() {
  const raw = fs.readFileSync(ABOUT_FILE, 'utf-8');
  const { data, content } = matter(raw);
  return {
    name: data.name || '',
    role: data.role || '',
    avatar: data.avatar || null,
    tagline: data.tagline || '',
    email: data.email || '',
    phone: data.phone || '',
    socials: Array.isArray(data.socials) ? data.socials.filter((x) => x && x.url) : [],
    heroEyebrow: data.heroEyebrow || '',
    heroTitle: data.heroTitle || '',
    heroImage: data.heroImage || '',
    heroPortrait: data.heroPortrait || '',
    heroBadge: data.heroBadge || '',
    heroRotatePrefix: data.heroRotatePrefix || '',
    heroWords: Array.isArray(data.heroWords)
      ? data.heroWords.map((x) => (typeof x === 'string' ? x : x && x.word)).filter(Boolean)
      : [],
    heroCtaPrimaryLabel: data.heroCtaPrimaryLabel || '',
    heroCtaSecondaryLabel: data.heroCtaSecondaryLabel || '',
    heroContactLabel: data.heroContactLabel || '',
    heroContactHref: data.heroContactHref || '#contact',
    lead: data.lead || '',
    stats: Array.isArray(data.stats) ? data.stats : [],
    journey: Array.isArray(data.journey) ? data.journey : [],
    life: Array.isArray(data.life) ? data.life : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    toolkit: Array.isArray(data.toolkit) ? data.toolkit : [],
    ctaTitle: data.ctaTitle || '',
    ctaText: data.ctaText || '',
    showcaseTitle: data.showcaseTitle || '',
    showcaseSubtitle: data.showcaseSubtitle || '',
    showcaseImages: Array.isArray(data.showcaseImages)
      ? data.showcaseImages.map((x) => (typeof x === 'string' ? x : x && x.image)).filter(Boolean)
      : [],
    html: marked.parse(content),
  };
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const SETTINGS_FILE = path.join(process.cwd(), 'content', 'site.json');

const DEFAULT_SETTINGS = {
  brandName: 'Phan Ngọc Bảo',
  brandSuffix: 'Marketing',
  navBlog: 'Bài viết',
  searchPlaceholder: 'Tìm bài viết, chủ đề quản trị, marketing...',
  navProjects: 'Dự án',
  navAbout: 'Hồ sơ',
  navMarket: 'Market Trend',
  heroEyebrow: 'Chiến lược · Thương hiệu · Performance',
  heroTitle: 'Marketing là tư duy hệ thống,',
  heroTitleAccent: 'không phải may rủi.',
  heroSubtitle:
    'Mình chia sẻ cách xây thương hiệu và tối ưu hiệu suất bằng những nguyên tắc thực chiến.',
  heroPrimaryLabel: 'Đọc bài viết mới nhất',
  heroSecondaryLabel: 'Về mình',
  postsTitle: 'Bài viết mới nhất',
  postsSubtitle: 'Góc nhìn Marketing được cập nhật thường xuyên.',
  ctaTitle: 'Bạn đang tìm người đồng hành cho bài toán Marketing?',
  ctaText: 'Xem câu chuyện sự nghiệp, các dự án thực chiến và cách mình tư duy hệ thống.',
  ctaButton: 'Khám phá hồ sơ & kết nối',
  footerNote: 'Blog Marketing & Hồ sơ cá nhân',
  newsletterTitle: 'Nhận bài viết mới qua email',
  newsletterText: 'Mỗi tuần một góc nhìn Marketing thực chiến, không spam.',
  newsletterButton: 'Đăng ký',
  newsletterAction: '',
  portfolioTitle: 'Dự án thực chiến',
  portfolioSubtitle: 'Một số dự án Marketing mình đã đồng hành.',
  heroImage: '',
  metaTitle: 'Phan Ngọc Bảo · Blog Marketing',
  metaDescription: 'Chiến lược, thương hiệu và performance — góc nhìn Marketing thực chiến của Phan Ngọc Bảo.',
  gaId: '',
  accent: '#B0814C',
};

export function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      return { ...DEFAULT_SETTINGS, ...data };
    }
  } catch (e) {
    // dùng mặc định nếu lỗi
  }
  return DEFAULT_SETTINGS;
}


const PROJECTS_PAGE_FILE = path.join(process.cwd(), 'content', 'projectspage.json');

const DEFAULT_PROJECTS_PAGE = {
  heroEyebrow: 'Portfolio',
  heroTitle: 'Nơi chiến lược gặp kết quả',
  heroSubtitle: 'Mình đồng hành cùng các thương hiệu để xây định vị, tối ưu hiệu suất và tăng trưởng bền vững.',
  heroImage: '',
  heroCtaPrimaryLabel: 'Xem dự án nổi bật',
  heroCtaPrimaryHref: '#du-an',
  heroCtaSecondaryLabel: 'Liên hệ hợp tác',
  heroCtaSecondaryHref: '/about#contact',
  marquee: ['Thương hiệu', 'Performance', 'Content', 'Tăng trưởng', 'SEO'],
  brandsTitle: 'Thương hiệu đã hợp tác',
  brandsSubtitle: '',
  brands: [],
  featuredTitle: 'Dự án nổi bật',
  featuredSubtitle: '',
  servicesTitle: 'Lĩnh vực mình làm',
  servicesSubtitle: '',
  services: [],
  ctaTitle: 'Cùng xây điều đáng nhớ?',
  ctaText: '',
  ctaButtonLabel: 'Kết nối với mình',
  ctaButtonHref: '/about#contact',
};

export function getProjectsPage() {
  try {
    if (fs.existsSync(PROJECTS_PAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROJECTS_PAGE_FILE, 'utf-8'));
      return { ...DEFAULT_PROJECTS_PAGE, ...data };
    }
  } catch (e) {
    // dùng mặc định nếu lỗi
  }
  return DEFAULT_PROJECTS_PAGE;
}

const MARKET_PAGE_FILE = path.join(process.cwd(), 'content', 'marketpage.json');

const DEFAULT_MARKET_PAGE = {
  heroEyebrow: 'Market Trend',
  heroTitle: 'Nhịp thị trường mỗi ngày',
  heroSubtitle:
    'Cập nhật nhanh vàng, tỷ giá, crypto và chứng khoán, cùng tin đầu tư và marketing đáng chú ý trong ngày.',
  manualCards: [],
  trendsTitle: 'Đang được quan tâm ở Việt Nam',
  trendsNote:
    'Lấy từ Google Trends Việt Nam (xu hướng tìm kiếm chung cả nước). Đã lọc bỏ nhóm nhiễu như xổ số, bóng đá, showbiz, phim ảnh, thời tiết, điểm thi, và ưu tiên đưa chủ đề kinh doanh, tài chính, công nghệ lên đầu danh sách.',
  trendsEnabled: true,
  trendsExclude: [],
  trendsManual: [],
  newsTitle: 'Tin đầu tư & marketing mới nhất',
  eventsTitle: 'Lịch sự kiện đáng chú ý',
  events: [],
  newsletterTitle: 'Nhận nhịp thị trường qua email',
  newsletterText: 'Mỗi tuần một bản tin ngắn về đầu tư và marketing, không spam.',
  disclaimer:
    'Thông tin trên trang chỉ mang tính tham khảo, tổng hợp từ nguồn công khai và có thể có độ trễ. Đây không phải khuyến nghị đầu tư. Bạn tự chịu trách nhiệm với quyết định của mình.',
};

const MARKET_DIR = path.join(process.cwd(), 'content', 'market');

function readBriefFile(file) {
  const slug = file.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(MARKET_DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    draft: !!data.draft,
    content,
  };
}

export function getMarketBriefs() {
  if (!fs.existsSync(MARKET_DIR)) return [];
  return fs
    .readdirSync(MARKET_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readBriefFile)
    .filter((b) => !b.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getMarketBriefBySlug(slug) {
  const fp = path.join(MARKET_DIR, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const b = readBriefFile(`${slug}.md`);
  return { ...b, html: marked.parse(b.content) };
}

export function getMarketPage() {
  try {
    if (fs.existsSync(MARKET_PAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(MARKET_PAGE_FILE, 'utf-8'));
      return { ...DEFAULT_MARKET_PAGE, ...data };
    }
  } catch (e) {
    // dùng mặc định nếu lỗi
  }
  return DEFAULT_MARKET_PAGE;
}

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

function readProjectFile(file) {
  const slug = file.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    cover: data.cover || null,
    url: data.url || '',
    role: data.role || '',
    year: data.year ? String(data.year) : '',
    tags: data.tags || '',
    order: typeof data.order === 'number' ? data.order : 999,
    featured: data.featured === undefined ? true : !!data.featured,
    phases: Array.isArray(data.phases) ? data.phases : [],
    metrics: Array.isArray(data.metrics) ? data.metrics : [],
    draft: !!data.draft,
    content,
  };
}

export function getAllProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readProjectFile)
    .filter((p) => !p.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getFeaturedProjects() {
  const all = getAllProjects();
  const f = all.filter((p) => p.featured);
  return f.length ? f : all;
}

export function getProjectBySlug(slug) {
  const fp = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const p = readProjectFile(`${slug}.md`);
  return { ...p, html: marked.parse(p.content) };
}
