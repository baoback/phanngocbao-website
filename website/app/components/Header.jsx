'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchBox from './SearchBox';

export default function Header({
  brandName = 'Phan Ngọc Bảo',
  brandSuffix = 'Marketing',
  searchIndex = [],
  navBlog = 'Bài viết',
  navProjects = 'Dự án',
  navAbout = 'Hồ sơ',
  navMarket = 'Market Trend',
  searchPlaceholder,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Đóng menu khi bấm ra ngoài hoặc nhấn Esc
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={close}>
          {brandName}<span> · {brandSuffix}</span>
        </Link>

        <SearchBox index={searchIndex} placeholder={searchPlaceholder} />

        <nav className="nav" ref={navRef}>
          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            <Link href="/" onClick={close}>{navBlog}</Link>
            <Link href="/portfolio" onClick={close}>{navProjects}</Link>
            <Link href="/about" onClick={close}>{navAbout}</Link>
            <Link href="/market-trend" onClick={close}>{navMarket}</Link>
          </div>
          <ThemeToggle />
          <button
            type="button"
            className="nav-toggle"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
