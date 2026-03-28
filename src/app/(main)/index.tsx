import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Colors } from '@constants';

/**
 * Patrol map screen — full-screen interactive map displaying
 * the officer's real-time position with a directional heading indicator.
 *
 * Map component and location tracking hooks are integrated in Step 4.
 */
export default function PatrolMapScreen(): React.JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.bgPrimary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={Colors.accentGreen} />
      <Text
        style={{
          color: Colors.textSecondary,
          fontSize: 14,
          marginTop: 16,
        }}
      >
        Initialising patrol map\u2026
      </Text>
    </View>
  );
}
