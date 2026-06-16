import { getAllPosts } from '@/lib/posts';
import SearchResults from '../components/SearchResults';

export const metadata = {
  title: 'Tìm kiếm · Phan Ngọc Bảo',
  robots: { index: false },
};

export default async function SearchPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = (sp.q || '').toString();
  const posts = getAllPosts();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Tìm kiếm</h2>
            <p>Tìm bài viết theo tiêu đề, mô tả hoặc thẻ.</p>
          </div>
        </div>
        <SearchResults posts={posts} initialQuery={q} />
      </div>
    </section>
  );
}
