export const flushPromises = () => new Promise(setImmediate);

export const FIXTURE_SERVER_PORT = 12345;

// E2E test configuration required in app
export const testConfig = {};

/**
 * TODO: Update this condition once we change E2E builds to use release instead of debug
 */
export const isTest = process.env.METAMASK_ENVIRONMENT !== 'production';
export const getFixturesServerPortInApp = () =>
  testConfig.fixtureServerPort ?? FIXTURE_SERVER_PORT;

// TODO: we will keep this only for Detox to be detected in postinit.ts
export const isDetox = typeof global.device !== 'undefined' && !!global.device;
