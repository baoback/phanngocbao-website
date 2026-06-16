'use client';

import { useState } from 'react';

export default function ShareBar({ url, title }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  const x = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };

  return (
    <div className="sharebar">
      <span className="share-label">Chia sẻ bài viết</span>
      <div className="share-btns">
        <a className="share-btn" href={fb} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a className="share-btn" href={x} target="_blank" rel="noopener noreferrer">X</a>
        <a className="share-btn" href={li} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <button className="share-btn" onClick={copy}>{copied ? 'Đã copy ✓' : 'Copy link'}</button>
      </div>
    </div>
  );
}
