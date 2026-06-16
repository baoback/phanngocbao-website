'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchBox from './SearchBox';

export default function Header({ brandName = 'Phan Ngọc Bảo', brandSuffix = 'Marketing', searchIndex = [] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="brand">
          {brandName}<span> · {brandSuffix}</span>
        </Link>

        <SearchBox index={searchIndex} />

        <nav className="nav">
          <Link href="/"><span className="nav-text">Bài viết</span></Link>
          <Link href="/portfolio">Dự án</Link>
          <Link href="/about">Hồ sơ</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
