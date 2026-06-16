import { getAbout } from '@/lib/posts';

export function generateMetadata() {
  const about = getAbout();
  return { title: `${about.name} · Hồ sơ`, description: about.tagline };
}

export default function AboutPage() {
  const about = getAbout();
  const links = [
    about.email && { label: 'Email', href: `mailto:${about.email}` },
    about.linkedin && { label: 'LinkedIn', href: about.linkedin },
    about.facebook && { label: 'Facebook', href: about.facebook },
  ].filter(Boolean);

  return (
    <div className="profile container">
      <div className="profile-head reveal-up">
        {about.avatar && <img src={about.avatar} alt={about.name} />}
        <div>
          <h1>{about.name}</h1>
          <p>{about.role}</p>
        </div>
      </div>
      {about.tagline && (
        <p className="profile-body" style={{ fontSize: 21, color: 'var(--text-muted)', marginBottom: 24 }}>
          {about.tagline}
        </p>
      )}
      {links.length > 0 && (
        <div className="social-row">
          {links.map((l) => (
            <a key={l.label} className="social-pill" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      )}
      <div className="profile-body" dangerouslySetInnerHTML={{ __html: about.html }} />
    </div>
  );
}
