export type ThemeCategory = 'light' | 'dark' | 'vibrant' | 'minimal';
export type BorderRadiusStyle = 'sharp' | 'rounded' | 'pill';
export type ButtonStyle = 'gradient' | 'solid' | 'outline' | 'glass';
export type CardStyle = 'glass' | 'solid' | 'border-only' | 'shadow';

export type ThemeConfig = {
  id: string;
  name: string;
  nameKo: string;
  category: ThemeCategory;
  preview: string; // CSS gradient for thumbnail preview

  // Colors
  bgBase: string;
  bgWarm: string;
  bgMesh: string[]; // mesh background blob colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;

  // Gradients
  gradientPrimary: string;
  gradientButton: string;
  gradientButtonHover: string;
  gradientSoft: string;

  // Surfaces
  cardBg: string;
  cardBgStrong: string;
  cardBorder: string;
  cardShadow: string;
  cardBlur: number;

  // Shape
  borderRadius: BorderRadiusStyle;

  // Effects
  meshBaseColor: string; // SVG rect fill
  meshOpacity: number; // global mesh layer opacity
  sparkleColors: string[];
  buttonStyle: ButtonStyle;

  // Glow
  shadowGlow: string;
  shadowGlowWarm: string;

  // Cover overlay (for profile cover images)
  coverOverlay: string;
};
