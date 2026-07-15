const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1];
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return JSON.parse(atob(padded));
}

export function getRoleFromToken(token: string): string | null {
  try {
    const payload = decodeJwtPayload(token);
    return (payload[ROLE_CLAIM] as string) ?? null;
  } catch {
    return null;
  }
}
