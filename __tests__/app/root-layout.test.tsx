import { render } from '@testing-library/react-native';
import React from 'react';

import RootLayout from '@/app/_layout';
import type { AuthContextValue } from '@/types/auth';

/** Default mock auth value — unauthenticated, not loading. */
const mockAuthValue: AuthContextValue = {
  state: { status: 'unauthenticated', user: null, tokens: null },
  signIn: jest.fn(),
  signOut: jest.fn(),
  isAuthenticated: false,
  isLoading: false,
};

jest.mock('@/providers/auth-provider', () => ({
  AuthProvider: function MockAuthProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  },
  useAuth: () => mockAuthValue,
}));

jest.mock('@/components/auth/auth-gate', () => ({
  AuthGate: function MockAuthGate({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  },
}));

describe('RootLayout', () => {
  it('renders the root stack with AuthProvider and AuthGate', () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
