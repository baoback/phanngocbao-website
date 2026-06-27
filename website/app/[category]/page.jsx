import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, categorySlug, getCategoryBySlug, getPostsByCategory } from '@/lib/posts';
import PostCard from '@/app/components/PostCard';

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: categorySlug(c) }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = getCategoryBySlug(category);
  if (!c) return {};
  const title = `Bài viết chủ đề ${c} · Phan Ngọc Bảo`;
  const description = `Tổng hợp các bài viết chủ đề ${c} của Phan Ngọc Bảo.`;
  return {
    title,
    description,
    alternates: { canonical: `/${category}` },
    openGraph: { title, description, url: `https://phanngocbao.vn/${category}`, type: 'website' },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const c = getCategoryBySlug(category);
  if (!c) notFound();
  const posts = getPostsByCategory(c);

  return (
    <>
      <section className="page-hero">
        <div className="container reveal-up">
          <h1>Bài viết chủ đề {c}</h1>
          <p>{posts.length} bài viết</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Link href="/#bai-viet" className="back-link">← Tất cả bài viết</Link>
          {posts.length === 0 ? (
            <p className="empty">Chưa có bài viết nào trong chủ đề này.</p>
          ) : (
            <div className="bento" style={{ marginTop: 18 }}>
              {posts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
