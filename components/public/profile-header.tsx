import Image from 'next/image';
import type { PublicProfile } from '@/lib/types';

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  return (
    <section className="hero card">
      {profile.coverUrl ? (
        <Image
          src={profile.coverUrl}
          alt={`${profile.displayName} cover`}
          className="cover"
          width={1600}
          height={900}
          priority
        />
      ) : null}
      <div className="profile-header">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={`${profile.displayName} avatar`}
            className="avatar"
            width={84}
            height={84}
          />
        ) : null}
        <div>
          <h1>{profile.displayName}</h1>
          <p className="subtitle">@{profile.handle}</p>
          <p className="subtitle">
            <span className="badge">{profile.type}</span> {profile.location ? `• ${profile.location}` : ''}
          </p>
          <p>{profile.bio}</p>
        </div>
      </div>
    </section>
  );
}
