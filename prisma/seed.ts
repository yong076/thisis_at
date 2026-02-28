import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Admin User ───────────────────────────────────────────────
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!adminUser && adminEmails.length > 0) {
    adminUser = await prisma.user.upsert({
      where: { email: adminEmails[0] },
      update: { role: 'ADMIN' },
      create: {
        email: adminEmails[0],
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log(`  Created admin user: ${adminUser.email}`);
  }

  if (!adminUser) {
    // Fallback: create a placeholder admin
    adminUser = await prisma.user.upsert({
      where: { email: 'admin@thisis.at' },
      update: { role: 'ADMIN' },
      create: {
        email: 'admin@thisis.at',
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('  Created placeholder admin user: admin@thisis.at');
  }

  // ─── Categories ─────────────────────────────────────────────
  const categoryData = [
    { slug: 'music', nameKo: '음악', icon: '🎵', order: 1 },
    { slug: 'venue', nameKo: '공연장', icon: '🏛️', order: 2 },
    { slug: 'food', nameKo: '맛집/카페', icon: '🍽️', order: 3 },
    { slug: 'tech', nameKo: '테크/스타트업', icon: '💻', order: 4 },
    { slug: 'fashion', nameKo: '패션/뷰티', icon: '👗', order: 5 },
    { slug: 'lifestyle', nameKo: '라이프스타일', icon: '🌿', order: 6 },
    { slug: 'education', nameKo: '교육', icon: '📚', order: 7 },
    { slug: 'art', nameKo: '아트/디자인', icon: '🎨', order: 8 },
    { slug: 'entertainment', nameKo: '엔터테인먼트', icon: '🎬', order: 9 },
    { slug: 'other', nameKo: '기타', icon: '📌', order: 10 },
  ];

  for (const cat of categoryData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameKo: cat.nameKo, icon: cat.icon, order: cat.order },
      create: cat,
    });
  }
  console.log(`  ${categoryData.length} categories created`);

  const musicCat = await prisma.category.findUnique({ where: { slug: 'music' } });
  const venueCat = await prisma.category.findUnique({ where: { slug: 'venue' } });

  // ─── LUCID BAND Profile ──────────────────────────────────────
  const lucidProfile = await prisma.profile.upsert({
    where: { handle: 'lucid.band' },
    update: { categoryId: musicCat?.id ?? null },
    create: {
      userId: adminUser.id,
      handle: 'lucid.band',
      displayName: 'LUCID BAND',
      type: 'ARTIST',
      bio: '서울 기반 올트팝 밴드. 새 싱글 발매. 매달 라이브.',
      location: '서울, 대한민국',
      avatarUrl:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=480&q=80',
      coverUrl:
        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
      connectedTrappistArtistId: 'artist_lucid_001',
      categoryId: musicCat?.id ?? undefined,
      themeId: 'radiant',
      fontBody: 'pretendard',
      fontDisplay: 'fraunces',
      showSparkles: true,
      buttonStyle: 'gradient',
      profileLayout: 'centered',
      isPublished: true,
    },
  });

  console.log(`  Profile: @${lucidProfile.handle}`);

  // Lucid blocks
  const lucidBlocks = [
    {
      type: 'TEXT_ANNOUNCEMENT' as const,
      title: '공지',
      sortOrder: 1,
      configJson: { text: '3월 15일 쇼케이스 티켓 오픈. 선착순 한정 굿즈 포함.' },
    },
    {
      type: 'LINK_BUTTON' as const,
      title: '신곡 듣기',
      sortOrder: 2,
      configJson: { label: 'Spotify에서 듣기', url: 'https://open.spotify.com/' },
    },
    {
      type: 'SOCIAL_ROW' as const,
      title: null,
      sortOrder: 3,
      configJson: {
        links: [
          { label: 'Instagram', url: 'https://instagram.com' },
          { label: 'YouTube', url: 'https://youtube.com' },
          { label: 'TikTok', url: 'https://tiktok.com' },
        ],
      },
    },
    {
      type: 'EVENTS' as const,
      title: '다가오는 공연',
      sortOrder: 4,
      configJson: {},
    },
    {
      type: 'MEDIA_GALLERY' as const,
      title: '갤러리',
      sortOrder: 5,
      configJson: {
        images: [
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
        ],
      },
    },
  ];

  // Delete existing blocks for this profile then recreate
  await prisma.block.deleteMany({ where: { profileId: lucidProfile.id } });

  for (const block of lucidBlocks) {
    await prisma.block.create({
      data: {
        profileId: lucidProfile.id,
        type: block.type,
        title: block.title,
        sortOrder: block.sortOrder,
        configJson: block.configJson,
        isEnabled: true,
      },
    });
  }
  console.log(`    ${lucidBlocks.length} blocks created`);

  // Lucid events
  await prisma.event.deleteMany({ where: { profileId: lucidProfile.id } });

  await prisma.event.createMany({
    data: [
      {
        profileId: lucidProfile.id,
        title: 'LUCID 쇼케이스',
        startsAt: new Date('2026-03-15T19:00:00+09:00'),
        venueName: 'Moonlight Hall',
        ticketUrl: 'https://example.com/tickets/lucid-showcase',
      },
      {
        profileId: lucidProfile.id,
        title: '시티 나이트 페스트',
        startsAt: new Date('2026-03-29T20:00:00+09:00'),
        venueName: '한강 스테이지',
        ticketUrl: 'https://example.com/tickets/city-night-fest',
      },
    ],
  });
  console.log('    2 events created');

  // ─── Moonlight Hall Profile ──────────────────────────────────
  const moonlightProfile = await prisma.profile.upsert({
    where: { handle: 'moonlight_hall' },
    update: { categoryId: venueCat?.id ?? null },
    create: {
      userId: adminUser.id,
      handle: 'moonlight_hall',
      displayName: 'Moonlight Hall',
      type: 'VENUE',
      bio: '인디, 포스트록, 실험 음악을 위한 라이브 하우스.',
      location: '마포구, 서울',
      avatarUrl:
        'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=480&q=80',
      coverUrl:
        'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1600&q=80',
      connectedTrappistPlaceId: 'place_moonlight_001',
      categoryId: venueCat?.id ?? undefined,
      themeId: 'midnight-neon',
      fontBody: 'noto-sans-kr',
      fontDisplay: 'space-grotesk',
      showSparkles: true,
      buttonStyle: 'gradient',
      profileLayout: 'centered',
      isPublished: true,
    },
  });

  console.log(`  Profile: @${moonlightProfile.handle}`);

  // Moonlight blocks
  await prisma.block.deleteMany({ where: { profileId: moonlightProfile.id } });

  await prisma.block.createMany({
    data: [
      {
        profileId: moonlightProfile.id,
        type: 'PLACE_INFO',
        title: '공연장 정보',
        sortOrder: 1,
        configJson: {
          address: '서울시 마포구 와우산로 12-2',
          mapUrl: 'https://maps.google.com',
          contact: 'contact@moonlight.example',
        },
        isEnabled: true,
      },
      {
        profileId: moonlightProfile.id,
        type: 'MEDIA_GALLERY',
        title: '공간',
        sortOrder: 2,
        configJson: {
          images: [
            'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80',
          ],
        },
        isEnabled: true,
      },
      {
        profileId: moonlightProfile.id,
        type: 'EVENTS',
        title: '이번 달 공연',
        sortOrder: 3,
        configJson: {},
        isEnabled: true,
      },
    ],
  });
  console.log('    3 blocks created');

  // Moonlight events
  await prisma.event.deleteMany({ where: { profileId: moonlightProfile.id } });

  await prisma.event.createMany({
    data: [
      {
        profileId: moonlightProfile.id,
        title: '오픈 마이크 목요일',
        startsAt: new Date('2026-03-07T20:00:00+09:00'),
        venueName: 'Moonlight Hall',
      },
      {
        profileId: moonlightProfile.id,
        title: 'Noise & Dreams',
        startsAt: new Date('2026-03-21T20:00:00+09:00'),
        venueName: 'Moonlight Hall',
      },
    ],
  });
  console.log('    2 events created');

  console.log('\nSeed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
