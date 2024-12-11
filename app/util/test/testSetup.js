import { NativeModules } from 'react-native';
import mockRNAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
/* eslint-disable import/no-namespace */
import { mockTheme } from '../theme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-native-quick-crypto', () => ({}));
jest.mock('react-native-blob-jsi-helper', () => ({}));

jest.mock('react-native', () => {
  const originalModule = jest.requireActual('react-native');

  // Set the Platform.OS property to the desired value
  originalModule.Platform.OS = 'ios'; // or 'android', depending on what you want to test

  return originalModule;
});

/*
 * NOTE: react-native-webview requires a jest mock starting on v12.
 * More info on https://github.com/react-native-webview/react-native-webview/issues/2934
 */
jest.mock('@metamask/react-native-webview', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { View } = require('react-native');
  const WebView = (props) => <View {...props} />;

  return {
    WebView,
  };
});

jest.mock('../../lib/snaps/preinstalled-snaps');

const mockFs = {
  CachesDirectoryPath: jest.fn(),
  DocumentDirectoryPath: jest.fn(),
  ExternalDirectoryPath: jest.fn(),
  ExternalStorageDirectoryPath: jest.fn(),
  LibraryDirectoryPath: jest.fn(),
  MainBundlePath: 'testPath',
  PicturesDirectoryPath: jest.fn(),
  TemporaryDirectoryPath: jest.fn(),
  appendFile: jest.fn(),
  completeHandlerIOS: jest.fn(),
  copyAssetsVideoIOS: jest.fn(),
  copyFile: jest.fn(),
  copyFileAssets: jest.fn(),
  copyFileAssetsIOS: jest.fn(),
  downloadFile: jest.fn(),
  exists: () =>
    new Promise((resolve) => {
      resolve('console.log()');
    }),
  existsAssets: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  getFSInfo: jest.fn(),
  hash: jest.fn(),
  isResumable: jest.fn(),
  ls: jest.fn(),
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  read: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  readFile: () =>
    new Promise((resolve) => {
      resolve('console.log()');
    }),
  readFileAssets: jest.fn(),
  readdir: jest.fn(),
  resumeDownload: jest.fn(),
  setReadable: jest.fn(),
  stat: jest.fn(),
  stopDownload: jest.fn(),
  stopUpload: jest.fn(),
  touch: jest.fn(),
  unlink: jest.fn(),
  uploadFiles: jest.fn(),
  write: jest.fn(),
  writeFile: jest.fn(),
};

jest.mock('react-native-fs', () => mockFs);

jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: {
      DocumentDir: 'docs',
    },
    ...mockFs,
  },
  ios: {
    excludeFromBackupKey: jest.fn(),
  },
}));

Date.now = jest.fn(() => 123);

jest.mock('../../core/NotificationManager', () => ({
  init: jest.fn(),
  watchSubmittedTransaction: jest.fn(),
  getTransactionToView: jest.fn(),
  setTransactionToView: jest.fn(),
  gotIncomingTransaction: jest.fn(),
  requestPushNotificationsPermission: jest.fn(),
  showSimpleNotification: jest.fn(),
}));

jest.mock('../../store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

jest.mock('../../core/NotificationManager');

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock(
  'react-native/Libraries/Utilities/NativePlatformConstantsIOS',
  () => ({
    ...jest.requireActual(
      'react-native/Libraries/Utilities/NativePlatformConstantsIOS',
    ),
    getConstants: () => ({
      forceTouchAvailable: false,
      interfaceIdiom: 'en',
      isTesting: false,
      osVersion: 'ios',
      reactNativeVersion: { major: 60, minor: 1, patch: 0 },
      systemName: 'ios',
    }),
  }),
);

jest.mock('react-native-keychain', () => ({
  SECURITY_LEVEL_ANY: 'MOCK_SECURITY_LEVEL_ANY',
  SECURITY_LEVEL_SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
  SECURITY_LEVEL_SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  BIOMETRY_TYPE: {
    TOUCH_ID: 'TouchID',
    FACE_ID: 'FaceID',
    FINGERPRINT: 'Fingerprint',
    FACE: 'Face',
    IRIS: 'Iris',
  },
  getSupportedBiometryType: jest.fn().mockReturnValue('FaceID'),
  setInternetCredentials: jest
    .fn(('server', 'username', 'password'))
    .mockResolvedValue({ service: 'metamask', storage: 'storage' }),
  getInternetCredentials: jest
    .fn()
    .mockResolvedValue({ password: 'mock-credentials-password' }),
  resetInternetCredentials: jest.fn().mockResolvedValue(),
  ACCESSIBLE: {
    WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
    AFTER_FIRST_UNLOCK: 'AccessibleAfterFirstUnlock',
    ALWAYS: 'AccessibleAlways',
    WHEN_PASSCODE_SET_THIS_DEVICE_ONLY:
      'AccessibleWhenPasscodeSetThisDeviceOnly',
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY:
      'AccessibleAfterFirstUnlockThisDeviceOnly',
    ALWAYS_THIS_DEVICE_ONLY: 'AccessibleAlwaysThisDeviceOnly',
  },
}));

jest.mock('react-native-share', () => 'RNShare');
jest.mock('react-native-branch', () => ({
  subscribe: jest.fn(),
}));
jest.mock('react-native-sensors', () => 'RNSensors');
jest.mock('@metamask/react-native-search-api', () => 'SearchApi');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-background-timer', () => 'RNBackgroundTimer');
jest.mock(
  '@react-native-async-storage/async-storage',
  () => mockRNAsyncStorage,
);
jest.mock('@react-native-cookies/cookies', () => 'RNCookies');

NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  forceTouchAvailable: jest.fn(),
  State: {},
  Directions: {},
};

NativeModules.RNCNetInfo = {
  getCurrentConnectivity: jest.fn(),
  isConnectionMetered: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  getCurrentState: jest.fn(() => Promise.resolve()),
};

NativeModules.NotifeeApiModule = {
  addListener: jest.fn(),
  eventsAddListener: jest.fn(),
  eventsNotifyReady: jest.fn(),
};

NativeModules.PlatformConstants = {
  forceTouchAvailable: false,
};

NativeModules.Aes = {
  sha256: jest.fn().mockImplementation((address) => {
    const uniqueAddressChar = address[2]; // Assuming 0x prefix is present, so actual third character is at index 2
    const hashBase = '012345678987654';
    return Promise.resolve(hashBase + uniqueAddressChar);
  }),
  pbkdf2: jest.fn().mockResolvedValue('mockedKey'),
  randomKey: jest.fn().mockResolvedValue('mockedIV'),
  encrypt: jest.fn().mockResolvedValue('mockedCipher'),
  decrypt: jest.fn().mockResolvedValue('{"mockData": "mockedPlainText"}'),
};

NativeModules.AesForked = {
  pbkdf2: jest.fn().mockResolvedValue('mockedKeyForked'),
  decrypt: jest.fn().mockResolvedValue('{"mockData": "mockedPlainTextForked"}'),
};

NativeModules.RNTar = {
  unTar: jest.fn().mockResolvedValue('/document-dir/archive'),
};

jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableOpacity',
  () => 'TouchableOpacity',
);
jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableHighlight',
  () => 'TouchableHighlight',
);
jest.mock(
  'react-native/Libraries/Components/TextInput/TextInput',
  () => 'TextInput',
);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
  runAfterInteractions: jest.fn(),
  createInteractionHandle: jest.fn(),
  clearInteractionHandle: jest.fn(),
  setDeadline: jest.fn(),
}));

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);

jest.mock('../theme', () => ({
  ...jest.requireActual('../theme'),
  useAppThemeFromContext: () => ({ ...mockTheme }),
}));

global.segmentMockClient = null;

const initializeMockClient = () => {
  global.segmentMockClient = {
    screen: jest.fn(),
    track: jest.fn(),
    identify: jest.fn(),
    flush: jest.fn(),
    group: jest.fn(),
    alias: jest.fn(),
    reset: jest.fn(),
    add: jest.fn(),
  };
  return global.segmentMockClient;
};

jest.mock('@segment/analytics-react-native', () => {
  class Plugin {
    type = 'utility';
    analytics = undefined;

    configure(analytics) {
      this.analytics = analytics;
    }
  }

  return {
    createClient: jest.fn(() => initializeMockClient()),
    PluginType: {
      enrichment: 'enrichment',
      utility: 'utility',
    },
    EventType: {
      TrackEvent: 'track',
      IdentifyEvent: 'identify',
    },
    Plugin,
  };
});

jest.mock('@notifee/react-native', () =>
  require('@notifee/react-native/jest-mock'),
);

jest.mock('react-native/Libraries/Image/resolveAssetSource', () => ({
  __esModule: true,
  default: (source) => {
    return { uri: source.uri };
  },
}));

jest.mock('redux-persist', () => {
  const mockPersistor = {
    subscribe: jest.fn(),
    purge: jest.fn(),
    pause: jest.fn(),
    persist: jest.fn(),
    flush: jest.fn(),
  };
  return {
    persistStore: jest.fn(() => mockPersistor),
    persistReducer: (_, reducer) => {
      return reducer || ((state) => state);
    },
    createTransform: jest.fn(),
    createMigrate: jest.fn(),
  };
});

jest.mock('../../store/storage-wrapper', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// eslint-disable-next-line import/no-commonjs
require('react-native-reanimated/lib/module/reanimated2/jestUtils').setUpTests();
global.__reanimatedWorkletInit = jest.fn();
global.__DEV__ = false;

jest.mock('../../core/Engine', () =>
  require('../../core/__mocks__/MockedEngine'),
);

afterEach(() => {
  jest.restoreAllMocks();
  global.gc && global.gc(true);
});

global.crypto = {
  getRandomValues: (arr) => {
    const uint8Max = 255;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * (uint8Max + 1));
    }
    return arr;
  },
};

jest.mock('@react-native-firebase/messaging', () => {
  const module = () => {
    return {
      getToken: jest.fn(() => Promise.resolve('fcmToken')),
      deleteToken: jest.fn(() => Promise.resolve()),
      subscribeToTopic: jest.fn(),
      unsubscribeFromTopic: jest.fn(),
      hasPermission: jest.fn(() =>
        Promise.resolve(module.AuthorizationStatus.AUTHORIZED),
      ),
      requestPermission: jest.fn(() =>
        Promise.resolve(module.AuthorizationStatus.AUTHORIZED),
      ),
      setBackgroundMessageHandler: jest.fn(() => Promise.resolve()),
      isDeviceRegisteredForRemoteMessages: jest.fn(() =>
        Promise.resolve(false),
      ),
      registerDeviceForRemoteMessages: jest.fn(() =>
        Promise.resolve('registered'),
      ),
      unregisterDeviceForRemoteMessages: jest.fn(() =>
        Promise.resolve('unregistered'),
      ),
      onMessage: jest.fn(),
      onTokenRefresh: jest.fn(),
    };
  };

  module.AuthorizationStatus = {
    NOT_DETERMINED: -1,
    DENIED: 0,
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  };

  return module;
});
