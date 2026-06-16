'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from './PostCard';

function ProfileCard({ profile }) {
  if (!profile || !profile.name) return null;
  return (
    <Link href="/about" className="card profile-card">
      <div>
        {profile.avatar && <img className="avatar" src={profile.avatar} alt={profile.name} />}
        <h3 style={{ marginTop: 14 }}>{profile.name}</h3>
        <p>{profile.role}</p>
      </div>
      <span className="go">Xem hồ sơ →</span>
    </Link>
  );
}

function QuoteCard({ quote }) {
  if (!quote) return null;
  return (
    <div className="card quote-card">
      <div className="qmark">“</div>
      <blockquote>{quote}</blockquote>
    </div>
  );
}

export default function BentoGrid({ posts, tags = [], profile, quote, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState('');

  // Kết nối ô tìm kiếm ở header để lọc trực tiếp
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
          <ProfileCard profile={profile} />
          <QuoteCard quote={quote} />
          {posts[1] && <PostCard post={posts[1]} className="wide" />}
          {posts.slice(2).map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      )}
    </>
  );
}
