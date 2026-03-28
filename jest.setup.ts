/* eslint-disable @typescript-eslint/no-require-imports */
import '@testing-library/react-native/extend-expect';

/** Mock expo-router */
jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    router: {
      replace: jest.fn(),
      push: jest.fn(),
      back: jest.fn(),
      navigate: jest.fn(),
    },
    useRouter: () => ({
      replace: jest.fn(),
      push: jest.fn(),
      back: jest.fn(),
      navigate: jest.fn(),
    }),
    useLocalSearchParams: jest.fn().mockReturnValue({}),
    useSegments: jest.fn().mockReturnValue([]),
    Redirect: ({ href }: { href: string }) => {
      const { Text } = require('react-native');
      return <Text testID="redirect">{`Redirect to ${href}`}</Text>;
    },
    Stack: Object.assign(
      ({ children }: { children?: React.ReactNode }) => {
        const { View } = require('react-native');
        return <View testID="stack">{children}</View>;
      },
      {
        Screen: ({ name }: { name: string }) => {
          const { View } = require('react-native');
          return <View testID={`stack-screen-${name}`} />;
        },
      },
    ),
    Slot: () => {
      const { View } = require('react-native');
      return <View testID="slot" />;
    },
  };
});

/** Mock react-native-safe-area-context */
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => (
      <View testID="safe-area-provider">{children}</View>
    ),
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => (
      <View testID="safe-area-view" {...props}>
        {children}
      </View>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

/** Mock expo-haptics */
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));
