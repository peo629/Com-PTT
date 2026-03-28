/**
 * Compass heading hook for officer marker arrowhead rotation.
 *
 * Subscribes to `expo-location` heading updates and exposes
 * the current magnetic heading in degrees (0 = north).
 *
 * @module hooks/use-heading
 */

import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

/** Return type for the heading hook. */
export interface UseHeadingResult {
  /** Current compass heading in degrees (0 = north, 90 = east), or null. */
  heading: number | null;
  /** True heading (geographic north) if available, otherwise magnetic. */
  trueHeading: number | null;
  /** Accuracy of the heading reading in degrees. */
  accuracy: number | null;
  /** Whether the heading subscription is active. */
  isSubscribed: boolean;
}

/**
 * Subscribes to device compass heading updates.
 *
 * Automatically starts/stops the heading subscription on mount/unmount.
 * Requires foreground location permission to be granted.
 */
export function useHeading(): UseHeadingResult {
  const [heading, setHeading] = useState<number | null>(null);
  const [trueHeading, setTrueHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    const startHeadingWatch = async (): Promise<void> => {
      try {
        subscriptionRef.current = await Location.watchHeadingAsync((headingData) => {
          if (!mounted) return;
          setHeading(headingData.magHeading);
          setTrueHeading(headingData.trueHeading);
          setAccuracy(headingData.accuracy);
        });

        if (mounted) setIsSubscribed(true);
      } catch {
        // Heading not available — leave as null
        if (mounted) setIsSubscribed(false);
      }
    };

    void startHeadingWatch();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  return { heading, trueHeading, accuracy, isSubscribed };
}
