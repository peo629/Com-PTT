import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * Root layout — configures the top-level navigation stack and global
 * status bar for CoM-PTT.
 *
 * Providers (Auth, WebSocket, SOS, etc.) are added incrementally in
 * subsequent build steps and will wrap this component tree.
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
