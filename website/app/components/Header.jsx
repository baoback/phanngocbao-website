import Link from 'next/link';

export default function Header({ showSearch = true }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          Phan Ngọc Bảo<span> · Marketing</span>
        </Link>

        {showSearch && (
          <form className="search-wrap" action="/" method="get" role="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="search" name="q" placeholder="Tìm bài viết, chủ đề Marketing..." aria-label="Tìm kiếm" autoComplete="off" />
          </form>
        )}

        <nav className="nav">
          <Link href="/"><span className="nav-text">Bài viết</span></Link>
          <Link href="/about">Hồ sơ</Link>
        </nav>
      </div>
    </header>
  );
}
