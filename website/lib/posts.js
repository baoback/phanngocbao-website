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

export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const post = readPostFile(`${slug}.md`);
  return { ...post, html: marked.parse(post.content) };
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
