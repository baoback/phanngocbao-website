import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta">
          <h2>Bạn đang tìm người đồng hành<br />cho bài toán Marketing?</h2>
          <p>
            Xem câu chuyện sự nghiệp, các dự án thực chiến và cách mình tư duy hệ thống —
            rồi kết nối nếu thấy phù hợp.
          </p>
          <Link href="/about" className="btn btn-primary">Khám phá hồ sơ &amp; kết nối</Link>
        </div>
      </div>
    </section>
  );
}
