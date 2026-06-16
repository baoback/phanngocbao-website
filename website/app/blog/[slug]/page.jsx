import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import ShareBar from '@/app/components/ShareBar';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} · Phan Ngọc Bảo`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : [],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const dateStr = new Date(post.pubDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const url = `https://phanngocbao.vn/blog/${slug}/`;

  return (
    <article className="post container">
      <Link href="/" className="back-link">← Tất cả bài viết</Link>
      {post.cover && <img className="cover" src={post.cover} alt={post.title} />}
      <h1>{post.title}</h1>
      <div className="post-meta">
        {dateStr}
        {post.tags.length > 0 && (
          <>
            {' · '}
            {post.tags.map((t, i) => (
              <span key={t}>
                {i > 0 ? ', ' : ''}
                <Link href={`/tags/${encodeURIComponent(t)}/`}>{t}</Link>
              </span>
            ))}
          </>
        )}
      </div>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      <ShareBar url={url} title={post.title} />
    </article>
  );
}
