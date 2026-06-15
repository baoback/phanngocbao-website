import Link from 'next/link';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function PostCard({ post }) {
  const url = `/blog/${post.slug}/`;
  const tags = post.tags || [];

  if (post.cover) {
    return (
      <Link href={url} className="card">
        <img className="thumb" src={post.cover} alt={post.title} loading="lazy" />
        <div className="overlay">
          <div>{tags.slice(0, 2).map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
          <h3>{post.title}</h3>
          <div className="meta">{formatDate(post.pubDate)}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={url} className="card no-image">
      <div>{tags.slice(0, 2).map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
      <h3>{post.title}</h3>
      {post.description && <p>{post.description}</p>}
      <div className="meta">{formatDate(post.pubDate)}</div>
    </Link>
  );
}
