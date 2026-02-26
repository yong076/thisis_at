import Image from 'next/image';
import type { PublicProfile } from '@/lib/types';

function badgeClass(type: string) {
  switch (type) {
    case 'ARTIST':
      return 'badge badge--artist';
    case 'VENUE':
      return 'badge badge--venue';
    case 'CREATOR':
      return 'badge badge--creator';
    default:
      return 'badge';
  }
}

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  return (
    <section className="card profile-card">
      {profile.coverUrl ? (
        <div className="profile-cover-wrap">
          <Image
            src={profile.coverUrl}
            alt={`${profile.displayName} cover`}
            width={1600}
            height={900}
            priority
          />
        </div>
      ) : null}

      <div className="profile-info">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={`${profile.displayName} avatar`}
            className="avatar"
            width={88}
            height={88}
          />
        ) : null}

        <h1>{profile.displayName}</h1>

        <div className="profile-meta">
          <span className="profile-handle">@{profile.handle}</span>
          <span className={badgeClass(profile.type)}>{profile.type}</span>
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
