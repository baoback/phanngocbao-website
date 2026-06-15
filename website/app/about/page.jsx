import { getAbout } from '@/lib/posts';

export function generateMetadata() {
  const about = getAbout();
  return {
    title: `${about.name} · Hồ sơ`,
    description: about.tagline,
  };
}

export default function AboutPage() {
  const about = getAbout();

  return (
    <div className="profile container">
      <div className="profile-head">
        {about.avatar && <img src={about.avatar} alt={about.name} />}
        <div>
          <h1>{about.name}</h1>
          <p>{about.role}</p>
        </div>
      </div>
      {about.tagline && (
        <p className="profile-body" style={{ fontSize: 20, color: 'var(--text-soft)', marginBottom: 32 }}>
          {about.tagline}
        </p>
      )}
      <div className="profile-body" dangerouslySetInnerHTML={{ __html: about.html }} />
    </div>
  );
}
