import { getAllPosts, getAllProjects, CATEGORIES, categorySlug } from '@/lib/posts';

const BASE = 'https://phanngocbao.vn';

export default function sitemap() {
  const staticPages = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/portfolio`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/market-trend`, changeFrequency: 'daily', priority: 0.8 },
  ];

  const categories = CATEGORIES.map((c) => ({
    url: `${BASE}/${categorySlug(c)}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const posts = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}/`,
    lastModified: p.pubDate ? new Date(p.pubDate) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const projects = getAllProjects().map((p) => ({
    url: `${BASE}/portfolio/${p.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...categories, ...posts, ...projects];
}
