import { getAllPosts, getAllTags } from '@/lib/posts';
import PostGrid from './components/PostGrid';

export default async function Home({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = (sp.q || '').toString();
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Góc nhìn Marketing mỗi ngày.</h1>
          <p>Chia sẻ kiến thức, kinh nghiệm và câu chuyện thực chiến trong nghề Marketing.</p>
        </div>
      </section>

      <div className="container">
        {posts.length === 0 ? (
          <p className="empty">Chưa có bài viết nào. Hãy đăng bài đầu tiên trong trang quản trị /admin.</p>
        ) : (
          <PostGrid posts={posts} tags={tags} initialQuery={q} />
        )}
      </div>
    </>
  );
}
