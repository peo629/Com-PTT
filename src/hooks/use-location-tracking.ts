/**
 * Foreground and background location tracking hook.
 *
 * Uses `expo-location` for GPS subscriptions and `expo-task-manager`
 * for background location tasks (SOS & active patrol).
 *
 * @module hooks/use-location-tracking
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import type { GeoCoord, LocationPermissionStatus } from '@/types/location';
import { Colors } from '@constants';

/** Background task name for location updates. */
export const BACKGROUND_LOCATION_TASK = 'com-ptt-background-location';

/** Configuration for foreground position watching. */
const FOREGROUND_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  distanceInterval: 2,
};

/** Configuration for background position watching. */
const BACKGROUND_OPTIONS: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 5,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: 'CoM-PTT',
    notificationBody: 'Location tracking active',
    notificationColor: Colors.accentGreen,
  },
};

/** Return type for the location tracking hook. */
export interface UseLocationTrackingResult {
  /** Latest GPS position or null. */
  position: GeoCoord | null;
  /** Whether foreground tracking is active. */
  isTracking: boolean;
  /** Foreground permission status. */
  foregroundPermission: LocationPermissionStatus;
  /** Background permission status. */
  backgroundPermission: LocationPermissionStatus;
  /** Error message or null. */
  error: string | null;
  /** Begin foreground location tracking. */
  startTracking: () => Promise<void>;
  /** Stop foreground location tracking. */
  stopTracking: () => Promise<void>;
  /** Request background location permission and start background task. */
  startBackgroundTracking: () => Promise<boolean>;
  /** Stop background location task. */
  stopBackgroundTracking: () => Promise<void>;
}

/**
 * Maps expo-location permission status to the app's LocationPermissionStatus.
 */
function mapPermission(status: Location.PermissionStatus): LocationPermissionStatus {
  switch (status) {
    case Location.PermissionStatus.GRANTED:
      return 'granted';
    case Location.PermissionStatus.DENIED:
      return 'denied';
    default:
      return 'undetermined';
  }
}

/**
 * Converts an expo Location object to a GeoCoord.
 */
function toGeoCoord(location: Location.LocationObject): GeoCoord {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    altitude: location.coords.altitude ?? undefined,
    accuracy: location.coords.accuracy ?? undefined,
    timestamp: location.timestamp,
  };
}

/**
 * Hook for managing foreground and background location tracking.
 *
 * Requests permissions, starts/stops position watching,
 * and manages background location tasks.
 */
export function useLocationTracking(): UseLocationTrackingResult {
  const [position, setPosition] = useState<GeoCoord | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [foregroundPermission, setForegroundPermission] =
    useState<LocationPermissionStatus>('undetermined');
  const [backgroundPermission, setBackgroundPermission] =
    useState<LocationPermissionStatus>('undetermined');
  const [error, setError] = useState<string | null>(null);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  /** Check current permission status on mount. */
  useEffect(() => {
    let mounted = true;

    const checkPermissions = async (): Promise<void> => {
      try {
        const fg = await Location.getForegroundPermissionsAsync();
        if (mounted) setForegroundPermission(mapPermission(fg.status));

        const bg = await Location.getBackgroundPermissionsAsync();
        if (mounted) setBackgroundPermission(mapPermission(bg.status));
      } catch {
        // Permissions check failed — leave as undetermined
      }
    };

    void checkPermissions();

    return () => {
      mounted = false;
    };
  }, []);

  /** Start foreground location watching. */
  const startTracking = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      // Request foreground permission if needed
      const { status } = await Location.requestForegroundPermissionsAsync();
      const mappedStatus = mapPermission(status);
      setForegroundPermission(mappedStatus);

      if (mappedStatus !== 'granted') {
        setError('Foreground location permission denied.');
        return;
      }

      // Stop existing subscription if any
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }

      // Start position watching
      subscriptionRef.current = await Location.watchPositionAsync(
        FOREGROUND_OPTIONS,
        (location) => {
          setPosition(toGeoCoord(location));
        },
      );

      setIsTracking(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to start location tracking.';
      setError(message);
    }
  }, []);

  /** Stop foreground location watching. */
  const stopTracking = useCallback(async (): Promise<void> => {
    try {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
      setIsTracking(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to stop location tracking.';
      setError(message);
    }
  }, []);

  /** Request background permission and start background task. */
  const startBackgroundTracking = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);

      const { status } = await Location.requestBackgroundPermissionsAsync();
      const mappedStatus = mapPermission(status);
      setBackgroundPermission(mappedStatus);

      if (mappedStatus !== 'granted') {
        setError('Background location permission denied.');
        return false;
      }

      const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK);
      if (!isTaskDefined) {
        setError('Background location task is not defined.');
        return false;
      }

      const isStarted = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_LOCATION_TASK,
      );
      if (!isStarted) {
        await Location.startLocationUpdatesAsync(
          BACKGROUND_LOCATION_TASK,
          BACKGROUND_OPTIONS,
        );
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to start background tracking.';
      setError(message);
      return false;
    }
  }, []);

  /** Stop background location task. */
  const stopBackgroundTracking = useCallback(async (): Promise<void> => {
    try {
      const isStarted = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_LOCATION_TASK,
      );
      if (isStarted) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to stop background tracking.';
      setError(message);
    }
  }, []);

  /** Clean up on unmount. */
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  return {
    position,
    isTracking,
    foregroundPermission,
    backgroundPermission,
    error,
    startTracking,
    stopTracking,
    startBackgroundTracking,
    stopBackgroundTracking,
  };
}
