/**
 * Location domain types for the CoM-PTT application.
 *
 * Defines geographic coordinate, peer location, permission status,
 * and location state types used by the location provider, hooks,
 * and map components.
 */

/** Geographic coordinate with optional metadata. */
export interface GeoCoord {
  /** Latitude in decimal degrees. */
  latitude: number;
  /** Longitude in decimal degrees. */
  longitude: number;
  /** Altitude in metres above sea level. */
  altitude?: number;
  /** Accuracy radius in metres. */
  accuracy?: number;
  /** Unix timestamp (ms) when the reading was taken. */
  timestamp: number;
}

/** Live location pin for another officer. */
export interface PeerLocation {
  /** Server-assigned officer identifier. */
  officerId: string;
  /** Officer's radio callsign (e.g., "PATROL-12"). */
  callsign: string;
  /** Latest known coordinates. */
  coord: GeoCoord;
  /** ISO-8601 timestamp when this pin auto-expires (5-min window). */
  expiresAt: string;
}

/** SOS location pin for an officer in Code 1. */
export interface SOSLocation {
  /** Server-assigned SOS event identifier. */
  sosId: string;
  /** Sounding officer's radio callsign. */
  callsign: string;
  /** Latest known coordinates (updates in real-time). */
  coord: GeoCoord;
}

/** Foreground / background permission status. */
export type LocationPermissionStatus = 'undetermined' | 'granted' | 'denied';

/** Discriminated union of location reducer actions. */
export type LocationAction =
  | { type: 'SET_POSITION'; coord: GeoCoord }
  | { type: 'SET_HEADING'; heading: number }
  | { type: 'SET_FOREGROUND_PERMISSION'; status: LocationPermissionStatus }
  | { type: 'SET_BACKGROUND_PERMISSION'; status: LocationPermissionStatus }
  | { type: 'SET_TRACKING'; isTracking: boolean }
  | { type: 'ADD_PEER_LOCATION'; peer: PeerLocation }
  | { type: 'REMOVE_PEER_LOCATION'; officerId: string }
  | { type: 'ADD_SOS_LOCATION'; sos: SOSLocation }
  | { type: 'UPDATE_SOS_LOCATION'; sosId: string; coord: GeoCoord }
  | { type: 'REMOVE_SOS_LOCATION'; sosId: string }
  | { type: 'SET_ERROR'; error: string | null };

/** Complete location state managed by the location reducer. */
export interface LocationState {
  /** Officer's own GPS position or null if undetermined. */
  ownPosition: GeoCoord | null;
  /** Compass heading in degrees (0 = north, 90 = east). */
  heading: number | null;
  /** Foreground location permission. */
  foregroundPermission: LocationPermissionStatus;
  /** Background location permission. */
  backgroundPermission: LocationPermissionStatus;
  /** Whether foreground location tracking is active. */
  isTracking: boolean;
  /** Approved peer officer live-location pins. */
  peerLocations: PeerLocation[];
  /** Active SOS location pins. */
  sosLocations: SOSLocation[];
  /** Error message if any. */
  error: string | null;
}

/** Initial location state. */
export const INITIAL_LOCATION_STATE: LocationState = {
  ownPosition: null,
  heading: null,
  foregroundPermission: 'undetermined',
  backgroundPermission: 'undetermined',
  isTracking: false,
  peerLocations: [],
  sosLocations: [],
  error: null,
};
