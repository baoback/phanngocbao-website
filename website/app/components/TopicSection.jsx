import Link from 'next/link';
import PostCard from './PostCard';

export default function TopicSection({ title, posts = [], href, initial = 3 }) {
  if (posts.length === 0) return null;
  const shown = posts.slice(0, initial);

  return (
    <section className="section section-topic">
      <div className="container">
        <div className="section-head reveal-up">
          <div>
            <h2>Bài viết chủ đề {title}</h2>
          </div>
          {href && posts.length > initial && (
            <Link className="see-all" href={href}>Xem tất cả ({posts.length}) →</Link>
          )}
        </div>
        <div className="topic-grid">
          {shown.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      </div>
    </section>
  );
}
