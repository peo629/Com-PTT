import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';

import SignInScreen from '@/app/(auth)/sign-in';

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app title and subtitle', () => {
    const { getByText } = render(<SignInScreen />);
    expect(getByText('CoM-PTT')).toBeTruthy();
    expect(getByText('City of Melbourne — Parking Enforcement')).toBeTruthy();
  });

  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = render(<SignInScreen />);
    expect(getByPlaceholderText('Email address')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('renders a sign-in button', () => {
    const { getByText } = render(<SignInScreen />);
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('does not navigate when form is empty', () => {
    const { getByText } = render(<SignInScreen />);
    fireEvent.press(getByText('Sign In'));
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('does not navigate with only email filled', () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    fireEvent.changeText(getByPlaceholderText('Email address'), 'test@com.gov.au');
    fireEvent.press(getByText('Sign In'));
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('does not navigate with only password filled', () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('navigates to (main) when both fields are filled and submitted', async () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    fireEvent.changeText(getByPlaceholderText('Email address'), 'test@com.gov.au');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(main)');
    });
  });

  it('shows submitting state after pressing sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    fireEvent.changeText(getByPlaceholderText('Email address'), 'test@com.gov.au');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Signing in…')).toBeTruthy();
    });
  });
});
