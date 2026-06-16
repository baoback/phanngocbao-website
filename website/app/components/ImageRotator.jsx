'use client';

import { useEffect, useState } from 'react';

export default function ImageRotator({ images = [], interval = 4800 }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  if (!images.length) return null;

  return (
    <div className="showcase-stack" aria-hidden="true">
      {images.map((src, idx) => (
        <div key={idx} className={`showcase-slide${idx === active ? ' active' : ''}`}>
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  );
}
