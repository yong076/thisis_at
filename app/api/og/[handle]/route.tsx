import { ImageResponse } from 'next/og';
import { getProfileByHandle } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: { handle: string } }) {
  const profile = await getProfileByHandle(params.handle);

  const title = profile ? profile.displayName : 'thisis.at';
  const subtitle = profile ? `@${profile.handle}` : 'link-in-bio for artists, venues, creators';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(circle at 15% 20%, rgba(115,224,188,0.3), transparent 35%), radial-gradient(circle at 80% 20%, rgba(255,213,139,0.25), transparent 30%), linear-gradient(150deg, #09141e 0%, #102638 50%, #183f49 100%)',
          color: '#f4f8fb',
          padding: '72px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 30, opacity: 0.8 }}>thisis.at</div>
        </div>
        <div style={{ fontSize: 30, opacity: 0.85 }}>{subtitle}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
