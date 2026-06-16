export default function Footer({ note = 'Blog Marketing & Hồ sơ cá nhân', brandName = 'Phan Ngọc Bảo' }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>© {year} {brandName} · phanngocbao.vn</div>
        <div>{note}</div>
      </div>
    </footer>
  );
}
