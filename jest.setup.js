// jest.setup.js
// import 'react-native-gesture-handler/jestSetup';

// Mock native modules not available in Jest environment
if (!global.window) {
  global.window = {};
}
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}));
} catch (e) {
  jest.mock('react-native/src/private/animated/NativeAnimatedHelper', () => ({}));
}

jest.mock('@apollo/client/react', () => ({
  useQuery: () => ({
    loading: false,
    error: undefined,
    data: { listZellerCustomers: { items: [] } },
  }),
}));

jest.mock('react-native-sqlite-storage', () => ({
  enablePromise: jest.fn(),
  openDatabase: jest.fn(() => ({
    executeSql: jest.fn(() => Promise.resolve([{ rows: { length: 0, item: jest.fn() } }])),
  })),
}));

// Mock react-native-vector-icons if used in your app
jest.mock('react-native-vector-icons/EvilIcons', () => 'Icon');

// Mock navigation native helpers
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: jest.fn((cb) => cb()),
  };
});
