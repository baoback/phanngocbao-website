import './globals.css';
import { Inter } from 'next/font/google';
import { getSettings } from '@/lib/posts';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap', variable: '--font-inter' });

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

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }) {
  const s = getSettings();
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Header brandName={s.brandName} brandSuffix={s.brandSuffix} />
        <main>{children}</main>
        <Footer note={s.footerNote} brandName={s.brandName} />
        <ScrollReveal />
      </body>
    </html>
  );
}
