/**
 * SOS marker — pulsing red pin rendered at an officer's GPS position
 * during a Code 1 emergency.
 *
 * Renders with highest z-index and a pulsing animation ring
 * to draw immediate attention on the map.
 *
 * @module components/map/sos-marker
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

import { Colors } from '@constants';
import type { SOSLocation } from '@/types/location';

/** Props for the SOSMarker component. */
interface SOSMarkerProps {
  /** SOS location data. */
  sos: SOSLocation;
}

/** Size of the SOS pin in points. */
const PIN_SIZE = 20;
/** Size of the pulsing ring at max scale. */
const PULSE_SIZE = 40;

/**
 * Renders a pulsing red SOS marker at the sounding officer's position.
 *
 * The marker pulses continuously to indicate an active emergency.
 * Uses highest z-index to render above all other markers.
 */
export function SOSMarker({ sos }: SOSMarkerProps): React.JSX.Element {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.2],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  return (
    <Marker
      coordinate={{
        latitude: sos.coord.latitude,
        longitude: sos.coord.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={9999}
      tracksViewChanges
      testID={`sos-marker-${sos.sosId}`}
    >
      <View
        style={{
          width: PULSE_SIZE,
          height: PULSE_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulsing ring */}
        <Animated.View
          style={{
            position: 'absolute',
            width: PULSE_SIZE,
            height: PULSE_SIZE,
            borderRadius: PULSE_SIZE / 2,
            backgroundColor: Colors.accentRed,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          }}
          testID="sos-pulse-ring"
        />
        {/* Solid centre pin */}
        <View
          style={{
            width: PIN_SIZE,
            height: PIN_SIZE,
            borderRadius: PIN_SIZE / 2,
            backgroundColor: Colors.accentRed,
            borderWidth: 2,
            borderColor: Colors.sosFlashB,
          }}
        />
      </View>

      <Callout tooltip>
        <View
          style={{
            backgroundColor: Colors.accentRed,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '800',
              color: Colors.sosFlashB,
            }}
          >
            SOS — {sos.callsign}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}
