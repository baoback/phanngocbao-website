import { getAllPosts, getAllTags, getAbout, getSettings } from '@/lib/posts';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import CTASection from './components/CTASection';
import NewsletterForm from './components/NewsletterForm';

export default async function Home({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = (sp.q || '').toString();
  const posts = getAllPosts();
  const tags = getAllTags();
  const about = getAbout();
  const s = getSettings();
  const quote = about.tagline || 'Nội dung tốt là nội dung có mục tiêu và đo lường được.';

  return (
    <>
      <Hero />

      <section className="section" id="bai-viet">
        <div className="container">
          <div className="section-head reveal-up">
            <div>
              <h2>{s.postsTitle}</h2>
              <p>{s.postsSubtitle}</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <p className="empty">Chưa có bài viết nào. Hãy đăng bài đầu tiên trong trang quản trị /admin.</p>
          ) : (
            <BentoGrid
              posts={posts}
              tags={tags}
              profile={{ name: about.name, role: about.role, avatar: about.avatar }}
              quote={quote}
              initialQuery={q}
            />
          )}
        </div>
      </section>

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
