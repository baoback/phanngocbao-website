import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  metadataBase: new URL('https://phanngocbao.vn'),
  title: 'Phan Ngọc Bảo · Blog Marketing',
  description: 'Blog chia sẻ kiến thức và kinh nghiệm Marketing hàng ngày của Phan Ngọc Bảo.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Phan Ngọc Bảo · Blog Marketing',
    description: 'Blog chia sẻ kiến thức và kinh nghiệm Marketing hàng ngày của Phan Ngọc Bảo.',
    url: 'https://phanngocbao.vn',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
