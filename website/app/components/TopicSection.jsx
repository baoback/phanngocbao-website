'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';

export default function TopicSection({ title, posts = [], initial = 3 }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const shown = open ? posts : posts.slice(0, initial);

  useEffect(() => {
    if (open && wrapRef.current) {
      wrapRef.current
        .querySelectorAll('.reveal, .reveal-up')
        .forEach((el) => el.classList.add('in-view'));
    }
  }, [open]);

  if (posts.length === 0) return null;

  return (
    <section className="section section-topic">
      <div className="container">
        <div className="section-head reveal-up">
          <div>
            <h2>Bài viết chủ đề {title}</h2>
          </div>
          {posts.length > initial && (
            <button type="button" className="see-all" onClick={() => setOpen(!open)}>
              {open ? 'Thu gọn' : `Xem tất cả (${posts.length}) →`}
            </button>
          )}
        </div>
        <div className="topic-grid" ref={wrapRef}>
          {shown.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      </div>
    </section>
  );
}
