'use client';

import { useEffect } from 'react';

export default function ProfileFX() {
  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll('.parallax-img'));
    const showcase = document.querySelector('.story-showcase');

    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      if (showcase) showcase.style.setProperty('--reveal', '1');
      return undefined;
    }
    if (!imgs.length && !showcase) return undefined;

    let raf = null;
    const update = () => {
      raf = null;
      const vh = window.innerHeight || 1;

      imgs.forEach((img) => {
        const parent = img.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const center = r.top + r.height / 2;
        const offset = (center - vh / 2) / vh;
        img.style.transform = `translate3d(0, ${(offset * -36).toFixed(1)}px, 0) scale(1.18)`;
      });

      if (showcase) {
        const r = showcase.getBoundingClientRect();
        let p = (vh - r.top) / vh;
        p = Math.max(0, Math.min(1, p));
        showcase.style.setProperty('--reveal', p.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
