export type FontCategory = 'sans' | 'serif' | 'mono' | 'display';

export type FontOption = {
  id: string;
  name: string;
  nameKo: string;
  category: FontCategory;
  googleFontName?: string;
  cdnUrl?: string;
  weights: number[];
  previewText: string;
  previewTextKo: string;
};

export const FONT_OPTIONS: FontOption[] = [
  // ── Korean-optimized sans-serif fonts ──────────────────────────────
  {
    id: 'pretendard',
    name: 'Pretendard',
    nameKo: '프리텐다드',
    category: 'sans',
    cdnUrl:
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '다람쥐 헌 쳇바퀴에 타고파',
  },
  {
    id: 'noto-sans-kr',
    name: 'Noto Sans KR',
    nameKo: '노토 산스 KR',
    category: 'sans',
    googleFontName: 'Noto+Sans+KR',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '다람쥐 헌 쳇바퀴에 타고파',
  },
  {
    id: 'nanum-gothic',
    name: 'Nanum Gothic',
    nameKo: '나눔 고딕',
    category: 'sans',
    googleFontName: 'Nanum+Gothic',
    weights: [400, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '다람쥐 헌 쳇바퀴에 타고파',
  },
  {
    id: 'nanum-myeongjo',
    name: 'Nanum Myeongjo',
    nameKo: '나눔 명조',
    category: 'serif',
    googleFontName: 'Nanum+Myeongjo',
    weights: [400, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '다람쥐 헌 쳇바퀴에 타고파',
  },
  {
    id: 'gowun-dodum',
    name: 'Gowun Dodum',
    nameKo: '고운 돋움',
    category: 'sans',
    googleFontName: 'Gowun+Dodum',
    weights: [400],
    previewText: 'The quick brown fox',
    previewTextKo: '다람쥐 헌 쳇바퀴에 타고파',
  },
  {
    id: 'gowun-batang',
    name: 'Gowun Batang',
    nameKo: '고운 바탕',
    category: 'serif',
    googleFontName: 'Gowun+Batang',
    weights: [400, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '다람쥐 헌 쳇바퀴에 타고파',
  },

  // ── Latin sans-serif fonts ─────────────────────────────────────────
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    nameKo: '플러스 자카르타 산스',
    category: 'sans',
    googleFontName: 'Plus+Jakarta+Sans',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },
  {
    id: 'inter',
    name: 'Inter',
    nameKo: '인터',
    category: 'sans',
    googleFontName: 'Inter',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    nameKo: '포핀스',
    category: 'sans',
    googleFontName: 'Poppins',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    nameKo: '스페이스 그로테스크',
    category: 'sans',
    googleFontName: 'Space+Grotesk',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    nameKo: 'DM 산스',
    category: 'sans',
    googleFontName: 'DM+Sans',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },

  // ── Serif & display fonts ──────────────────────────────────────────
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    nameKo: '플레이페어 디스플레이',
    category: 'display',
    googleFontName: 'Playfair+Display',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },
  {
    id: 'lora',
    name: 'Lora',
    nameKo: '로라',
    category: 'serif',
    googleFontName: 'Lora',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },
  {
    id: 'fraunces',
    name: 'Fraunces',
    nameKo: '프라운세스',
    category: 'display',
    googleFontName: 'Fraunces',
    weights: [400, 500, 600, 700],
    previewText: 'The quick brown fox',
    previewTextKo: '빠른 갈색 여우가 뛰어넘다',
  },

  // ── Monospace fonts ────────────────────────────────────────────────
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    nameKo: '젯브레인 모노',
    category: 'mono',
    googleFontName: 'JetBrains+Mono',
    weights: [400, 500, 600, 700],
    previewText: 'const x = 42;',
    previewTextKo: '코드를 작성하세요',
  },
];

// ── Korean Google Font IDs ───────────────────────────────────────────
const KOREAN_GOOGLE_FONT_IDS = new Set([
  'noto-sans-kr',
  'nanum-gothic',
  'nanum-myeongjo',
  'gowun-dodum',
  'gowun-batang',
]);

// ── Default font constants ───────────────────────────────────────────
export const DEFAULT_FONT_BODY = 'plus-jakarta';
export const DEFAULT_FONT_DISPLAY = 'fraunces';

// ── Helper functions ─────────────────────────────────────────────────

export function getFontById(id: string): FontOption | undefined {
  return FONT_OPTIONS.find((font) => font.id === id);
}

export function getFontsByCategory(category: FontCategory): FontOption[] {
  return FONT_OPTIONS.filter((font) => font.category === category);
}

export function getFontCssUrl(font: FontOption): string {
  // Non-Google fonts served via CDN
  if (font.cdnUrl) {
    return font.cdnUrl;
  }

  // Google Fonts URL
  if (font.googleFontName) {
    const weightsParam = font.weights.join(';');
    const base = `https://fonts.googleapis.com/css2?family=${font.googleFontName}:wght@${weightsParam}&display=swap`;

    if (KOREAN_GOOGLE_FONT_IDS.has(font.id)) {
      return `${base}&subset=korean`;
    }

    return base;
  }

  return '';
}
