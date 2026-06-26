import { getAllProjects, getSettings } from '@/lib/posts';
import Showcase from '@/app/components/Showcase';

export const metadata = {
  title: 'Dự án · Phan Ngọc Bảo',
  description: 'Tuyển chọn một số dự án Marketing thực chiến — thương hiệu, performance và content.',
};

export default function PortfolioPage() {
  const projects = getAllProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    cover: p.cover || '',
    role: p.role || '',
    year: p.year || '',
    tags: p.tags || '',
  }));
  const s = getSettings();

  return (
    <Showcase
      projects={projects}
      accent={s.accent || '#B0814C'}
      introTitle={s.portfolioTitle || 'Dự án thực chiến'}
      introText={s.portfolioSubtitle || ''}
    />
  );
}
