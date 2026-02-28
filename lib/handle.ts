const RESERVED = new Set([
  'admin',
  'analytics',
  'api',
  'support',
  'terms',
  'privacy',
  'login',
  'dashboard',
  'editor',
  'settings'
]);

const HANDLE_REGEX = /^[a-z0-9._]{3,30}$/;

export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@/, '').toLowerCase();
}

export function validateHandle(raw: string): { valid: boolean; reason?: string } {
  const handle = normalizeHandle(raw);

  if (!HANDLE_REGEX.test(handle)) {
    return {
      valid: false,
      reason: 'Handle must be 3-30 chars, lowercase letters, numbers, dot, underscore only.'
    };
  }

  if (RESERVED.has(handle)) {
    return {
      valid: false,
      reason: 'Reserved handle.'
    };
  }

  return { valid: true };
}
