'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';

export default function PostGrid({ posts, tags = [], initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState('');

  // Kết nối ô tìm kiếm ở header để lọc trực tiếp khi gõ
  useEffect(() => {
    const input = document.querySelector('.search-wrap input');
    if (!input) return;
    if (initialQuery) input.value = initialQuery;
    const onInput = (e) => setQuery(e.target.value);
    const form = input.closest('form');
    const onSubmit = (e) => e.preventDefault();
    input.addEventListener('input', onInput);
    if (form) form.addEventListener('submit', onSubmit);
    return () => {
      input.removeEventListener('input', onInput);
      if (form) form.removeEventListener('submit', onSubmit);
    };
  }, [initialQuery]);

  const q = query.toLowerCase().trim();
  const filtered = posts.filter((p) => {
    const hay = (p.title + ' ' + (p.description || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
    const matchText = !q || hay.includes(q);
    const matchTag = !activeTag || (p.tags || []).includes(activeTag);
    return matchText && matchTag;
  });

  return (
    <>
      {tags.length > 0 && (
        <div className="tagbar">
          <button className={`tagbtn${activeTag === '' ? ' active' : ''}`} onClick={() => setActiveTag('')}>
            Tất cả
          </button>
          {tags.map((t) => (
            <button key={t} className={`tagbtn${activeTag === t ? ' active' : ''}`} onClick={() => setActiveTag(t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="empty">Không tìm thấy bài viết phù hợp.</p>
      ) : (
        <div className="masonry">
          {filtered.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      )}
    </>
  );
}
