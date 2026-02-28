import { createHash } from 'crypto';

// ─── Daily salt for IP hashing (rotates at midnight UTC) ─────────

function getDailySalt(): string {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `thisis.at:analytics:${today}`;
}

/**
 * Hash an IP address with a daily-rotating salt for privacy.
 * Returns a 16-char hex string — enough for uniqueness, not reversible.
 */
export function hashVisitorIp(ip: string): string {
  const hash = createHash('sha256')
    .update(`${getDailySalt()}:${ip}`)
    .digest('hex');
  return hash.slice(0, 16);
}

// ─── User-Agent Parsing ──────────────────────────────────────────

export function parseDeviceType(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function parseBrowserName(ua: string): string {
  if (/edg(e|a|ios)?/i.test(ua)) return 'Edge';
  if (/opr|opera/i.test(ua)) return 'Opera';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/samsung/i.test(ua)) return 'Samsung';
  if (/crios|chrome/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua)) return 'Safari';
  return 'Other';
}

export function parseOsName(ua: string): string {
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os/i.test(ua)) return 'macOS';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/android/i.test(ua)) return 'Android';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Other';
}

// ─── Header extraction ──────────────────────────────────────────

export function extractClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}

export function extractCountry(headers: Headers): string | null {
  return headers.get('x-vercel-ip-country') || null;
}

export function extractRegion(headers: Headers): string | null {
  return headers.get('x-vercel-ip-country-region') || null;
}

export function extractCity(headers: Headers): string | null {
  return headers.get('x-vercel-ip-city')
    ? decodeURIComponent(headers.get('x-vercel-ip-city')!)
    : null;
}

// ─── Bot detection ──────────────────────────────────────────────

export function isBot(ua: string): boolean {
  return /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|linkedinbot|twitterbot|whatsapp|telegram|pinterest|googlebot/i.test(ua);
}

// ─── Sanitize input ─────────────────────────────────────────────

export function truncate(str: string | null | undefined, maxLen: number): string | null {
  if (!str) return null;
  return str.slice(0, maxLen);
}
