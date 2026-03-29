import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthGate } from '@/components/auth/auth-gate';
import { Colors } from '@constants';
import { AuthProvider } from '@/providers/auth-provider';
import { LocationProvider } from '@/providers/location-provider';

/**
 * Root layout — application shell with auth gate, location provider,
 * and navigation stack.
 *
 * Provider wrapping order (outermost → innermost):
 * 1. AuthProvider — JWT state management
 * 2. LocationProvider — GPS position, heading, peer/SOS pins
 * 3. AuthGate — route guard (redirects based on auth state)
 *
 * Additional providers (WebSocket, PTT, SOS, Presence)
 * are layered in at this level in Steps 6–10.
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <AuthProvider>
      <LocationProvider>
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
      </LocationProvider>
    </AuthProvider>
  );
}
