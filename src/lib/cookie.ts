// src/lib/cookies.ts

export interface SetCookieOptions {
  maxAgeSeconds?: number;
  path?: string;
}

export function setCookie(
  name: string,
  value: string,
  options: SetCookieOptions = {},
): void {
  if (typeof document === 'undefined') return;

  const { maxAgeSeconds = 60 * 60 * 24 * 7, path = '/' } = options;
  const isSecureContext =
    typeof window !== 'undefined' && window.location.protocol === 'https:';

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${path}`,
    `max-age=${maxAgeSeconds}`,
    'samesite=lax',
    isSecureContext ? 'secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=${path}; max-age=0`;
}
