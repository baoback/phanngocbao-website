import Link from 'next/link';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function PostCard({ post, className = '' }) {
  const url = `/blog/${post.slug}/`;
  const tags = post.tags || [];

  if (post.cover) {
    return (
      <Link href={url} className={`card has-cover ${className}`.trim()}>
        <div className="thumb-wrap">
          <img className="thumb" src={post.cover} alt={post.title} loading="lazy" />
        </div>
        <div className="veil" />
        <div className="card-body">
          <div>{tags.slice(0, 2).map((t) => <span key={t} className="pill">{t}</span>)}</div>
          <h3>{post.title}</h3>
          <div className="meta">{formatDate(post.pubDate)}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={url} className={`card text-card ${className}`.trim()}>
      <div className="card-body" style={{ padding: 0 }}>
        <div>{tags.slice(0, 2).map((t) => <span key={t} className="pill">{t}</span>)}</div>
        <h3>{post.title}</h3>
        {post.description && <p className="excerpt">{post.description}</p>}
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="meta">{formatDate(post.pubDate)}</div>
      </div>
    </Link>
  );
}
