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

export function getAbout() {
  const raw = fs.readFileSync(ABOUT_FILE, 'utf-8');
  const { data, content } = matter(raw);
  return {
    name: data.name || '',
    role: data.role || '',
    avatar: data.avatar || null,
    tagline: data.tagline || '',
    email: data.email || '',
    linkedin: data.linkedin || '',
    facebook: data.facebook || '',
    heroEyebrow: data.heroEyebrow || '',
    heroTitle: data.heroTitle || '',
    heroImage: data.heroImage || '',
    lead: data.lead || '',
    stats: Array.isArray(data.stats) ? data.stats : [],
    storyBlocks: Array.isArray(data.storyBlocks) ? data.storyBlocks : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    ctaTitle: data.ctaTitle || '',
    ctaText: data.ctaText || '',
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
    order: typeof data.order === 'number' ? data.order : 999,
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

export function getProjectBySlug(slug) {
  const fp = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const p = readProjectFile(`${slug}.md`);
  return { ...p, html: marked.parse(p.content) };
}
