import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@constants';

/**
 * Code 2 roster screen — displays all officers currently signed in.
 *
 * Shown in the bottom drawer at the half (0.5) detent.
 * Presence provider and live roster data integrated in Step 9.
 */
export default function Code2RosterScreen(): React.JSX.Element {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.bgPrimary }}
      edges={['bottom']}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: Colors.accentGreen,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: Colors.textPrimary,
            }}
          >
            Code 2 — Online
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            color: Colors.textSecondary,
            marginTop: 4,
          }}
        >
          Officers currently signed in
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
          gap: 8,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View
          style={{
            backgroundColor: Colors.bgSurface,
            borderRadius: 12,
            padding: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
            No officers online
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
