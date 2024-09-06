import Engine from '../../core/Engine';
import { SEPOLIA } from '../../constants/network';
import { store } from '../../store';
import handleNetworkSwitch from './handleNetworkSwitch';

const mockEngine = Engine;
const mockStore = jest.mocked(store);

jest.mock('../../core/Engine', () => ({
  context: {
    CurrencyRateController: {
      updateExchangeRate: jest.fn(),
    },
    NetworkController: {
      getNetworkClientById: jest.fn().mockReturnValue({
        configuration: {
          chainId: '0x1',
          rpcUrl: 'https://mainnet.infura.io/v3',
          ticker: 'ETH',
          type: 'custom',
        },
      }),
      setActiveNetwork: jest.fn(),
      setProviderType: jest.fn(),
    },
  },
}));

jest.mock('../../store', () => ({
  store: {
    getState: jest.fn(),
  },
}));

function setupGetStateMock() {
  mockStore.getState.mockImplementation(
    () =>
      ({
        engine: {
          backgroundState: {
            NetworkController: {
              isCustomNetwork: false,
              networkConfigurations: {
                networkId1: {
                  rpcUrl: 'custom-testnet-rpc-url',
                  chainId: '0x53a',
                  ticker: 'TEST',
                  nickname: 'Testnet',
                },
              },
              providerConfig: {
                type: 'mainnet',
                chainId: '0x1',
              },
              networkDetails: {
                EIPS: { 1559: false },
              },
            },
          },
        },
        // Cast to 'any' because we don't have a complete Redux mock to use
        // TODO: Replace "any" with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
  );
}

describe('useHandleNetworkSwitch', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('does nothing if not given a chain ID', () => {
    (
      Engine.context.NetworkController.getNetworkClientById as jest.Mock
    ).mockReturnValue({
      configuration: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3',
        ticker: 'ETH',
        type: 'custom',
      },
    });

    setupGetStateMock();

    const result = handleNetworkSwitch('');

    expect(
      mockEngine.context.CurrencyRateController.updateExchangeRate,
    ).not.toBeCalled();
    expect(
      mockEngine.context.NetworkController.setActiveNetwork,
    ).not.toBeCalled();
    expect(
      mockEngine.context.NetworkController.setProviderType,
    ).not.toBeCalled();
    expect(result).toBeUndefined();
  });

  it('does nothing if the chain ID matches the current global chain ID', () => {
    (
      Engine.context.NetworkController.getNetworkClientById as jest.Mock
    ).mockReturnValue({
      configuration: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3',
        ticker: 'ETH',
        type: 'custom',
      },
    });

    setupGetStateMock();

    const result = handleNetworkSwitch('1');

    expect(
      mockEngine.context.CurrencyRateController.updateExchangeRate,
    ).not.toBeCalled();
    expect(
      mockEngine.context.NetworkController.setActiveNetwork,
    ).not.toBeCalled();
    expect(
      mockEngine.context.NetworkController.setProviderType,
    ).not.toBeCalled();
    expect(result).toBeUndefined();
  });

  it('throws an error if the chain ID is not recognized', () => {
    (
      Engine.context.NetworkController.getNetworkClientById as jest.Mock
    ).mockReturnValue({
      configuration: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3',
        ticker: 'ETH',
        type: 'custom',
      },
    });

    setupGetStateMock();

    expect(() => handleNetworkSwitch('123456')).toThrow(
      'Unknown network with id 123456',
    );
  });

  it('switches to a custom network', () => {
    (
      Engine.context.NetworkController.getNetworkClientById as jest.Mock
    ).mockReturnValue({
      configuration: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3',
        ticker: 'ETH',
        type: 'custom',
      },
    });

    setupGetStateMock();

    const nickname = handleNetworkSwitch('1338');

    expect(
      mockEngine.context.CurrencyRateController.updateExchangeRate,
    ).toBeCalledWith('TEST');
    expect(
      mockEngine.context.NetworkController.setActiveNetwork,
    ).toBeCalledWith('networkId1');
    expect(
      mockEngine.context.NetworkController.setProviderType,
    ).not.toBeCalled();
    expect(nickname).toBe('Testnet');
  });

  it('switches to a built-in network', () => {
    (
      Engine.context.NetworkController.getNetworkClientById as jest.Mock
    ).mockReturnValue({
      configuration: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3',
        ticker: 'ETH',
        type: 'custom',
      },
    });

    setupGetStateMock();

    const networkType = handleNetworkSwitch('11155111');

    // TODO: This is a bug, it should be set to SepoliaETH
    expect(
      mockEngine.context.CurrencyRateController.updateExchangeRate,
    ).toBeCalledWith('ETH');
    expect(mockEngine.context.NetworkController.setProviderType).toBeCalledWith(
      SEPOLIA,
    );
    expect(
      mockEngine.context.NetworkController.setActiveNetwork,
    ).not.toBeCalled();
    expect(networkType).toBe(SEPOLIA);
  });
});
