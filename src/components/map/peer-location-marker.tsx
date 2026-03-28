/**
 * Peer location marker — renders a labelled pin for another officer
 * whose live location has been approved.
 *
 * Distinct from the officer marker (different colour, shows callsign).
 *
 * @module components/map/peer-location-marker
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

import { Colors } from '@constants';
import type { PeerLocation } from '@/types/location';

/** Props for the PeerLocationMarker component. */
interface PeerLocationMarkerProps {
  /** Peer officer's location data. */
  peer: PeerLocation;
}

/** Size of the peer pin in points. */
const PIN_SIZE = 14;

/**
 * Renders a labelled pin marker for an approved peer officer's live location.
 *
 * Shows a blue circle pin with the officer's callsign in a callout.
 * Pin colour differentiates peer locations from the officer's own marker.
 */
export function PeerLocationMarker({
  peer,
}: PeerLocationMarkerProps): React.JSX.Element {
  return (
    <Marker
      coordinate={{
        latitude: peer.coord.latitude,
        longitude: peer.coord.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      testID={`peer-marker-${peer.officerId}`}
    >
      <View style={{ alignItems: 'center' }}>
        {/* Callsign label above pin */}
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            color: Colors.textPrimary,
            backgroundColor: Colors.bgSurface + 'CC',
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 2,
          }}
          numberOfLines={1}
        >
          {peer.callsign}
        </Text>
        {/* Circular pin */}
        <View
          style={{
            width: PIN_SIZE,
            height: PIN_SIZE,
            borderRadius: PIN_SIZE / 2,
            backgroundColor: Colors.accentAmber,
            borderWidth: 2,
            borderColor: Colors.textPrimary,
          }}
        />
      </View>

      <Callout tooltip>
        <View
          style={{
            backgroundColor: Colors.bgSurface,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: Colors.textPrimary,
            }}
          >
            {peer.callsign}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}
