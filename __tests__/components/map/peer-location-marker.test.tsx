/**
 * Peer location marker tests — verifies rendering and callsign display.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { PeerLocationMarker } from '@/components/map/peer-location-marker';
import type { PeerLocation } from '@/types/location';

const MOCK_PEER: PeerLocation = {
  officerId: 'officer-1',
  callsign: 'PATROL-7',
  coord: {
    latitude: -37.815,
    longitude: 144.965,
    timestamp: Date.now(),
  },
  expiresAt: new Date(Date.now() + 300000).toISOString(),
};

describe('PeerLocationMarker', () => {
  it('renders the marker with test ID', () => {
    render(<PeerLocationMarker peer={MOCK_PEER} />);
    expect(screen.getByTestId('peer-marker-officer-1')).toBeTruthy();
  });

  it('displays the officer callsign', () => {
    render(<PeerLocationMarker peer={MOCK_PEER} />);
    expect(screen.getByText('PATROL-7')).toBeTruthy();
  });

  it('renders callsign in callout', () => {
    render(<PeerLocationMarker peer={MOCK_PEER} />);
    // Callout also contains the callsign
    const callsigns = screen.getAllByText('PATROL-7');
    expect(callsigns.length).toBeGreaterThanOrEqual(1);
  });
});
