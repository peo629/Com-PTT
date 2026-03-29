import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@constants';

/** Auth group layout — stack navigator for authentication screens. */
export default function AuthLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bgPrimary },
        animation: 'fade',
      }}
    />
  );
}
