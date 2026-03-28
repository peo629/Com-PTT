/**
 * Heading hook tests — verifies compass heading subscription
 * and cleanup.
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { useHeading } from '@/hooks/use-heading';

describe('useHeading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with null heading and not subscribed', () => {
    const { result } = renderHook(() => useHeading());
    expect(result.current.heading).toBeNull();
    expect(result.current.trueHeading).toBeNull();
    expect(result.current.accuracy).toBeNull();
    expect(result.current.isSubscribed).toBe(false);
  });

  it('subscribes to heading updates on mount', async () => {
    const mockRemove = jest.fn();
    (Location.watchHeadingAsync as jest.Mock).mockImplementation(
      async (callback: (data: { magHeading: number; trueHeading: number; accuracy: number }) => void) => {
        callback({ magHeading: 90, trueHeading: 92, accuracy: 5 });
        return { remove: mockRemove };
      },
    );

    const { result } = renderHook(() => useHeading());

    await waitFor(() => {
      expect(result.current.heading).toBe(90);
      expect(result.current.trueHeading).toBe(92);
      expect(result.current.accuracy).toBe(5);
      expect(result.current.isSubscribed).toBe(true);
    });
  });

  it('removes subscription on unmount', async () => {
    const mockRemove = jest.fn();
    (Location.watchHeadingAsync as jest.Mock).mockResolvedValue({
      remove: mockRemove,
    });

    const { unmount } = renderHook(() => useHeading());

    await waitFor(() => {
      expect(Location.watchHeadingAsync).toHaveBeenCalled();
    });

    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });

  it('handles heading subscription failure gracefully', async () => {
    (Location.watchHeadingAsync as jest.Mock).mockRejectedValue(
      new Error('Heading not available'),
    );

    const { result } = renderHook(() => useHeading());

    await waitFor(() => {
      expect(result.current.heading).toBeNull();
      expect(result.current.isSubscribed).toBe(false);
    });
  });
});
