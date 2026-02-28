import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';

const VALID_BUTTON_STYLES = ['gradient', 'solid', 'outline', 'glass'];
const VALID_CARD_STYLES = ['glass', 'solid', 'border-only', 'shadow'];
const VALID_LAYOUTS = ['centered', 'left-aligned'];

/**
 * PATCH /api/editor/[handle]/customization
 * Save theme/font/style customization for a profile.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const ownership = await requireProfileOwnership(handle);

  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const body = await req.json();
  const {
    themeId,
    fontBody,
    fontDisplay,
    customAccentColor,
    buttonStyle,
    cardStyle,
    showSparkles,
    profileLayout,
  } = body as {
    themeId?: string;
    fontBody?: string;
    fontDisplay?: string;
    customAccentColor?: string;
    buttonStyle?: string;
    cardStyle?: string;
    showSparkles?: boolean;
    profileLayout?: string;
  };

  const updateData: Record<string, unknown> = {};

  if (themeId !== undefined) {
    updateData.themeId = themeId;
  }

  if (fontBody !== undefined) {
    updateData.fontBody = fontBody;
  }

  if (fontDisplay !== undefined) {
    updateData.fontDisplay = fontDisplay;
  }

  if (customAccentColor !== undefined) {
    updateData.customAccentColor = customAccentColor || null;
  }

  if (buttonStyle !== undefined) {
    if (!VALID_BUTTON_STYLES.includes(buttonStyle)) {
      return NextResponse.json({ error: '유효하지 않은 버튼 스타일입니다.' }, { status: 400 });
    }
    updateData.buttonStyle = buttonStyle;
  }

  if (cardStyle !== undefined) {
    if (!VALID_CARD_STYLES.includes(cardStyle)) {
      return NextResponse.json({ error: '유효하지 않은 카드 스타일입니다.' }, { status: 400 });
    }
    updateData.cardStyle = cardStyle;
  }

  if (showSparkles !== undefined) {
    updateData.showSparkles = Boolean(showSparkles);
  }

  if (profileLayout !== undefined) {
    if (!VALID_LAYOUTS.includes(profileLayout)) {
      return NextResponse.json({ error: '유효하지 않은 레이아웃입니다.' }, { status: 400 });
    }
    updateData.profileLayout = profileLayout;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: '수정할 내용이 없습니다.' }, { status: 400 });
  }

  const profile = await prisma.profile.update({
    where: { id: ownership.profile.id },
    data: updateData,
    select: {
      themeId: true,
      fontBody: true,
      fontDisplay: true,
      customAccentColor: true,
      buttonStyle: true,
      cardStyle: true,
      showSparkles: true,
      profileLayout: true,
    },
  });

  return NextResponse.json({ ok: true, customization: profile });
}
