import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@constants';

/** Available PTT communication modes. */
const PTT_MODES = [
  { id: 'dispatch', label: 'Dispatch', description: 'Talk to dispatch' },
  { id: 'all', label: 'All Officers', description: 'Broadcast to all officers' },
  { id: 'officer', label: 'Officer (1:1)', description: 'Private officer-to-officer' },
] as const;

/**
 * Channel select screen — PTT communication mode picker.
 *
 * Presented as a formSheet from the patrol map.
 * Full channel switching logic integrated in Step 7.
 */
export default function ChannelSelectScreen(): React.JSX.Element {
  const handleSelectChannel = (_channelId: string) => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: Colors.textPrimary,
          }}
        >
          Select Channel
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {PTT_MODES.map((mode) => (
          <Pressable
            key={mode.id}
            onPress={() => handleSelectChannel(mode.id)}
            style={({ pressed }) => ({
              backgroundColor: Colors.bgSurface,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors.textPrimary,
              }}
            >
              {mode.label}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: Colors.textSecondary,
                marginTop: 4,
              }}
            >
              {mode.description}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
