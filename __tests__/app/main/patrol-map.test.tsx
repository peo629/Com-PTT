import { render } from '@testing-library/react-native';
import React from 'react';

import PatrolMapScreen from '@/app/(main)/index';

describe('PatrolMapScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<PatrolMapScreen />);
    expect(getByText('Patrol Map')).toBeTruthy();
  });

  it('shows a loading/placeholder message', () => {
    const { getByText } = render(<PatrolMapScreen />);
    expect(getByText('Map view loads in Step 4')).toBeTruthy();
  });
});
