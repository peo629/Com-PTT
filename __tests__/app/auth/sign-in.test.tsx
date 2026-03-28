import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';

import SignInScreen from '@/app/(auth)/sign-in';
import { AuthError } from '@/services/auth-service';
import type { AuthContextValue } from '@/types/auth';

/** Mock signIn function — overridden per test. */
const mockSignIn = jest.fn<Promise<void>, [string, string]>();

/** Shared mock auth context value. */
const mockAuthValue: AuthContextValue = {
  state: { status: 'unauthenticated', user: null, tokens: null },
  signIn: mockSignIn,
  signOut: jest.fn(),
  isAuthenticated: false,
  isLoading: false,
};

jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => mockAuthValue,
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockResolvedValue(undefined);
  });

  it('renders the CoM-PTT branding', () => {
    render(<SignInScreen />);
    expect(screen.getByText('CoM-PTT')).toBeTruthy();
    expect(
      screen.getByText('City of Melbourne — Parking Enforcement'),
    ).toBeTruthy();
  });

  it('renders email and password input fields', () => {
    render(<SignInScreen />);
    expect(screen.getByPlaceholderText('Email address')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('shows domain validation hint for non-.gov.au email', () => {
    render(<SignInScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'user@gmail.com',
    );
    expect(screen.getByText('Use a .gov.au email address')).toBeTruthy();
  });

  it('hides domain hint for valid .gov.au email', () => {
    render(<SignInScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'officer@melbournecity.gov.au',
    );
    expect(
      screen.queryByText('Use a .gov.au email address'),
    ).toBeNull();
  });

  it('does not call signIn when form is incomplete', () => {
    render(<SignInScreen />);
    fireEvent.press(screen.getByTestId('sign-in-button'));
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('does not call signIn with invalid email domain', () => {
    render(<SignInScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'user@hotmail.com',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'password',
    );
    fireEvent.press(screen.getByTestId('sign-in-button'));
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn with email and password on valid submit', async () => {
    render(<SignInScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'officer@gov.au',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'password123',
    );
    fireEvent.press(screen.getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('officer@gov.au', 'password123');
    });
  });

  it('shows submitting state while sign-in is in progress', async () => {
    // Make signIn hang indefinitely
    mockSignIn.mockImplementation(
      () => new Promise<void>(() => {}),
    );

    render(<SignInScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'officer@gov.au',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'pass',
    );
    fireEvent.press(screen.getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(screen.getByText('Signing in\u2026')).toBeTruthy();
    });
  });

  it('displays AuthError message on sign-in failure', async () => {
    mockSignIn.mockRejectedValueOnce(
      new AuthError('Invalid email or password.', 401),
    );

    render(<SignInScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'officer@gov.au',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'wrong',
    );
    fireEvent.press(screen.getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Invalid email or password.'),
      ).toBeTruthy();
    });
  });

  it('displays generic error on unexpected failure', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Network error'));

    render(<SignInScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'officer@gov.au',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'pass',
    );
    fireEvent.press(screen.getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'An unexpected error occurred. Please try again.',
        ),
      ).toBeTruthy();
    });
  });

  it('clears error when email input changes', async () => {
    mockSignIn.mockRejectedValueOnce(
      new AuthError('Invalid email or password.', 401),
    );

    render(<SignInScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'officer@gov.au',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'wrong',
    );
    fireEvent.press(screen.getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Invalid email or password.'),
      ).toBeTruthy();
    });

    // Change email → error should clear
    fireEvent.changeText(
      screen.getByPlaceholderText('Email address'),
      'other@gov.au',
    );
    expect(
      screen.queryByText('Invalid email or password.'),
    ).toBeNull();
  });
});
