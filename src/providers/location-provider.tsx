/**
 * Location context provider — manages GPS position, compass heading,
 * and peer/SOS location pins.
 *
 * Consumes `useLocationTracking` and `useHeading` hooks internally
 * and exposes a unified `useLocation()` interface to all consumers.
 *
 * @module providers/location-provider
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import type {
  GeoCoord,
  LocationAction,
  LocationState,
  PeerLocation,
  SOSLocation,
} from '@/types/location';
import { INITIAL_LOCATION_STATE } from '@/types/location';
import { useLocationTracking } from '@/hooks/use-location-tracking';
import { useHeading } from '@/hooks/use-heading';

/** Location context value exposed to consumers. */
export interface LocationContextValue {
  /** Current location state. */
  state: LocationState;
  /** Start foreground location tracking. */
  startTracking: () => Promise<void>;
  /** Stop foreground location tracking. */
  stopTracking: () => Promise<void>;
  /** Start background location tracking (for SOS/patrol). */
  startBackgroundTracking: () => Promise<boolean>;
  /** Stop background location tracking. */
  stopBackgroundTracking: () => Promise<void>;
  /** Add a peer officer's live-location pin. */
  addPeerLocation: (peer: PeerLocation) => void;
  /** Remove a peer officer's live-location pin. */
  removePeerLocation: (officerId: string) => void;
  /** Add an SOS location pin. */
  addSOSLocation: (sos: SOSLocation) => void;
  /** Update an existing SOS location pin's coordinates. */
  updateSOSLocation: (sosId: string, coord: GeoCoord) => void;
  /** Remove an SOS location pin (resolved). */
  removeSOSLocation: (sosId: string) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);
LocationContext.displayName = 'LocationContext';

/** Location state reducer. */
function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'SET_POSITION':
      return { ...state, ownPosition: action.coord };
    case 'SET_HEADING':
      return { ...state, heading: action.heading };
    case 'SET_FOREGROUND_PERMISSION':
      return { ...state, foregroundPermission: action.status };
    case 'SET_BACKGROUND_PERMISSION':
      return { ...state, backgroundPermission: action.status };
    case 'SET_TRACKING':
      return { ...state, isTracking: action.isTracking };
    case 'ADD_PEER_LOCATION':
      return {
        ...state,
        peerLocations: [
          ...state.peerLocations.filter(
            (p) => p.officerId !== action.peer.officerId,
          ),
          action.peer,
        ],
      };
    case 'REMOVE_PEER_LOCATION':
      return {
        ...state,
        peerLocations: state.peerLocations.filter(
          (p) => p.officerId !== action.officerId,
        ),
      };
    case 'ADD_SOS_LOCATION':
      return {
        ...state,
        sosLocations: [
          ...state.sosLocations.filter((s) => s.sosId !== action.sos.sosId),
          action.sos,
        ],
      };
    case 'UPDATE_SOS_LOCATION':
      return {
        ...state,
        sosLocations: state.sosLocations.map((s) =>
          s.sosId === action.sosId ? { ...s, coord: action.coord } : s,
        ),
      };
    case 'REMOVE_SOS_LOCATION':
      return {
        ...state,
        sosLocations: state.sosLocations.filter((s) => s.sosId !== action.sosId),
      };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
}

/** Props for LocationProvider. */
interface LocationProviderProps {
  /** Child components. */
  children: React.ReactNode;
}

/**
 * Provides location context to the application.
 *
 * Wraps `useLocationTracking` and `useHeading` hooks, syncing their
 * outputs into a unified reducer state. Consumers access via `useLocation()`.
 */
export function LocationProvider({ children }: LocationProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(locationReducer, INITIAL_LOCATION_STATE);
  const tracking = useLocationTracking();
  const headingData = useHeading();

  // Sync tracking hook → reducer
  useEffect(() => {
    if (tracking.position) {
      dispatch({ type: 'SET_POSITION', coord: tracking.position });
    }
  }, [tracking.position]);

  useEffect(() => {
    dispatch({
      type: 'SET_FOREGROUND_PERMISSION',
      status: tracking.foregroundPermission,
    });
  }, [tracking.foregroundPermission]);

  useEffect(() => {
    dispatch({
      type: 'SET_BACKGROUND_PERMISSION',
      status: tracking.backgroundPermission,
    });
  }, [tracking.backgroundPermission]);

  useEffect(() => {
    dispatch({ type: 'SET_TRACKING', isTracking: tracking.isTracking });
  }, [tracking.isTracking]);

  useEffect(() => {
    if (tracking.error) {
      dispatch({ type: 'SET_ERROR', error: tracking.error });
    }
  }, [tracking.error]);

  // Sync heading hook → reducer
  useEffect(() => {
    if (headingData.heading !== null) {
      dispatch({ type: 'SET_HEADING', heading: headingData.heading });
    }
  }, [headingData.heading]);

  // Peer & SOS dispatchers
  const addPeerLocation = useCallback((peer: PeerLocation) => {
    dispatch({ type: 'ADD_PEER_LOCATION', peer });
  }, []);

  const removePeerLocation = useCallback((officerId: string) => {
    dispatch({ type: 'REMOVE_PEER_LOCATION', officerId });
  }, []);

  const addSOSLocation = useCallback((sos: SOSLocation) => {
    dispatch({ type: 'ADD_SOS_LOCATION', sos });
  }, []);

  const updateSOSLocation = useCallback((sosId: string, coord: GeoCoord) => {
    dispatch({ type: 'UPDATE_SOS_LOCATION', sosId, coord });
  }, []);

  const removeSOSLocation = useCallback((sosId: string) => {
    dispatch({ type: 'REMOVE_SOS_LOCATION', sosId });
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({
      state,
      startTracking: tracking.startTracking,
      stopTracking: tracking.stopTracking,
      startBackgroundTracking: tracking.startBackgroundTracking,
      stopBackgroundTracking: tracking.stopBackgroundTracking,
      addPeerLocation,
      removePeerLocation,
      addSOSLocation,
      updateSOSLocation,
      removeSOSLocation,
    }),
    [
      state,
      tracking.startTracking,
      tracking.stopTracking,
      tracking.startBackgroundTracking,
      tracking.stopBackgroundTracking,
      addPeerLocation,
      removePeerLocation,
      addSOSLocation,
      updateSOSLocation,
      removeSOSLocation,
    ],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

/**
 * Access the location context.
 *
 * @throws {Error} If called outside of `<LocationProvider>`.
 */
export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a <LocationProvider>');
  }
  return context;
}
