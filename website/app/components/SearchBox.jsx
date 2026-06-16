'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBox({ index = [] }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const query = q.toLowerCase().trim();
  const results = query
    ? index
        .filter((p) =>
          (p.title + ' ' + (p.description || '') + ' ' + (p.tags || []).join(' '))
            .toLowerCase()
            .includes(query)
        )
        .slice(0, 6)
    : [];

  const goAll = () => {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goAll();
  };

  return (
    <div className="search-wrap" ref={boxRef}>
      <form onSubmit={onSubmit} role="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Tìm bài viết, chủ đề Marketing..."
          aria-label="Tìm kiếm"
          autoComplete="off"
        />
      </form>

      {open && query && (
        <div className="search-dropdown">
          {results.length === 0 ? (
            <p className="search-empty">Không tìm thấy bài viết phù hợp.</p>
          ) : (
            <>
              {results.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="search-item"
                  onClick={() => setOpen(false)}
                >
                  <span className="search-item-title">{p.title}</span>
                  {p.tags && p.tags.length > 0 && (
                    <span className="search-item-tags">{p.tags.slice(0, 2).join(' · ')}</span>
                  )}
                </Link>
              ))}
              <button type="button" className="search-all" onClick={goAll}>
                Xem tất cả kết quả cho “{q.trim()}” →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
