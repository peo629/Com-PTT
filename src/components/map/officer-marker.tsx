/**
 * Officer marker — directional arrowhead SVG rendered at the
 * officer's current GPS position, rotated by compass heading.
 *
 * Uses react-native-maps Marker with a custom child view
 * containing an SVG arrowhead.
 *
 * @module components/map/officer-marker
 */

import React from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';

import { Colors } from '@constants';
import type { GeoCoord } from '@/types/location';

/** Props for the OfficerMarker component. */
interface OfficerMarkerProps {
  /** Current GPS coordinates. */
  coordinate: GeoCoord;
  /** Compass heading in degrees (0 = north). */
  heading: number;
}

/** Size of the arrowhead marker in points. */
const MARKER_SIZE = 40;

/**
 * Renders a directional arrowhead marker at the officer's GPS position.
 *
 * The arrowhead rotates to match the device's compass heading,
 * indicating the direction of travel. Uses accentGreen fill with
 * a white stroke for visibility against the dark map.
 */
export function OfficerMarker({
  coordinate,
  heading,
}: OfficerMarkerProps): React.JSX.Element {
  return (
    <Marker
      coordinate={{
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      rotation={heading}
      tracksViewChanges={false}
      testID="officer-marker"
    >
      <View
        style={{
          width: MARKER_SIZE,
          height: MARKER_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg
          width={MARKER_SIZE}
          height={MARKER_SIZE}
          viewBox="0 0 40 40"
          testID="officer-arrowhead"
        >
          {/* Arrowhead pointing up (north) — rotation handled by Marker */}
          <Path
            d="M20 4 L32 34 L20 26 L8 34 Z"
            fill={Colors.accentGreen}
            stroke={Colors.textPrimary}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </Marker>
  );
}
