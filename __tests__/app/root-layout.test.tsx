import { render } from '@testing-library/react-native';
import React from 'react';

import RootLayout from '@/app/_layout';

describe('RootLayout', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('safe-area-provider')).toBeTruthy();
  });

  it('wraps content in SafeAreaProvider', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('safe-area-provider')).toBeTruthy();
  });
});
