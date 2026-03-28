import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@constants';

/**
 * Main group layout — primary app navigation stack.
 *
 * Houses the patrol map (index), channel picker (formSheet),
 * and officer profile (modal). PTT button overlay and SOS banner
 * are rendered at the root level above this stack.
 */
export default function MainLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bgPrimary },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="channel-select"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 0.85],
          sheetGrabberVisible: true,
          sheetCornerRadius: 16,
        }}
      />
      <Stack.Screen
        name="officer-profile"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
