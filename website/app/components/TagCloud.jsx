'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TagCloud({ tags = [], limit = 12 }) {
  const [open, setOpen] = useState(false);
  const shown = open ? tags : tags.slice(0, limit);
  const hidden = tags.length - limit;

  if (tags.length === 0) return null;

  return (
    <div className="tagcloud reveal-up">
      <span className="tagcloud-label">Thẻ:</span>
      {shown.map((t) => (
        <Link key={t} href={`/tags/${encodeURIComponent(t)}/`} className="tagchip">{t}</Link>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className={`tagchip-toggle${open ? ' open' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span>{open ? 'Thu gọn' : `Xem thêm ${hidden} thẻ`}</span>
        </button>
      )}
    </div>
  );
}
