import {
  getAllPosts,
  getAllTags,
  getSettings,
  CATEGORIES,
  getPostsByCategory,
} from '@/lib/posts';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import TagCloud from './components/TagCloud';
import TopicSection from './components/TopicSection';
import CTASection from './components/CTASection';
import NewsletterForm from './components/NewsletterForm';

const slim = (p) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  cover: p.cover,
  pubDate: p.pubDate,
  tags: p.tags,
});

export default async function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const s = getSettings();
  const latest = posts.slice(0, 6);

  return (
    <>
      <Hero />

      <section className="section" id="bai-viet">
        <div className="container">
          <div className="section-head reveal-up">
            <div>
              <h2>Bài viết mới nhất</h2>
              <p>{s.postsSubtitle}</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <p className="empty">Chưa có bài viết nào. Hãy đăng bài đầu tiên trong trang quản trị /admin.</p>
          ) : (
            <div className="bento">
              {latest[0] && <PostCard post={latest[0]} className="featured" />}
              {latest[1] && <PostCard post={latest[1]} className="wide" />}
              {latest.slice(2).map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          )}

          <TagCloud tags={tags} />
        </div>
      </section>

      {CATEGORIES.map((cat) => (
        <TopicSection key={cat} title={cat} posts={getPostsByCategory(cat).map(slim)} />
      ))}

      <section className="section">
        <div className="container">
          <div className="newsletter reveal-up">
            <h2>{s.newsletterTitle}</h2>
            <p>{s.newsletterText}</p>
            <NewsletterForm action={s.newsletterAction} button={s.newsletterButton} />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
