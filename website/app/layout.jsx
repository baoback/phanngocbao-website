import './globals.css';
import { Inter } from 'next/font/google';
import { getSettings, getAllPosts } from '@/lib/posts';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap', variable: '--font-inter' });

export function generateMetadata() {
  const s = getSettings();
  const title = s.metaTitle || 'Phan Ngọc Bảo · Blog Marketing';
  const description =
    s.metaDescription ||
    'Chiến lược, thương hiệu và performance — góc nhìn Marketing thực chiến của Phan Ngọc Bảo.';
  return {
    metadataBase: new URL('https://phanngocbao.vn'),
    title,
    description,
    icons: { icon: '/favicon.svg' },
    openGraph: { title, description, url: 'https://phanngocbao.vn', type: 'website' },
    alternates: { types: { 'application/rss+xml': '/rss.xml' } },
  };
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }) {
  const s = getSettings();
  const searchIndex = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
  }));
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Header brandName={s.brandName} brandSuffix={s.brandSuffix} searchIndex={searchIndex} />
        <main>{children}</main>
        <Footer note={s.footerNote} brandName={s.brandName} />
        <ScrollReveal />
        <GoogleAnalytics gaId={s.gaId} />
      </body>
    </html>
  );
}
