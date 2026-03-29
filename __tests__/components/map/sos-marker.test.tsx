/**
 * SOS marker tests — verifies rendering, pulsing animation,
 * and callsign display.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { SOSMarker } from '@/components/map/sos-marker';
import type { SOSLocation } from '@/types/location';

const MOCK_SOS: SOSLocation = {
  sosId: 'sos-1',
  callsign: 'PATROL-3',
  coord: {
    latitude: -37.82,
    longitude: 144.97,
    timestamp: Date.now(),
  },
};

describe('SOSMarker', () => {
  it('renders the marker with test ID', () => {
    render(<SOSMarker sos={MOCK_SOS} />);
    expect(screen.getByTestId('sos-marker-sos-1')).toBeTruthy();
  });

  it('renders the pulse ring', () => {
    render(<SOSMarker sos={MOCK_SOS} />);
    expect(screen.getByTestId('sos-pulse-ring')).toBeTruthy();
  });

  it('displays SOS callsign in callout', () => {
    render(<SOSMarker sos={MOCK_SOS} />);
    expect(screen.getByText('SOS — PATROL-3')).toBeTruthy();
  });
});
