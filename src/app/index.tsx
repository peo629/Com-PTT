import { Redirect } from 'expo-router';

/**
 * Root entry point.
 *
 * Immediately redirects to the auth gate. The auth gate will forward
 * authenticated users to (app) and unauthenticated users to (auth)/sign-in.
 * Replaced in Step 3 with a provider-aware redirect once the auth flow is built.
 */
export default function Index(): React.JSX.Element {
  return <Redirect href="/(auth)/sign-in" />;
}
