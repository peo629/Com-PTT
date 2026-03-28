/**
 * Location provider tests — verifies context management,
 * peer/SOS location dispatching, and hook consumption.
 */

import React from 'react';
import { Text } from 'react-native';
import { render, screen, act } from '@testing-library/react-native';

import { LocationProvider, useLocation } from '@/providers/location-provider';
import type { PeerLocation, SOSLocation } from '@/types/location';

/** Test consumer to inspect location context. */
function TestConsumer(): React.JSX.Element {
  const { state, addPeerLocation, removePeerLocation, addSOSLocation, removeSOSLocation } =
    useLocation();
  return (
    <>
      <Text testID="tracking">{String(state.isTracking)}</Text>
      <Text testID="peers">{state.peerLocations.length}</Text>
      <Text testID="sos">{state.sosLocations.length}</Text>
      <Text testID="heading">{String(state.heading)}</Text>
      <Text
        testID="add-peer"
        onPress={() =>
          addPeerLocation({
            officerId: 'o1',
            callsign: 'PATROL-1',
            coord: { latitude: -37.81, longitude: 144.96, timestamp: Date.now() },
            expiresAt: new Date(Date.now() + 300000).toISOString(),
          })
        }
      >
        add-peer
      </Text>
      <Text testID="remove-peer" onPress={() => removePeerLocation('o1')}>
        remove-peer
      </Text>
      <Text
        testID="add-sos"
        onPress={() =>
          addSOSLocation({
            sosId: 's1',
            callsign: 'PATROL-2',
            coord: { latitude: -37.82, longitude: 144.97, timestamp: Date.now() },
          })
        }
      >
        add-sos
      </Text>
      <Text testID="remove-sos" onPress={() => removeSOSLocation('s1')}>
        remove-sos
      </Text>
    </>
  );
}

describe('LocationProvider', () => {
  it('provides initial state', () => {
    render(
      <LocationProvider>
        <TestConsumer />
      </LocationProvider>,
    );

    expect(screen.getByTestId('tracking')).toHaveTextContent('false');
    expect(screen.getByTestId('peers')).toHaveTextContent('0');
    expect(screen.getByTestId('sos')).toHaveTextContent('0');
    expect(screen.getByTestId('heading')).toHaveTextContent('null');
  });

  it('addPeerLocation adds a peer', () => {
    render(
      <LocationProvider>
        <TestConsumer />
      </LocationProvider>,
    );

    act(() => {
      screen.getByTestId('add-peer').props.onPress();
    });

    expect(screen.getByTestId('peers')).toHaveTextContent('1');
  });

  it('removePeerLocation removes a peer', () => {
    render(
      <LocationProvider>
        <TestConsumer />
      </LocationProvider>,
    );

    act(() => {
      screen.getByTestId('add-peer').props.onPress();
    });
    expect(screen.getByTestId('peers')).toHaveTextContent('1');

    act(() => {
      screen.getByTestId('remove-peer').props.onPress();
    });
    expect(screen.getByTestId('peers')).toHaveTextContent('0');
  });

  it('addSOSLocation adds an SOS pin', () => {
    render(
      <LocationProvider>
        <TestConsumer />
      </LocationProvider>,
    );

    act(() => {
      screen.getByTestId('add-sos').props.onPress();
    });

    expect(screen.getByTestId('sos')).toHaveTextContent('1');
  });

  it('removeSOSLocation removes an SOS pin', () => {
    render(
      <LocationProvider>
        <TestConsumer />
      </LocationProvider>,
    );

    act(() => {
      screen.getByTestId('add-sos').props.onPress();
    });
    act(() => {
      screen.getByTestId('remove-sos').props.onPress();
    });

    expect(screen.getByTestId('sos')).toHaveTextContent('0');
  });

  it('throws when useLocation is called outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useLocation must be used within a <LocationProvider>',
    );
    consoleError.mockRestore();
  });
});
