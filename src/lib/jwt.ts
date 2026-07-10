// src/lib/jwt.ts
export interface DecodedAccessToken {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded.padEnd(
    padded.length + ((4 - (padded.length % 4)) % 4),
    '=',
  );

  if (typeof atob === 'function') {
    return decodeURIComponent(
      atob(withPadding)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
  }
  return Buffer.from(withPadding, 'base64').toString('utf-8');
}

export function decodeAccessToken(
  token: string | null | undefined,
): DecodedAccessToken | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as DecodedAccessToken;
    if (!payload.role || !payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined): boolean {
  const decoded = decodeAccessToken(token);
  if (!decoded?.exp) return false;
  return Date.now() >= decoded.exp * 1000;
}
