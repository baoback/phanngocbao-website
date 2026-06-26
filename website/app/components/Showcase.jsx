'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const pad = (n) => String(n).padStart(2, '0');
const tokensOf = (p) => (p.tags || '').split('·').map((s) => s.trim()).filter(Boolean);

export default function Showcase({ projects = [], accent = '#B0814C', introTitle = 'Dự án thực chiến', introText = '' }) {
  const router = useRouter();
  const [view, setView] = useState('full');
  const [filter, setFilter] = useState('');
  const [hovered, setHovered] = useState(null);

  const fullRef = useRef(null);
  const cursorRef = useRef(null);
  const revealRef = useRef(null);
  const revealImgRef = useRef(null);
  const transRef = useRef(null);
  const viewRef = useRef('full');

  const cats = Array.from(new Set(projects.flatMap(tokensOf)));
  const items = filter ? projects.filter((p) => tokensOf(p).includes(filter)) : projects;

  // immersive page: hide global header/footer to avoid clashing with the dark gallery
  useEffect(() => {
    document.body.classList.add('pf-immersive');
    return () => {
      document.body.classList.remove('pf-immersive');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem('pf_view');
      if (v && ['full', 'list', 'grid'].includes(v)) setView(v);
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    viewRef.current = view;
    try { localStorage.setItem('pf_view', view); } catch (e) { /* ignore */ }
    const lock = view === 'full';
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    document.body.style.overflow = lock ? 'hidden' : '';
  }, [view]);

  useEffect(() => {
    const rv = revealRef.current;
    const img = revealImgRef.current;
    if (!rv || !img) return;
    if (hovered != null && items[hovered]) {
      img.src = items[hovered].cover || items[hovered].img || '';
      rv.classList.add('show');
    } else {
      rv.classList.remove('show');
    }
  }, [hovered, items]);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
    if (reduce || !fine) return undefined;

    const cursor = cursorRef.current;
    const reveal = revealRef.current;
    const disp = document.getElementById('scDisp');

    let mx = innerWidth / 2, my = innerHeight / 2;
    let cx = mx, cy = my, rx = mx, ry = my, lastX = mx, lastY = my, vel = 0, curDisp = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      const dx = mx - lastX, dy = my - lastY; lastX = mx; lastY = my;
      vel = Math.min(Math.sqrt(dx * dx + dy * dy), 60);
      const interactive = e.target.closest('a,button,.sc-row,.sc-card,.sc-slide');
      if (cursor) cursor.classList.toggle('big', !!interactive);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let skew = 0, lastWin = window.scrollY;
    const onWinScroll = () => {
      const d = window.scrollY - lastWin; lastWin = window.scrollY;
      skew = Math.max(-6, Math.min(6, d * 0.3));
    };
    window.addEventListener('scroll', onWinScroll, { passive: true });

    let raf = null;
    const loop = () => {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (reveal) { reveal.style.left = rx + 'px'; reveal.style.top = ry + 'px'; }
      curDisp += (vel - curDisp) * 0.1; vel *= 0.9;
      if (disp) disp.setAttribute('scale', (curDisp * 1.7).toFixed(1));

      skew *= 0.88;
      const v = viewRef.current;
      if (v === 'list' || v === 'grid') {
        const el = document.querySelector('.sc-skew');
        if (el) el.style.transform = `skewY(${skew.toFixed(2)}deg)`;
      } else if (fullRef.current) {
        fullRef.current.querySelectorAll('.sc-slide').forEach((s) => {
          const r = s.getBoundingClientRect();
          const prog = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          const im = s.querySelector('img');
          if (im) im.style.transform = `translateY(${(prog * -14).toFixed(2)}%)`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onWinScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // parallax inside the fullscreen scroller
  useEffect(() => {
    const el = fullRef.current;
    if (!el || view !== 'full') return undefined;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    let raf = null;
    const run = () => {
      raf = null;
      el.querySelectorAll('.sc-slide').forEach((s) => {
        const r = s.getBoundingClientRect();
        const prog = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        const im = s.querySelector('img');
        if (im) im.style.transform = `translateY(${(prog * -14).toFixed(2)}%)`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    el.addEventListener('scroll', onScroll, { passive: true });
    run();
    return () => { el.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [view, items.length]);

  const open = (slug) => {
    const t = transRef.current;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!t || reduce) { router.push(`/portfolio/${slug}/`); return; }
    t.classList.add('play');
    setTimeout(() => router.push(`/portfolio/${slug}/`), 480);
  };

  return (
    <div className="showcase" style={{ '--acc': accent }}>
      <div className="sc-cursor" ref={cursorRef} aria-hidden="true" />

      <header className="sc-bar">
        <a className="sc-brand" href="/">Phan Ngọc Bảo <span>· Dự án</span></a>
        <div className="sc-bar-right">
          <div className="sc-toggle">
            {[['full', 'Toàn màn hình'], ['list', 'Danh sách'], ['grid', 'Lưới']].map(([v, l]) => (
              <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{l}</button>
            ))}
          </div>
          <nav className="sc-nav"><a href="/">Trang chủ</a><a href="/about">Hồ sơ</a></nav>
        </div>
      </header>

      {view !== 'full' && (
        <section className="sc-intro container">
          <div className="sc-eyebrow">Tuyển chọn</div>
          <h1 className="sc-h1">{introTitle}</h1>
          {introText && <p className="sc-introp">{introText}</p>}
          {cats.length > 1 && (
            <div className="sc-filters">
              <button className={!filter ? 'on' : ''} onClick={() => setFilter('')}>Tất cả</button>
              {cats.map((c) => (
                <button key={c} className={filter === c ? 'on' : ''} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
          )}
        </section>
      )}

      {view === 'full' && (
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
      )}

      {view === 'list' && (
        <section className={`sc-list sc-skew container${hovered != null ? ' dimmed' : ''}`}>
          {items.map((p, i) => (
            <div
              className="sc-row"
              key={p.slug}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => open(p.slug)}
            >
              <span className="sc-idx">{pad(i + 1)}</span>
              <div className="sc-name">{p.title}</div>
              <div className="sc-rtags">{p.tags || p.role}</div>
            </div>
          ))}
        </section>
      )}

      {view === 'grid' && (
        <section className="sc-grid sc-skew container">
          {items.map((p) => (
            <div className="sc-card" key={p.slug} onClick={() => open(p.slug)}>
              {(p.cover || p.img) && <img src={p.cover || p.img} alt="" loading="lazy" />}
              <div className="sc-card-meta">
                <h3>{p.title}</h3>
                <span>{p.tags || p.role}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {view !== 'full' && (
        <footer className="sc-foot container">
          <div className="sc-foot-big">Cùng xây điều<br />đáng nhớ?</div>
          <a className="sc-foot-cta" href="/about#contact">Kết nối với mình →</a>
        </footer>
      )}

      <div className="sc-reveal" ref={revealRef} aria-hidden="true"><img ref={revealImgRef} alt="" /></div>
      <div className="sc-trans" ref={transRef} aria-hidden="true" />

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="scDistort">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.016" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" id="scDisp" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}
