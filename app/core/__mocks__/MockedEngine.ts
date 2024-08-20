import { KeyringTypes } from '@metamask/keyring-controller';

const engineModule = jest.requireActual('../../core/Engine');

export const mockedEngine = {
  init: () => engineModule.default.init({}),
  context: {
    KeyringController: {
      keyring: {
        keyrings: [
          {
            mnemonic:
              'one two three four five six seven eight nine ten eleven twelve',
          },
        ],
      },
      state: {
        keyrings: [
          {
            accounts: ['0xd018538C87232FF95acbCe4870629b75640a78E7'],
            type: KeyringTypes.simple,
          },
          {
            accounts: ['0xB374Ca013934e498e5baD3409147F34E6c462389'],
            type: KeyringTypes.qr,
          },
          {
            accounts: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F'],
            type: KeyringTypes.hd,
          },
        ],
      },
    },
    NetworkController: {
      getNetworkClientById: () => ({
        configuration: {
          rpcUrl: 'https://mainnet.infura.io/v3',
          chainId: '0x1',
          ticker: 'ETH',
          nickname: 'Ethereum mainnet',
          rpcPrefs: {
            blockExplorerUrl: 'https://etherscan.com',
          },
        },
      }),
      state: {
        networkConfigurations: {
          '673a4523-3c49-47cd-8d48-68dfc8a47a9c': {
            id: '673a4523-3c49-47cd-8d48-68dfc8a47a9c',
            rpcUrl: 'https://mainnet.infura.io/v3',
            chainId: '0x1',
            ticker: 'ETH',
            nickname: 'Ethereum mainnet',
            rpcPrefs: {
              blockExplorerUrl: 'https://etherscan.com',
            },
          },
        },
        selectedNetworkClientId: '673a4523-3c49-47cd-8d48-68dfc8a47a9c',
        networkMetadata: {},
      },
    },
  },
  hasFunds: jest.fn(),
};

export default mockedEngine;
