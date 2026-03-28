/**
 * Re-centre FAB tests — verifies rendering and press behaviour.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { ReCentreFab } from '@/components/map/re-centre-fab';

describe('ReCentreFab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the FAB', () => {
    render(<ReCentreFab onPress={jest.fn()} />);
    expect(screen.getByTestId('re-centre-fab')).toBeTruthy();
  });

  it('renders the crosshair icon', () => {
    render(<ReCentreFab onPress={jest.fn()} />);
    expect(screen.getByText('\u2316')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    render(<ReCentreFab onPress={mockPress} />);

    fireEvent.press(screen.getByTestId('re-centre-fab'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('triggers haptic feedback on press', () => {
    render(<ReCentreFab onPress={jest.fn()} />);

    fireEvent.press(screen.getByTestId('re-centre-fab'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
  });
});
