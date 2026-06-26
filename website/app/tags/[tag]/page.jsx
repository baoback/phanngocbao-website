import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import PostCard from '@/app/components/PostCard';

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const t = decodeURIComponent(tag);
  return {
    title: `Chủ đề: ${t} · Phan Ngọc Bảo`,
    description: `Các bài viết về chủ đề ${t}.`,
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const t = decodeURIComponent(tag);
  const posts = getPostsByTag(t);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Chủ đề: {t}</h1>
          <p>{posts.length} bài viết</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Link href="/" className="back-link">← Tất cả bài viết</Link>
          <div className="bento" style={{ marginTop: 18 }}>
            {posts.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
