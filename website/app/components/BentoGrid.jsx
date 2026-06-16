'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';

export default function BentoGrid({ posts, tags = [] }) {
  const [activeTag, setActiveTag] = useState('');
  const wrapRef = useRef(null);
  const firstRender = useRef(true);

  // Khi đổi thẻ: hiện ngay các thẻ vừa render (observer chỉ chạy lúc mount)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (wrapRef.current) {
      wrapRef.current
        .querySelectorAll('.reveal, .reveal-up')
        .forEach((el) => el.classList.add('in-view'));
    }
  }, [activeTag]);

  const filtered = activeTag
    ? posts.filter((p) => (p.tags || []).includes(activeTag))
    : posts;
  const filtering = activeTag !== '';

  return (
    <>
      {tags.length > 0 && (
        <div className="tagbar">
          <button
            className={`tagbtn${activeTag === '' ? ' active' : ''}`}
            onClick={() => setActiveTag('')}
          >
            Tất cả
          </button>
          {tags.map((t) => (
            <button
              key={t}
              className={`tagbtn${activeTag === t ? ' active' : ''}`}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div ref={wrapRef}>
        {filtering ? (
          <div className="bento">
            {filtered.length === 0 ? (
              <p className="empty">Không có bài viết nào cho thẻ này.</p>
            ) : (
              filtered.map((p) => <PostCard key={p.slug} post={p} />)
            )}
          </div>
        ) : (
          <div className="bento">
            {posts[0] && <PostCard post={posts[0]} className="featured" />}
            {posts[1] && <PostCard post={posts[1]} className="wide" />}
            {posts.slice(2).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
