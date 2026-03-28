import '@testing-library/react-native/extend-expect';

// ── expo-router mock ──
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock('expo-router', () => {
  const React = require('react');

  /** Mock Stack component that renders children. */
  function MockStack({
    children,
  }: {
    children?: React.ReactNode;
    screenOptions?: Record<string, unknown>;
  }): React.ReactElement {
    return React.createElement(React.Fragment, null, children);
  }
  MockStack.Screen = function MockScreen(_props: Record<string, unknown>) {
    return null;
  };

  return {
    router: {
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      canGoBack: jest.fn(() => false),
      navigate: mockNavigate,
    },
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      canGoBack: jest.fn(() => false),
      navigate: mockNavigate,
    }),
    useSegments: jest.fn(() => []),
    useLocalSearchParams: jest.fn(() => ({})),
    useGlobalSearchParams: jest.fn(() => ({})),
    Link: 'Link',
    Redirect: function MockRedirect() {
      return null;
    },
    Stack: MockStack,
    Slot: function MockSlot() {
      return null;
    },
  };
});

// ── react-native-safe-area-context mock ──
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: function MockSafeAreaView({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      style?: Record<string, unknown>;
      testID?: string;
    }): React.ReactElement {
      return React.createElement('View', props, children);
    },
    SafeAreaProvider: function MockSafeAreaProvider({
      children,
    }: {
      children?: React.ReactNode;
    }): React.ReactElement {
      return React.createElement(React.Fragment, null, children);
    },
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// ── expo-haptics mock ──
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

// ── expo-secure-store mock (Map-backed for state persistence within tests) ──
const mockSecureStoreData = new Map<string, string>();

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn((key: string, value: string) => {
    mockSecureStoreData.set(key, value);
    return Promise.resolve();
  }),
  getItemAsync: jest.fn((key: string) => {
    return Promise.resolve(mockSecureStoreData.get(key) ?? null);
  }),
  deleteItemAsync: jest.fn((key: string) => {
    mockSecureStoreData.delete(key);
    return Promise.resolve();
  }),
}));

// ── expo-status-bar mock ──
jest.mock('expo-status-bar', () => ({
  StatusBar: function MockStatusBar() {
    return null;
  },
}));

// Clear mock store between tests
beforeEach(() => {
  mockSecureStoreData.clear();
});
