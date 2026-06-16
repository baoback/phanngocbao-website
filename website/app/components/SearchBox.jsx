'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBox({ index = [] }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (mobileOpen && inputRef.current) inputRef.current.focus();
  }, [mobileOpen]);

  const close = () => {
    setOpen(false);
    setMobileOpen(false);
  };

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
      close();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goAll();
  };

  return (
    <>
      <button
        type="button"
        className="search-toggle"
        aria-label="Tìm kiếm"
        onClick={() => setMobileOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <div className={`search-wrap${mobileOpen ? ' mobile-open' : ''}`} ref={boxRef}>
        <form onSubmit={onSubmit} role="search">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
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
          <button
            type="button"
            className="search-close"
            aria-label="Đóng tìm kiếm"
            onClick={close}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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
                    onClick={close}
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
    </>
  );
}
