'use client';

import { useState } from 'react';
import PostCard from './PostCard';

export default function SearchResults({ posts = [], initialQuery = '', placeholder = 'Tìm bài viết, chủ đề quản trị, marketing...' }) {
  const [q, setQ] = useState(initialQuery);
  const query = q.toLowerCase().trim();
  const results = query
    ? posts.filter((p) =>
        (p.title + ' ' + (p.description || '') + ' ' + (p.tags || []).join(' '))
          .toLowerCase()
          .includes(query)
      )
    : [];

  return (
    <>
      <div className="search-page-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label="Tìm kiếm"
          autoComplete="off"
          autoFocus
        />
      </div>

      {query === '' ? (
        <p className="empty">Nhập từ khoá để tìm bài viết.</p>
      ) : results.length === 0 ? (
        <p className="empty">Không tìm thấy bài viết nào cho “{q.trim()}”.</p>
      ) : (
        <>
          <p className="search-count">{results.length} kết quả cho “{q.trim()}”</p>
          <div className="bento">
            {results.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
