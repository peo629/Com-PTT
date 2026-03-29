import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import React from 'react';

import { AuthProvider, useAuth } from '@/providers/auth-provider';
import * as authService from '@/services/auth-service';

// Mock auth service module
jest.mock('@/services/auth-service');
const mockAuthService = authService as jest.Mocked<typeof authService>;

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: token refresh fails (no valid session)
    mockAuthService.refreshTokens.mockRejectedValue(
      new Error('No valid token'),
    );
  });

  it('starts loading then resolves to unauthenticated when no stored tokens', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially loading (idle → loading during hydration)
    expect(result.current.isLoading).toBe(true);

    // Resolves to unauthenticated
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBeNull();
  });

  it('hydrates from secure storage when tokens exist and refresh succeeds', async () => {
    // Pre-populate secure store
    await SecureStore.setItemAsync(
      'com_ptt_auth_user',
      JSON.stringify({
        id: '1',
        email: 'officer@gov.au',
        callsign: 'PATROL-01',
        role: 'officer',
      }),
    );
    await SecureStore.setItemAsync(
      'com_ptt_auth_tokens',
      JSON.stringify({
        accessToken: 'old-at',
        refreshToken: 'old-rt',
      }),
    );

    mockAuthService.refreshTokens.mockResolvedValueOnce({
      accessToken: 'fresh-at',
      refreshToken: 'fresh-rt',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(result.current.state.user?.callsign).toBe('PATROL-01');
    expect(result.current.state.tokens?.accessToken).toBe('fresh-at');
  });

  it('signIn updates state to authenticated', async () => {
    const mockUser = {
      id: '1',
      email: 'officer@gov.au',
      callsign: 'PATROL-01',
      role: 'officer' as const,
    };
    const mockTokens = {
      accessToken: 'at-123',
      refreshToken: 'rt-456',
    };

    mockAuthService.signIn.mockResolvedValueOnce({
      user: mockUser,
      tokens: mockTokens,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signIn('officer@gov.au', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.state.user?.callsign).toBe('PATROL-01');
  });

  it('signIn failure keeps unauthenticated and re-throws error', async () => {
    mockAuthService.signIn.mockRejectedValueOnce(
      new Error('Invalid credentials'),
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.signIn('user@gov.au', 'wrong');
      }),
    ).rejects.toThrow('Invalid credentials');

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('signOut clears state and secure storage', async () => {
    const mockUser = {
      id: '1',
      email: 'officer@gov.au',
      callsign: 'PATROL-01',
      role: 'officer' as const,
    };
    const mockTokens = {
      accessToken: 'at-123',
      refreshToken: 'rt-456',
    };

    mockAuthService.signIn.mockResolvedValueOnce({
      user: mockUser,
      tokens: mockTokens,
    });
    mockAuthService.signOut.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Sign in first
    await act(async () => {
      await result.current.signIn('officer@gov.au', 'password');
    });
    expect(result.current.isAuthenticated).toBe(true);

    // Sign out
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBeNull();
    expect(result.current.state.tokens).toBeNull();
  });

  it('throws when useAuth is called outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
