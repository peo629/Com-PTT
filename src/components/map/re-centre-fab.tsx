/**
 * Re-centre FAB — floating action button to return the map
 * to the officer's current GPS position.
 *
 * Appears when the user manually pans away from their location.
 *
 * @module components/map/re-centre-fab
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

import { Colors } from '@constants';

/** Props for the ReCentreFab component. */
interface ReCentreFabProps {
  /** Callback to re-centre the map. */
  onPress: () => void;
}

/**
 * Floating action button positioned bottom-right above the map.
 *
 * Triggers haptic feedback on press (iOS).
 * Uses a compass/crosshair icon (Unicode) with surface background.
 */
export function ReCentreFab({ onPress }: ReCentreFabProps): React.JSX.Element {
  const handlePress = (): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      testID="re-centre-fab"
      style={({ pressed }) => ({
        position: 'absolute',
        bottom: 24,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.bgSurface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
        // Shadow for Android
        elevation: 4,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      })}
    >
      <Text style={{ fontSize: 22, color: Colors.textPrimary }}>
        {'\u2316'}
      </Text>
    </Pressable>
  );
}
