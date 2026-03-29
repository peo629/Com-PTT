/**
 * Patrol map component tests — verifies map rendering,
 * marker integration, and re-centre FAB behaviour.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { PatrolMap } from '@/components/map/patrol-map';
import { LocationProvider } from '@/providers/location-provider';

describe('PatrolMap', () => {
  it('renders the map container', () => {
    render(
      <LocationProvider>
        <PatrolMap />
      </LocationProvider>,
    );

    expect(screen.getByTestId('patrol-map-container')).toBeTruthy();
  });

  it('renders the MapView', () => {
    render(
      <LocationProvider>
        <PatrolMap />
      </LocationProvider>,
    );

    expect(screen.getByTestId('map-view')).toBeTruthy();
  });

  it('does not show re-centre FAB initially', () => {
    render(
      <LocationProvider>
        <PatrolMap />
      </LocationProvider>,
    );

    expect(screen.queryByTestId('re-centre-fab')).toBeNull();
  });
});
