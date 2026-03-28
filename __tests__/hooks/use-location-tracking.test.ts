/**
 * Location tracking hook tests — verifies permission requests,
 * position watching, and background task management.
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { useLocationTracking } from '@/hooks/use-location-tracking';

describe('useLocationTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with undetermined permissions and no tracking', () => {
    const { result } = renderHook(() => useLocationTracking());
    expect(result.current.position).toBeNull();
    expect(result.current.isTracking).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('checks permissions on mount', async () => {
    renderHook(() => useLocationTracking());
    await waitFor(() => {
      expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getBackgroundPermissionsAsync).toHaveBeenCalled();
    });
  });

  it('startTracking requests foreground permission and starts watching', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    const mockRemove = jest.fn();
    (Location.watchPositionAsync as jest.Mock).mockResolvedValue({
      remove: mockRemove,
    });

    const { result } = renderHook(() => useLocationTracking());

    await act(async () => {
      await result.current.startTracking();
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.watchPositionAsync).toHaveBeenCalled();
    expect(result.current.isTracking).toBe(true);
  });

  it('sets error when foreground permission is denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { result } = renderHook(() => useLocationTracking());

    await act(async () => {
      await result.current.startTracking();
    });

    expect(result.current.error).toBe('Foreground location permission denied.');
    expect(result.current.isTracking).toBe(false);
  });

  it('stopTracking removes subscription and sets isTracking false', async () => {
    const mockRemove = jest.fn();
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.watchPositionAsync as jest.Mock).mockResolvedValue({
      remove: mockRemove,
    });

    const { result } = renderHook(() => useLocationTracking());

    await act(async () => {
      await result.current.startTracking();
    });
    expect(result.current.isTracking).toBe(true);

    await act(async () => {
      await result.current.stopTracking();
    });

    expect(mockRemove).toHaveBeenCalled();
    expect(result.current.isTracking).toBe(false);
  });

  it('startBackgroundTracking requests permission and starts task', async () => {
    (Location.requestBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (TaskManager.isTaskDefined as jest.Mock).mockReturnValue(true);
    (Location.hasStartedLocationUpdatesAsync as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useLocationTracking());

    let success = false;
    await act(async () => {
      success = await result.current.startBackgroundTracking();
    });

    expect(success).toBe(true);
    expect(Location.startLocationUpdatesAsync).toHaveBeenCalled();
  });

  it('fails background tracking when permission denied', async () => {
    (Location.requestBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { result } = renderHook(() => useLocationTracking());

    let success = true;
    await act(async () => {
      success = await result.current.startBackgroundTracking();
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Background location permission denied.');
  });

  it('stopBackgroundTracking stops updates if started', async () => {
    (Location.hasStartedLocationUpdatesAsync as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useLocationTracking());

    await act(async () => {
      await result.current.stopBackgroundTracking();
    });

    expect(Location.stopLocationUpdatesAsync).toHaveBeenCalled();
  });
});
