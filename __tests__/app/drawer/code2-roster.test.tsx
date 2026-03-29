import { render } from '@testing-library/react-native';
import React from 'react';

import Code2RosterScreen from '@/app/(drawer)/code2-roster';

describe('Code2RosterScreen', () => {
  it('renders the screen title', () => {
    const { getByText } = render(<Code2RosterScreen />);
    expect(getByText('Code 2 — Online Officers')).toBeTruthy();
  });

  it('shows an empty state when no officers are online', () => {
    const { getByText } = render(<Code2RosterScreen />);
    expect(getByText('No officers online')).toBeTruthy();
  });
});
