/**
 * Authentication types for the CoM-PTT application.
 *
 * Defines the auth state machine, user model, and context interface
 * used by auth-provider, auth-service, and auth-gate.
 */

/** User role within the CoM-PTT system. */
export type UserRole = 'officer' | 'dispatch' | 'supervisor';

/** Authenticated user profile returned by the backend. */
export interface User {
  /** Unique server-assigned identifier. */
  id: string;
  /** Government email address (must be .gov.au domain). */
  email: string;
  /** Radio callsign displayed on the roster (e.g., "PATROL-12"). */
  callsign: string;
  /** Access level determining available features. */
  role: UserRole;
}

/** JWT token pair for API authentication. */
export interface AuthTokens {
  /** Short-lived access token for API requests. */
  accessToken: string;
  /** Long-lived token for obtaining new access tokens. */
  refreshToken: string;
}

/** Auth state machine statuses. */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

/** Complete auth state managed by the auth reducer. */
export interface AuthState {
  /** Current authentication lifecycle status. */
  status: AuthStatus;
  /** Authenticated user profile, null when not authenticated. */
  user: User | null;
  /** JWT token pair, null when not authenticated. */
  tokens: AuthTokens | null;
}

/** Discriminated union of auth reducer actions. */
export type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; user: User; tokens: AuthTokens }
  | { type: 'AUTH_FAILURE' }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'TOKEN_REFRESH'; tokens: AuthTokens };

/**
 * Allowed email domain suffixes for sign-in.
 * Per Section 15: @melbournecity.gov.au or @gov.au.
 */
export const ALLOWED_EMAIL_DOMAINS = ['.gov.au'] as const;

/** Auth context value exposed to consumers via useAuth(). */
export interface AuthContextValue {
  /** Current auth state. */
  state: AuthState;
  /** Attempt sign-in with government email and password. */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out and clear stored credentials. */
  signOut: () => Promise<void>;
  /** Whether the user is currently authenticated. */
  isAuthenticated: boolean;
  /** Whether auth state is still hydrating or processing. */
  isLoading: boolean;
}
