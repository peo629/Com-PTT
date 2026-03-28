import { render } from '@testing-library/react-native';
import React from 'react';

import SosPanelScreen from '@/app/(drawer)/sos-panel';

describe('SosPanelScreen', () => {
  it('renders the screen title', () => {
    const { getByText } = render(<SosPanelScreen />);
    expect(getByText('SOS / Code 1')).toBeTruthy();
  });

  it('renders the SOS activation button', () => {
    const { getByText } = render(<SosPanelScreen />);
    expect(getByText('Hold to Activate SOS')).toBeTruthy();
  });

  it('shows the SOS status as inactive by default', () => {
    const { getByText } = render(<SosPanelScreen />);
    expect(getByText('Status: Inactive')).toBeTruthy();
  });
});
