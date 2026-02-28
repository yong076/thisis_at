import { checkBannedHandle } from './banned-handles';

const HANDLE_REGEX = /^[a-z0-9._]{3,30}$/;

export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@/, '').toLowerCase();
}

export function validateHandle(raw: string): { valid: boolean; reason?: string } {
  const handle = normalizeHandle(raw);

  if (!HANDLE_REGEX.test(handle)) {
    return {
      valid: false,
      reason: '핸들은 3~30자의 영문 소문자, 숫자, 점, 밑줄만 사용할 수 있습니다.'
    };
  }

  const banned = checkBannedHandle(handle);
  if (banned) {
    return { valid: false, reason: banned };
  }

  return { valid: true };
}
