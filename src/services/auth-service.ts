/**
 * Auth service — REST API calls for authentication.
 *
 * Handles sign-in, token refresh, and sign-out against the
 * backend REST endpoint configured via EXPO_PUBLIC_REST_URL.
 *
 * Domain restriction enforced client-side: only .gov.au emails accepted.
 */

import type { AuthTokens, User } from '@/types/auth';
import { ALLOWED_EMAIL_DOMAINS } from '@/types/auth';

const API_BASE = process.env.EXPO_PUBLIC_REST_URL ?? '';

/** Error thrown when auth operations fail. */
export class AuthError extends Error {
  /** HTTP status code from the failed request (0 for client-side errors). */
  public readonly statusCode: number;

  constructor(message: string, statusCode = 0) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/** Shape of the sign-in API response. */
interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/** Shape of the token refresh API response. */
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Validates that the email domain is an allowed government domain.
 *
 * Accepts any email where the domain part ends with `.gov.au`
 * (covers @melbournecity.gov.au, @vic.gov.au, @gov.au, etc.).
 */
export function isAllowedEmailDomain(email: string): boolean {
  const parts = email.toLowerCase().split('@');
  const domain = parts[1];
  if (!domain) return false;
  return ALLOWED_EMAIL_DOMAINS.some(
    (allowed) => domain === allowed.slice(1) || domain.endsWith(allowed),
  );
}

/**
 * Authenticate with email and password.
 *
 * @throws {AuthError} On invalid domain, credentials, or network error.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<{ user: User; tokens: AuthTokens }> {
  if (!isAllowedEmailDomain(email)) {
    throw new AuthError(
      'Email domain not permitted. Use a .gov.au address.',
      403,
    );
  }

  const response = await fetch(`${API_BASE}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Invalid email or password.'
        : `Sign-in failed (${String(response.status)}).`;
    throw new AuthError(message, response.status);
  }

  const data = (await response.json()) as SignInResponse;

  return {
    user: data.user,
    tokens: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    },
  };
}

/**
 * Exchange a refresh token for a new token pair.
 *
 * @throws {AuthError} On expired refresh token or network error.
 */
export async function refreshTokens(
  refreshToken: string,
): Promise<AuthTokens> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new AuthError('Token refresh failed.', response.status);
  }

  const data = (await response.json()) as RefreshResponse;

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

/**
 * Notify the server of sign-out (best-effort).
 *
 * Does not throw on failure — local sign-out proceeds regardless.
 */
export async function signOut(accessToken: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/sign-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    // Best-effort — local sign-out proceeds regardless of server response
  }
}
