import Image from 'next/image';
import type { PublicProfile } from '@/lib/types';

function badgeClass(type: string) {
  switch (type) {
    case 'ARTIST': return 'badge badge--artist';
    case 'VENUE': return 'badge badge--venue';
    case 'BUSINESS': return 'badge badge--business';
    case 'INFLUENCER': return 'badge badge--influencer';
    case 'PERSONAL': return 'badge badge--personal';
    case 'RESTAURANT': return 'badge badge--restaurant';
    case 'ORGANIZATION': return 'badge badge--organization';
    default: return 'badge badge--creator';
  }
}

function badgeLabel(type: string) {
  switch (type) {
    case 'ARTIST': return '아티스트';
    case 'VENUE': return '공연장';
    case 'BUSINESS': return '비즈니스';
    case 'INFLUENCER': return '인플루언서';
    case 'PERSONAL': return '개인';
    case 'RESTAURANT': return '레스토랑';
    case 'ORGANIZATION': return '단체';
    default: return '크리에이터';
  }
}

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  const hasCover = !!profile.coverUrl;

  return (
    <section className="card profile-card">
      {hasCover ? (
        <div className="profile-cover-wrap">
          <Image
            src={profile.coverUrl!}
            alt={`${profile.displayName} cover`}
            fill
            sizes="(max-width: 720px) 100vw, 520px"
            priority
          />
        </div>
      ) : null}

      <div className={`profile-info ${hasCover ? '' : 'profile-info--no-cover'}`}>
        <div className="avatar-ring">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={`${profile.displayName} avatar`}
              className="avatar"
              width={88}
              height={88}
            />
          ) : (
            <div className="avatar avatar--placeholder">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h1>{profile.displayName}</h1>

        <div className="profile-meta">
          <span className="profile-handle">@{profile.handle}</span>
          <span className={badgeClass(profile.type)}>{badgeLabel(profile.type)}</span>
          {profile.location ? (
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {profile.location}
            </span>
          ) : null}
        </div>

        {profile.bio ? <p className="profile-bio">{profile.bio}</p> : null}
      </div>
    </section>
  );
}
