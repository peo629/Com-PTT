import { render } from '@testing-library/react-native';
import React from 'react';

import OfficerProfileScreen from '@/app/(main)/officer-profile';

describe('OfficerProfileScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<OfficerProfileScreen />);
    expect(getByText('Officer Profile')).toBeTruthy();
  });

  it('renders the Request Location button', () => {
    const { getByText } = render(<OfficerProfileScreen />);
    expect(getByText('Request Location')).toBeTruthy();
  });
});
