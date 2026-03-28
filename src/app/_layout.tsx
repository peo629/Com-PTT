import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthGate } from '@/components/auth/auth-gate';
import { Colors } from '@constants';
import { AuthProvider } from '@/providers/auth-provider';

/**
 * Root layout — application shell with auth gate and navigation stack.
 *
 * Wraps the entire app in AuthProvider for JWT state management.
 * AuthGate redirects unauthenticated users to (auth)/sign-in
 * and authenticated users away from the auth group to (main).
 *
 * Route groups:
 * - `(auth)`  — standard stack for sign-in flow
 * - `(main)`  — primary app screens with patrol map
 * - `(drawer)` — bottom sheet screens (formSheet with 3 detents)
 * - `location-request` — full-screen modal
 *
 * Additional providers (WebSocket, PTT, Location, SOS, Presence)
 * are layered in at this level in Steps 6–10.
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <AuthProvider>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <AuthGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.bgPrimary },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen
            name="(drawer)"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.15, 0.5, 0.85],
              sheetGrabberVisible: true,
              sheetCornerRadius: 16,
            }}
          />
          <Stack.Screen
            name="location-request"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </AuthGate>
    </AuthProvider>
  );
}
