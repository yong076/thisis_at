import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  hashVisitorIp,
  parseDeviceType,
  parseBrowserName,
  parseOsName,
  extractClientIp,
  extractCountry,
  extractRegion,
  extractCity,
  isBot,
  truncate,
} from '@/lib/analytics-utils';

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get('user-agent') || '';

    // Skip bots
    if (isBot(ua)) {
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();
    const { profileId, sessionId, referrer, utmSource, utmMedium, utmCampaign, utmContent, utmTerm } = body;

    if (!profileId || typeof profileId !== 'string') {
      return NextResponse.json({ error: 'profileId required' }, { status: 400 });
    }

    const ip = extractClientIp(req.headers);
    const visitorHash = hashVisitorIp(ip);

    await prisma.pageView.create({
      data: {
        profileId,
        visitorHash,
        sessionId: truncate(sessionId, 64),
        referrer: truncate(referrer, 2048),
        userAgent: truncate(ua, 512),
        deviceType: parseDeviceType(ua),
        browserName: parseBrowserName(ua),
        osName: parseOsName(ua),
        country: extractCountry(req.headers),
        region: extractRegion(req.headers),
        city: extractCity(req.headers),
        utmSource: truncate(utmSource, 256),
        utmMedium: truncate(utmMedium, 256),
        utmCampaign: truncate(utmCampaign, 256),
        utmContent: truncate(utmContent, 256),
        utmTerm: truncate(utmTerm, 256),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'tracking failed' }, { status: 500 });
  }
}
