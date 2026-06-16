import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import ShareBar from '@/app/components/ShareBar';
import PostCard from '@/app/components/PostCard';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `https://phanngocbao.vn/blog/${slug}/`;
  const images = post.cover ? [post.cover] : [];
  return {
    title: `${post.title} · Phan Ngọc Bảo`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.pubDate,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images,
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
  const related = getRelatedPosts(slug, post.tags, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate,
    dateModified: post.pubDate,
    author: { '@type': 'Person', name: 'Phan Ngọc Bảo', url: 'https://phanngocbao.vn/about' },
    publisher: { '@type': 'Person', name: 'Phan Ngọc Bảo' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(post.cover ? { image: [post.cover] } : {}),
  };

  return (
    <article className="post container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="back-link">← Tất cả bài viết</Link>
      {post.cover && <img className="cover" src={post.cover} alt={post.title} />}
      <h1>{post.title}</h1>
      <div className="post-meta">
        {dateStr} · {post.readingTime} phút đọc
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

      {post.headings.length >= 3 && (
        <nav className="toc" aria-label="Mục lục">
          <p className="toc-title">Mục lục</p>
          <ul>
            {post.headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? 'toc-sub' : ''}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      <ShareBar url={url} title={post.title} />

      {related.length > 0 && (
        <section className="related">
          <h2 className="related-title">Bài viết liên quan</h2>
          <div className="related-grid">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
