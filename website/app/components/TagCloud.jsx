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
        <button type="button" className="tagchip tagchip-more" onClick={() => setOpen(!open)}>
          {open ? 'Thu gọn' : `+${hidden} thẻ`}
        </button>
      )}
    </div>
  );
}
