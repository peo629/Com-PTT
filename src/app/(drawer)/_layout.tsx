import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@constants';

/**
 * Drawer group layout — stack navigator for bottom sheet screens.
 *
 * Presented as a formSheet from the root layout with
 * detents [0.15, 0.5, 0.85] (peek → half → full).
 */
export default function DrawerLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bgPrimary },
      }}
    />
  );
}
