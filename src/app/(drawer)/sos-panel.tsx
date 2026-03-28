import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@constants';

/**
 * SOS panel screen — Code 1 emergency trigger and status display.
 *
 * Shown in the bottom drawer at the peek (0.15) detent.
 * SOS provider, alarm audio, and power-button detection integrated in Step 8.
 */
export default function SOSPanelScreen(): React.JSX.Element {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.bgPrimary }}
      edges={['bottom']}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 16 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: Colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Emergency
        </Text>

        <Pressable
          onLongPress={() => undefined}
          delayLongPress={1500}
          style={({ pressed }) => ({
            backgroundColor: pressed ? Colors.accentRed + 'CC' : Colors.accentRed,
            paddingVertical: 20,
            borderRadius: 16,
            alignItems: 'center',
          })}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: Colors.sosFlashB,
              letterSpacing: 1,
            }}
          >
            {'\u26A0'} ACTIVATE SOS
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.sosFlashB + 'AA',
              marginTop: 4,
            }}
          >
            Press and hold to trigger Code 1
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Colors.accentGreen,
            }}
          />
          <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
            System normal — no active alerts
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
