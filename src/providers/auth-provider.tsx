/**
 * AuthProvider — manages JWT auth state, secure storage, and token lifecycle.
 *
 * On mount, hydrates auth state from expo-secure-store. If persisted tokens
 * are found, attempts a refresh to verify validity. On failure, clears
 * stored credentials and sets state to unauthenticated.
 *
 * Exposes signIn/signOut methods and auth state to all descendants
 * via the useAuth() hook.
 */

import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import * as authService from '@/services/auth-service';
import type {
  AuthAction,
  AuthContextValue,
  AuthState,
  AuthTokens,
  User,
} from '@/types/auth';

/** Secure storage keys for persisted auth data. */
const STORAGE_KEY_USER = 'com_ptt_auth_user';
const STORAGE_KEY_TOKENS = 'com_ptt_auth_tokens';

/** Initial auth state before hydration. */
const initialState: AuthState = {
  status: 'idle',
  user: null,
  tokens: null,
};

/** Auth state reducer — pure function, no side effects. */
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, status: 'loading' };
    case 'AUTH_SUCCESS':
      return {
        status: 'authenticated',
        user: action.user,
        tokens: action.tokens,
      };
    case 'AUTH_FAILURE':
    case 'AUTH_LOGOUT':
      return {
        status: 'unauthenticated',
        user: null,
        tokens: null,
      };
    case 'TOKEN_REFRESH':
      return { ...state, tokens: action.tokens };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Access the auth context. Must be called within an AuthProvider.
 *
 * @throws {Error} If called outside AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/** Persist user and tokens to expo-secure-store. */
async function persistAuth(user: User, tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY_USER, JSON.stringify(user));
  await SecureStore.setItemAsync(STORAGE_KEY_TOKENS, JSON.stringify(tokens));
}

/** Remove persisted auth data from expo-secure-store. */
async function clearPersistedAuth(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY_USER);
  await SecureStore.deleteItemAsync(STORAGE_KEY_TOKENS);
}

/** Attempt to load persisted auth data from expo-secure-store. */
async function hydrateAuth(): Promise<{
  user: User;
  tokens: AuthTokens;
} | null> {
  const userJson = await SecureStore.getItemAsync(STORAGE_KEY_USER);
  const tokensJson = await SecureStore.getItemAsync(STORAGE_KEY_TOKENS);

  if (!userJson || !tokensJson) return null;

  try {
    const user = JSON.parse(userJson) as User;
    const tokens = JSON.parse(tokensJson) as AuthTokens;
    return { user, tokens };
  } catch {
    await clearPersistedAuth();
    return null;
  }
}

/** Auth context provider component. */
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Hydrate from secure storage on mount
  useEffect(() => {
    let mounted = true;

    async function hydrate(): Promise<void> {
      dispatch({ type: 'AUTH_LOADING' });

      const persisted = await hydrateAuth();

      if (!mounted) return;

      if (persisted) {
        try {
          const freshTokens = await authService.refreshTokens(
            persisted.tokens.refreshToken,
          );
          await persistAuth(persisted.user, freshTokens);
          if (!mounted) return;
          dispatch({
            type: 'AUTH_SUCCESS',
            user: persisted.user,
            tokens: freshTokens,
          });
        } catch {
          await clearPersistedAuth();
          if (!mounted) return;
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    }

    void hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      dispatch({ type: 'AUTH_LOADING' });

      try {
        const result = await authService.signIn(email, password);
        await persistAuth(result.user, result.tokens);
        dispatch({
          type: 'AUTH_SUCCESS',
          user: result.user,
          tokens: result.tokens,
        });
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE' });
        throw error;
      }
    },
    [],
  );

  const signOut = useCallback(async (): Promise<void> => {
    if (state.tokens?.accessToken) {
      await authService.signOut(state.tokens.accessToken);
    }
    await clearPersistedAuth();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, [state.tokens?.accessToken]);

  const contextValue: AuthContextValue = {
    state,
    signIn,
    signOut,
    isAuthenticated: state.status === 'authenticated',
    isLoading: state.status === 'idle' || state.status === 'loading',
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
