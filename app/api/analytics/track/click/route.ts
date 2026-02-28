import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  hashVisitorIp,
  parseDeviceType,
  extractClientIp,
  extractCountry,
  isBot,
  truncate,
} from '@/lib/analytics-utils';

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get('user-agent') || '';

    if (isBot(ua)) {
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();
    const { profileId, blockId, blockType, targetUrl, label } = body;

    if (!profileId || !blockId || !blockType) {
      return NextResponse.json({ error: 'profileId, blockId, blockType required' }, { status: 400 });
    }

    const ip = extractClientIp(req.headers);
    const visitorHash = hashVisitorIp(ip);

    await prisma.linkClick.create({
      data: {
        profileId,
        blockId,
        visitorHash,
        blockType: truncate(blockType, 64)!,
        targetUrl: truncate(targetUrl, 2048),
        label: truncate(label, 256),
        deviceType: parseDeviceType(ua),
        country: extractCountry(req.headers),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'tracking failed' }, { status: 500 });
  }
}
