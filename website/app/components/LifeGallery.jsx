'use client';

import { useRef } from 'react';

function LifeTile({ item, index }) {
  const vref = useRef(null);

  const onEnter = () => {
    const v = vref.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {
      // bỏ qua nếu trình duyệt chặn autoplay
    }
  };

  const onLeave = () => {
    const v = vref.current;
    if (v) v.pause();
  };

  return (
    <div
      className="life-tile reveal-up"
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="life-media">
        {item.image && (
          <img className="life-img" src={item.image} alt={item.title || ''} loading="lazy" decoding="async" />
        )}
        {item.video && (
          <video
            className="life-video"
            ref={vref}
            src={item.video}
            poster={item.image || undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}
        <div className="life-veil" aria-hidden="true" />
      </div>
      <div className="life-content">
        {item.title && <h3 className="life-title">{item.title}</h3>}
        {item.text && <p className="life-story">{item.text}</p>}
      </div>
    </div>
  );
}

export default function LifeGallery({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="life-gallery">
      {items.map((l, i) => (
        <LifeTile key={i} item={l} index={i} />
      ))}
    </div>
  );
}
