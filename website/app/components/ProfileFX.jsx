'use client';

import { useEffect } from 'react';

export default function ProfileFX() {
  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const imgs = Array.from(document.querySelectorAll('.parallax-img'));
    const showcase = document.querySelector('.story-showcase');
    const spineFill = document.querySelector('.story-spine-fill');
    const hero = document.querySelector('.story-hero');

    const cleanups = [];

    // ----- Count-up -----
    const counters = Array.from(document.querySelectorAll('.countup'));
    if (counters.length) {
      const animateCount = (el) => {
        const text = el.textContent.trim();
        const m = text.match(/\d[\d.,]*/);
        if (!m) return;
        const target = parseInt(m[0].replace(/[.,]/g, ''), 10);
        if (!Number.isFinite(target)) return;
        const pre = text.slice(0, m.index);
        const suf = text.slice(m.index + m[0].length);
        if (reduce) { el.textContent = text; return; }
        const dur = 1100;
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(target * eased) + suf;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = text;
        };
        requestAnimationFrame(step);
      };
      const co = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } }),
        { threshold: 0.4 }
      );
      counters.forEach((el) => co.observe(el));
      cleanups.push(() => co.disconnect());
    }

    // ----- Rotating word (hero) -----
    const rotEl = document.querySelector('.hero-rotate-word');
    if (rotEl && !reduce) {
      let words = [];
      try { words = JSON.parse(rotEl.getAttribute('data-words') || '[]'); } catch (e) { words = []; }
      if (words.length > 1) {
        let idx = 0;
        const timer = setInterval(() => {
          idx = (idx + 1) % words.length;
          rotEl.classList.add('swap');
          setTimeout(() => {
            rotEl.textContent = words[idx];
            rotEl.classList.remove('swap');
          }, 380);
        }, 2300);
        cleanups.push(() => clearInterval(timer));
      }
    }

    // ----- Spotlight theo chuột (hero) -----
    if (hero && !reduce && window.matchMedia('(pointer:fine)').matches) {
      const onMove = (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        hero.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      };
      hero.addEventListener('mousemove', onMove);
      cleanups.push(() => hero.removeEventListener('mousemove', onMove));
    }

    if (reduce) {
      if (showcase) showcase.style.setProperty('--reveal', '1');
      return () => cleanups.forEach((fn) => fn());
    }
    if (!imgs.length && !showcase && !spineFill) {
      return () => cleanups.forEach((fn) => fn());
    }

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

      if (spineFill) {
        const doc = document.documentElement;
        const max = doc.scrollHeight - vh;
        const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
        spineFill.style.height = (p * 100).toFixed(1) + '%';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
