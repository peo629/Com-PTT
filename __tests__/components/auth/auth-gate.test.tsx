import { render, screen } from '@testing-library/react-native';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { AuthGate } from '@/components/auth/auth-gate';
import type { AuthContextValue } from '@/types/auth';

/** Shared mock for useAuth — overridden per test. */
let mockAuthValue: AuthContextValue;

jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => mockAuthValue,
}));

const mockUseSegments = useSegments as jest.MockedFunction<typeof useSegments>;
const mockRouter = useRouter();

describe('AuthGate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSegments.mockReturnValue([] as unknown as ReturnType<typeof useSegments>);
  });

  it('shows loading indicator while auth state is hydrating', () => {
    mockAuthValue = {
      state: { status: 'loading', user: null, tokens: null },
      signIn: jest.fn(),
      signOut: jest.fn(),
      isAuthenticated: false,
      isLoading: true,
    };

    render(
      <AuthGate>
        <Text>Protected Content</Text>
      </AuthGate>,
    );

    expect(screen.getByText('Loading…')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('renders children when authenticated and in non-auth route', () => {
    mockAuthValue = {
      state: {
        status: 'authenticated',
        user: {
          id: '1',
          email: 'officer@gov.au',
          callsign: 'P-01',
          role: 'officer',
        },
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      },
      signIn: jest.fn(),
      signOut: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
    };
    mockUseSegments.mockReturnValue(
      ['(main)'] as unknown as ReturnType<typeof useSegments>,
    );

    render(
      <AuthGate>
        <Text>Protected Content</Text>
      </AuthGate>,
    );

    expect(screen.getByText('Protected Content')).toBeTruthy();
  });

  it('redirects to sign-in when unauthenticated and outside auth group', () => {
    mockAuthValue = {
      state: { status: 'unauthenticated', user: null, tokens: null },
      signIn: jest.fn(),
      signOut: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
    };
    mockUseSegments.mockReturnValue(
      ['(main)'] as unknown as ReturnType<typeof useSegments>,
    );

    render(
      <AuthGate>
        <Text>Protected Content</Text>
      </AuthGate>,
    );

    expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/sign-in');
  });

  it('redirects to main when authenticated and inside auth group', () => {
    mockAuthValue = {
      state: {
        status: 'authenticated',
        user: {
          id: '1',
          email: 'officer@gov.au',
          callsign: 'P-01',
          role: 'officer',
        },
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      },
      signIn: jest.fn(),
      signOut: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
    };
    mockUseSegments.mockReturnValue(
      ['(auth)'] as unknown as ReturnType<typeof useSegments>,
    );

    render(
      <AuthGate>
        <Text>Content</Text>
      </AuthGate>,
    );

    expect(mockRouter.replace).toHaveBeenCalledWith('/(main)');
  });

  it('does not redirect when unauthenticated and already in auth group', () => {
    mockAuthValue = {
      state: { status: 'unauthenticated', user: null, tokens: null },
      signIn: jest.fn(),
      signOut: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
    };
    mockUseSegments.mockReturnValue(
      ['(auth)'] as unknown as ReturnType<typeof useSegments>,
    );

    render(
      <AuthGate>
        <Text>Auth Content</Text>
      </AuthGate>,
    );

    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(screen.getByText('Auth Content')).toBeTruthy();
  });
});
