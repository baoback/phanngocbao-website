import Link from 'next/link';

export default function Footer({
  note = 'Blog Marketing & Hồ sơ cá nhân',
  brandName = 'Phan Ngọc Bảo',
  navAbout = 'Hồ sơ',
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-meta">
          <div>© {year} {brandName} · phanngocbao.vn</div>
          <div>{note}</div>
        </div>
        <nav className="footer-links" aria-label="Liên kết chân trang">
          <Link href="/">Blog</Link>
          <Link href="/portfolio">Dự án</Link>
          <Link href="/market-trend">Market Trend</Link>
          <Link href="/tools">Công cụ</Link>
          <Link href="/about">{navAbout}</Link>
        </nav>
      </div>
    </footer>
  );
}
