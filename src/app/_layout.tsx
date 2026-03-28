import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { Colors } from '@constants';

/**
 * Root layout — application shell with navigation stack.
 *
 * Registers all route groups with their presentation modes:
 * - `(auth)` — standard stack for sign-in flow
 * - `(main)` — primary app screens with patrol map
 * - `(drawer)` — bottom sheet screens (formSheet with 3 detents)
 * - `location-request` — full-screen modal
 *
 * Auth gate, global providers, PTT overlay, and SOS banner
 * are layered in at the root level in Steps 3–10.
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
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
    </>
  );
}
