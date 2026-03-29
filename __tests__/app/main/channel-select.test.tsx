import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';

import ChannelSelectScreen from '@/app/(main)/channel-select';

describe('ChannelSelectScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen title', () => {
    const { getByText } = render(<ChannelSelectScreen />);
    expect(getByText('Select Channel')).toBeTruthy();
  });

  it('renders all 5 PTT communication modes', () => {
    const { getByText } = render(<ChannelSelectScreen />);
    expect(getByText('All Officers')).toBeTruthy();
    expect(getByText('Dispatch')).toBeTruthy();
    expect(getByText('Direct (1:1)')).toBeTruthy();
    expect(getByText('Supervisor')).toBeTruthy();
    expect(getByText('Emergency')).toBeTruthy();
  });

  it('calls router.back when close button is pressed', () => {
    const { getByText } = render(<ChannelSelectScreen />);
    fireEvent.press(getByText('Close'));
    expect(router.back).toHaveBeenCalled();
  });
});
