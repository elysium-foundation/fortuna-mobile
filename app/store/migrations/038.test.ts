import migrate from './038';
import { merge } from 'lodash';
import { captureException } from '@sentry/react-native';
import initialRootState from '../../util/test/initial-root-state';

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));
const mockedCaptureException = jest.mocked(captureException);

describe('Migration #38', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  const invalidStates = [
    {
      state: null,
      errorMessage: "Migration 38: Invalid state error: 'object'",
      scenario: 'state is invalid',
    },
    {
      state: merge({}, initialRootState, {
        engine: null,
      }),
      errorMessage: "Migration 38: Invalid engine state error: 'object'",
      scenario: 'engine state is invalid',
    },
    {
      state: merge({}, initialRootState, {
        engine: {
          backgroundState: null,
        },
      }),
      errorMessage:
        "Migration 38: Invalid engine backgroundState error: 'object'",
      scenario: 'backgroundState is invalid',
    },
    {
      state: merge({}, initialRootState, {
        engine: {
          backgroundState: { NetworkController: null },
        },
      }),
      errorMessage:
        "Migration 38: Invalid NetworkController state error: 'object'",
      scenario: 'NetworkController is invalid',
    },
    {
      state: merge({}, initialRootState, {
        engine: {
          backgroundState: { NetworkController: { networkId: null } },
        },
      }),
      errorMessage:
        "Migration 38: Invalid NetworkController networkId not found: 'null'",
      scenario: 'providerConfig is invalid',
    },
  ];

  for (const { errorMessage, scenario, state } of invalidStates) {
    it(`should capture exception if ${scenario}`, async () => {
      const newState = await migrate(state);

      expect(newState).toStrictEqual(state);
      expect(mockedCaptureException).toHaveBeenCalledWith(expect.any(Error));
      expect(mockedCaptureException.mock.calls[0][0].message).toBe(
        errorMessage,
      );
    });
  }

  it('Should have deleted networkId from Network Controller and copied to networkId property', async () => {
    const oldState = {
      engine: {
        backgroundState: {
          NetworkController: {
            networkId: '1',
          },
        },
      },
    };

    const expectedState = {
      networkProvider: { networkId: '1' },
      engine: {
        backgroundState: {
          NetworkController: {},
        },
      },
    };

    const newState = await migrate(oldState);

    expect(newState).toStrictEqual(expectedState);
  });
});
