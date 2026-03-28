import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@constants';

/**
 * Officer profile screen — displays details for a selected officer.
 *
 * Presented as a modal from the patrol map or Code 2 roster.
 * Officer data populated via roster/presence provider in Step 9.
 */
export default function OfficerProfileScreen(): React.JSX.Element {
  const { callsign } = useLocalSearchParams<{ callsign?: string }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: Colors.textPrimary,
          }}
        >
          Officer Profile
        </Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: Colors.accentGreen,
            }}
          >
            Close
          </Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 16 }}>
        <View
          style={{
            backgroundColor: Colors.bgSurface,
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: Colors.accentGreen + '33',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: Colors.accentGreen,
              }}
            >
              {callsign ? callsign.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.textPrimary,
            }}
          >
            {callsign ?? 'Unknown Officer'}
          </Text>
          <View
            style={{
              backgroundColor: Colors.accentGreen + '22',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: Colors.accentGreen,
              }}
            >
              Online
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/location-request')}
          style={({ pressed }) => ({
            backgroundColor: Colors.accentGreen,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              color: Colors.textPrimary,
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            Request Location
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
