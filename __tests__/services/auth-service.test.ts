import {
  AuthError,
  isAllowedEmailDomain,
  refreshTokens,
  signIn,
  signOut,
} from '@/services/auth-service';

/** Mock global fetch for all auth service tests. */
const mockFetch = jest.fn<
  Promise<{ ok: boolean; status: number; json?: () => Promise<unknown> }>,
  [RequestInfo | URL, RequestInit?]
>();
global.fetch = mockFetch as unknown as typeof fetch;

describe('auth-service', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  // ── isAllowedEmailDomain ──────────────────────────────
  describe('isAllowedEmailDomain', () => {
    it('accepts @melbournecity.gov.au emails', () => {
      expect(isAllowedEmailDomain('officer@melbournecity.gov.au')).toBe(true);
    });

    it('accepts other .gov.au sub-domains', () => {
      expect(isAllowedEmailDomain('user@vic.gov.au')).toBe(true);
    });

    it('accepts @gov.au directly', () => {
      expect(isAllowedEmailDomain('admin@gov.au')).toBe(true);
    });

    it('rejects non-.gov.au domains', () => {
      expect(isAllowedEmailDomain('user@gmail.com')).toBe(false);
    });

    it('rejects email without @ symbol', () => {
      expect(isAllowedEmailDomain('nodomain')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isAllowedEmailDomain('')).toBe(false);
    });

    it('is case-insensitive', () => {
      expect(isAllowedEmailDomain('User@Melbourne.GOV.AU')).toBe(true);
    });
  });

  // ── signIn ────────────────────────────────────────────
  describe('signIn', () => {
    it('rejects non-.gov.au email before making network call', async () => {
      await expect(signIn('user@gmail.com', 'pass')).rejects.toThrow(
        'Email domain not permitted',
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns user and tokens on successful authentication', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'officer@gov.au',
          callsign: 'PATROL-01',
          role: 'officer',
        },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await signIn('officer@gov.au', 'password');

      expect(result.user.callsign).toBe('PATROL-01');
      expect(result.tokens.accessToken).toBe('access-token-123');
      expect(result.tokens.refreshToken).toBe('refresh-token-456');
    });

    it('throws AuthError with 401 message on invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      await expect(signIn('user@gov.au', 'wrong')).rejects.toThrow(
        'Invalid email or password.',
      );
    });

    it('throws AuthError with status on other HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(signIn('user@gov.au', 'pass')).rejects.toThrow(
        'Sign-in failed (500).',
      );
    });
  });

  // ── refreshTokens ─────────────────────────────────────
  describe('refreshTokens', () => {
    it('returns new token pair on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
          }),
      });

      const tokens = await refreshTokens('old-refresh');

      expect(tokens.accessToken).toBe('new-access');
      expect(tokens.refreshToken).toBe('new-refresh');
    });

    it('throws AuthError on refresh failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      await expect(refreshTokens('expired-token')).rejects.toThrow(
        'Token refresh failed.',
      );
    });
  });

  // ── signOut ────────────────────────────────────────────
  describe('signOut', () => {
    it('sends sign-out request with bearer token', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

      await signOut('access-token-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/sign-out'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token-123',
          }),
        }),
      );
    });

    it('does not throw on network error (best-effort)', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(signOut('token')).resolves.toBeUndefined();
    });
  });
});
