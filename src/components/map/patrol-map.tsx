/**
 * Patrol map — full-screen interactive map displaying the officer's
 * real-time position with directional heading and overlay markers.
 *
 * Renders Google Maps on Android and Apple Maps on iOS.
 * Integrates officer marker, peer location pins, and SOS markers.
 *
 * @module components/map/patrol-map
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { Colors } from '@constants';
import { useLocation } from '@/providers/location-provider';
import { OfficerMarker } from './officer-marker';
import { PeerLocationMarker } from './peer-location-marker';
import { SOSMarker } from './sos-marker';
import { ReCentreFab } from './re-centre-fab';

/** Default map region centred on Melbourne CBD. */
const MELBOURNE_REGION: Region = {
  latitude: -37.8136,
  longitude: 144.9631,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

/** Distance threshold (degrees) to show re-centre FAB. */
const RECENTRE_THRESHOLD = 0.002;

/**
 * Full-screen map component with officer position, peer pins, and SOS markers.
 *
 * Auto-centres on the officer's position by default. Shows a re-centre FAB
 * when the user manually pans away from their current location.
 */
export function PatrolMap(): React.JSX.Element {
  const { state, startTracking } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [userPanned, setUserPanned] = useState(false);
  const [isInitialised, setIsInitialised] = useState(false);

  // Start tracking on mount
  useEffect(() => {
    void startTracking();
  }, [startTracking]);

  // Auto-centre on first valid position
  useEffect(() => {
    if (state.ownPosition && !isInitialised && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: state.ownPosition.latitude,
          longitude: state.ownPosition.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500,
      );
      setIsInitialised(true);
    }
  }, [state.ownPosition, isInitialised]);

  /** Detect user panning away from own position. */
  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      if (!state.ownPosition) return;

      const latDiff = Math.abs(region.latitude - state.ownPosition.latitude);
      const lonDiff = Math.abs(region.longitude - state.ownPosition.longitude);
      setUserPanned(latDiff > RECENTRE_THRESHOLD || lonDiff > RECENTRE_THRESHOLD);
    },
    [state.ownPosition],
  );

  /** Re-centre map on officer's current position. */
  const handleReCentre = useCallback(() => {
    if (!state.ownPosition || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: state.ownPosition.latitude,
        longitude: state.ownPosition.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      300,
    );
    setUserPanned(false);
  }, [state.ownPosition]);

  /** Determine map provider based on platform. */
  const provider = process.env.EXPO_OS === 'android' ? PROVIDER_GOOGLE : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }} testID="patrol-map-container">
      <MapView
        ref={mapRef}
        testID="map-view"
        style={{ flex: 1 }}
        provider={provider}
        initialRegion={MELBOURNE_REGION}
        showsUserLocation={false}
        showsCompass
        showsScale
        rotateEnabled
        onRegionChangeComplete={handleRegionChangeComplete}
        customMapStyle={DARK_MAP_STYLE}
      >
        {/* Officer's own position marker */}
        {state.ownPosition ? (
          <OfficerMarker
            coordinate={state.ownPosition}
            heading={state.heading ?? 0}
          />
        ) : null}

        {/* Approved peer location pins */}
        {state.peerLocations.map((peer) => (
          <PeerLocationMarker
            key={peer.officerId}
            peer={peer}
          />
        ))}

        {/* SOS location pins */}
        {state.sosLocations.map((sos) => (
          <SOSMarker
            key={sos.sosId}
            sos={sos}
          />
        ))}
      </MapView>

      {/* Re-centre FAB — appears when user pans away */}
      {userPanned ? (
        <ReCentreFab onPress={handleReCentre} />
      ) : null}
    </View>
  );
}

/**
 * Dark map style for Google Maps (Android).
 * Apple Maps dark mode is handled by system settings on iOS.
 */
/** Dark map style for Google Maps API — hex values are API-specific, not UI tokens. */
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
];
