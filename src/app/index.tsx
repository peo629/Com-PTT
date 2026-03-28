import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '@constants';

/**
 * Root entry point — transitional loading state.
 *
 * AuthGate (in _layout.tsx) handles all routing decisions:
 * - Authenticated → /(main)
 * - Unauthenticated → /(auth)/sign-in
 *
 * This screen briefly renders during initial hydration before
 * the auth gate redirects to the appropriate destination.
 */
export default function Index(): React.JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgPrimary,
      }}
    >
      <ActivityIndicator size="large" color={Colors.accentBlue} />
    </View>
  );
}
