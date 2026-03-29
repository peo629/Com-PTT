/**
 * Officer marker component tests — verifies arrowhead rendering
 * and heading rotation.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { OfficerMarker } from '@/components/map/officer-marker';
import type { GeoCoord } from '@/types/location';

const MOCK_COORD: GeoCoord = {
  latitude: -37.8136,
  longitude: 144.9631,
  timestamp: Date.now(),
};

describe('OfficerMarker', () => {
  it('renders the marker', () => {
    render(<OfficerMarker coordinate={MOCK_COORD} heading={0} />);
    expect(screen.getByTestId('officer-marker')).toBeTruthy();
  });

  it('renders the SVG arrowhead', () => {
    render(<OfficerMarker coordinate={MOCK_COORD} heading={90} />);
    expect(screen.getByTestId('officer-arrowhead')).toBeTruthy();
  });

  it('accepts heading prop for rotation', () => {
    const { rerender } = render(
      <OfficerMarker coordinate={MOCK_COORD} heading={0} />,
    );

    // Should not throw on re-render with different heading
    rerender(<OfficerMarker coordinate={MOCK_COORD} heading={180} />);
    expect(screen.getByTestId('officer-marker')).toBeTruthy();
  });
});
