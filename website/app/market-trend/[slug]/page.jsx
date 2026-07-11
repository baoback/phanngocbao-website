import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketBriefs, getMarketBriefBySlug, formatDate } from '@/lib/posts';

export const dynamicParams = false;

export function generateStaticParams() {
  return getMarketBriefs().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const b = getMarketBriefBySlug(slug);
  if (!b) return {};
  const url = `https://phanngocbao.vn/market-trend/${slug}`;
  return {
    title: `${b.title} · Market Trend`,
    description: b.description,
    alternates: { canonical: url },
    openGraph: { title: b.title, description: b.description, url, type: 'article' },
  };
}

export default async function MarketBriefPage({ params }) {
  const { slug } = await params;
  const b = getMarketBriefBySlug(slug);
  if (!b) notFound();

  return (
    <article className="post container">
      <Link href="/market-trend" className="back-link">← Market Trend</Link>
      <h1>{b.title}</h1>
      <div className="post-meta">Cập nhật {formatDate(b.date)}</div>
      {b.description && (
        <p className="mk-brief-lead">{b.description}</p>
      )}
      <div className="post-body" dangerouslySetInnerHTML={{ __html: b.html }} />
    </article>
  );
}
