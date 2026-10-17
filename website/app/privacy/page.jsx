import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Nội dung sửa trong /admin → Trang cố định → Trang Chính sách quyền riêng tư
function getPrivacy() {
  const file = path.join(process.cwd(), 'content', 'privacy.md');
  try {
    const { data, content } = matter(fs.readFileSync(file, 'utf-8'));
    return { title: data.title || 'Chính sách quyền riêng tư', updated: data.updated || '', html: marked.parse(content || '') };
  } catch {
    return { title: 'Chính sách quyền riêng tư', updated: '', html: '' };
  }
}

export function generateMetadata() {
  const p = getPrivacy();
  return {
    title: p.title,
    description: 'Chính sách quyền riêng tư của website phanngocbao.vn.',
    alternates: { canonical: '/privacy' },
  };
}

export default function PrivacyPage() {
  const p = getPrivacy();
  return (
    <article className="post container">
      <h1>{p.title}</h1>
      {p.updated && (
        <div className="post-meta">
          <span>Cập nhật lần cuối: {p.updated}</span>
        </div>
      )}
      <div className="post-body" dangerouslySetInnerHTML={{ __html: p.html }} />
    </article>
  );
}
