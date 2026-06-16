'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';

export default function BentoGrid({ posts, tags = [], profile, quote, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState('');
  const wrapRef = useRef(null);
  const firstRender = useRef(true);

  // Kết nối ô tìm kiếm ở header
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

  // Khi lọc/đổi thẻ: hiện ngay các thẻ vừa render (observer chỉ chạy lúc mount)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (wrapRef.current) {
      wrapRef.current.querySelectorAll('.reveal, .reveal-up').forEach((el) => el.classList.add('in-view'));
    }
  }, [query, activeTag]);

  const q = query.toLowerCase().trim();
  const filtered = posts.filter((p) => {
    const hay = (p.title + ' ' + (p.description || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
    return (!q || hay.includes(q)) && (!activeTag || (p.tags || []).includes(activeTag));
  });
  const filtering = q !== '' || activeTag !== '';

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

      <div ref={wrapRef}>
        {filtering ? (
          <div className="bento">
            {filtered.length === 0 ? (
              <p className="empty">Không tìm thấy bài viết phù hợp.</p>
            ) : (
              filtered.map((p) => <PostCard key={p.slug} post={p} />)
            )}
          </div>
        ) : (
          <div className="bento">
            {posts[0] && <PostCard post={posts[0]} className="featured" />}
            {posts[1] && <PostCard post={posts[1]} className="wide" />}
            {posts.slice(2).map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
