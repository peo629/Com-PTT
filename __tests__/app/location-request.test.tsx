import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';

import LocationRequestScreen from '@/app/location-request';

describe('LocationRequestScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen title', () => {
    const { getByText } = render(<LocationRequestScreen />);
    expect(getByText('Location Request')).toBeTruthy();
  });

  it('renders all three action buttons', () => {
    const { getByText } = render(<LocationRequestScreen />);
    expect(getByText('Approve')).toBeTruthy();
    expect(getByText('Standby')).toBeTruthy();
    expect(getByText('Decline')).toBeTruthy();
  });

  it('navigates back when Approve is pressed', () => {
    const { getByText } = render(<LocationRequestScreen />);
    fireEvent.press(getByText('Approve'));
    expect(router.back).toHaveBeenCalled();
  });

  it('navigates back when Standby is pressed', () => {
    const { getByText } = render(<LocationRequestScreen />);
    fireEvent.press(getByText('Standby'));
    expect(router.back).toHaveBeenCalled();
  });

  it('navigates back when Decline is pressed', () => {
    const { getByText } = render(<LocationRequestScreen />);
    fireEvent.press(getByText('Decline'));
    expect(router.back).toHaveBeenCalled();
  });
});
