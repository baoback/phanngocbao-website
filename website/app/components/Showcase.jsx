'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const pad = (n) => String(n).padStart(2, '0');

export default function Showcase({ projects = [] }) {
  const router = useRouter();
  const fullRef = useRef(null);
  const transRef = useRef(null);
  const items = projects;

  // dark canvas + cinematic scroll-snap (keeps the shared site header on top)
  useEffect(() => {
    document.body.classList.add('pf-immersive');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) document.documentElement.style.scrollSnapType = 'y proximity';
    return () => {
      document.body.classList.remove('pf-immersive');
      document.documentElement.style.scrollSnapType = '';
    };
  }, []);

  // parallax on the slide images
  useEffect(() => {
    const el = fullRef.current;
    if (!el) return undefined;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    let raf = null;
    const run = () => {
      raf = null;
      el.querySelectorAll('.sc-slide').forEach((s) => {
        const r = s.getBoundingClientRect();
        const prog = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        const im = s.querySelector('img');
        if (im) im.style.transform = `translateY(${(prog * -8).toFixed(2)}%)`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    window.addEventListener('scroll', onScroll, { passive: true });
    run();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [items.length]);

  const open = (slug) => {
    const t = transRef.current;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!t || reduce) { router.push(`/portfolio/${slug}/`); return; }
    t.classList.add('play');
    setTimeout(() => router.push(`/portfolio/${slug}/`), 480);
  };

  return (
    <div className="showcase">
      <div className="sc-full" ref={fullRef}>
        {items.map((p, i) => (
          <div className="sc-slide" key={p.slug} onClick={() => open(p.slug)}>
            <div className="sc-slide-img">
              {(p.cover || p.img) && <img src={p.cover || p.img} alt="" loading={i === 0 ? 'eager' : 'lazy'} />}
            </div>
            <span className="sc-slide-cta">Xem dự án</span>
            <div className="sc-slide-ov">
              <div className="sc-slide-idx">{pad(i + 1)} / {pad(items.length)}</div>
              <h2 className="sc-slide-title">{p.title}</h2>
              <div className="sc-slide-tags">
                {[p.role, p.year].filter(Boolean).join(' · ')}{p.tags ? ` — ${p.tags}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="sc-trans" ref={transRef} aria-hidden="true" />
    </div>
  );
}
