import './globals.css';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  metadataBase: new URL('https://phanngocbao.vn'),
  title: 'Phan Ngọc Bảo · Blog Marketing',
  description: 'Chiến lược, thương hiệu và performance — góc nhìn Marketing thực chiến của Phan Ngọc Bảo.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Phan Ngọc Bảo · Blog Marketing',
    description: 'Chiến lược, thương hiệu và performance — góc nhìn Marketing thực chiến của Phan Ngọc Bảo.',
    url: 'https://phanngocbao.vn',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
