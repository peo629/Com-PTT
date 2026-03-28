import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@constants';

/**
 * Location request modal — approve, standby, or decline an incoming
 * live-location sharing request from dispatch or another officer.
 *
 * Location service and request protocol integrated in Step 10.
 */
export default function LocationRequestScreen(): React.JSX.Element {
  const handleRespond = (_response: 'approve' | 'standby' | 'decline') => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          gap: 24,
        }}
      >
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: Colors.textPrimary,
            }}
          >
            Location Request
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            Dispatch has requested your live location.
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}
          >
            Sharing lasts 5 minutes with auto-expiry.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: Colors.bgSurface,
            borderRadius: 16,
            padding: 20,
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => handleRespond('approve')}
            style={({ pressed }) => ({
              backgroundColor: Colors.accentGreen,
              paddingVertical: 16,
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
              Approve — Share Location
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleRespond('standby')}
            style={({ pressed }) => ({
              backgroundColor: Colors.accentAmber,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                color: Colors.bgPrimary,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              Standby — 30s Renewal
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleRespond('decline')}
            style={({ pressed }) => ({
              backgroundColor: Colors.accentRed + '22',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.accentRed,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                color: Colors.accentRed,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              Decline
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            alignItems: 'center',
            paddingVertical: 12,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>
            Dismiss
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
