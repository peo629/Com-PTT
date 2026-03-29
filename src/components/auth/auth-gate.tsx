/**
 * AuthGate — route guard that redirects based on authentication state.
 *
 * Behaviour:
 * - Shows a branded loading screen while auth state hydrates from secure storage.
 * - Redirects unauthenticated users to (auth)/sign-in.
 * - Redirects authenticated users away from (auth) group to (main).
 * - Renders children when auth state is resolved and route matches.
 */

import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Colors } from '@constants';
import { useAuth } from '@/providers/auth-provider';

/** AuthGate props. */
interface AuthGateProps {
  /** Child navigation tree to render when auth state is resolved. */
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(main)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.bgPrimary,
        }}
        testID="auth-gate-loading"
      >
        <ActivityIndicator
          size="large"
          color={Colors.accentBlue}
          accessibilityLabel="Loading authentication"
        />
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: 14,
            marginTop: 16,
          }}
        >
          Loading…
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
