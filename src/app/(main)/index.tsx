import React from 'react';

import { PatrolMap } from '@/components/map/patrol-map';

/**
 * Patrol map screen — full-screen interactive map displaying
 * the officer's real-time position with a directional heading indicator.
 *
 * Renders the PatrolMap component which manages its own MapView,
 * officer marker, peer pins, and SOS markers. PTT button overlay
 * and SOS banner are rendered at the root level above this screen.
 */
export default function PatrolMapScreen(): React.JSX.Element {
  return <PatrolMap />;
}
