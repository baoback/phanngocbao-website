export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>© {year} Phan Ngọc Bảo · phanngocbao.vn</div>
        <div>Blog Marketing & Hồ sơ cá nhân</div>
      </div>
    </footer>
  );
}
