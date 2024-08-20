import React from 'react';
import { render } from '@testing-library/react-native';

import AssetPill from './AssetPill';
import {
  selectChainId,
  selectTicker,
} from '../../../../selectors/networkController';
import { AssetType, AssetIdentifier } from '../types';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation((selector) => selector()),
}));
jest.mock('../../../../selectors/networkController');
jest.mock(
  '../../../../component-library/components/Avatars/Avatar/variants/AvatarNetwork',
  () => 'AvatarNetwork',
);
jest.mock('../../Name/Name', () => 'Name');
jest.mock('../../../hooks/useStyles', () => ({
  useStyles: () => ({ styles: {} }),
}));

jest.mock('../../../../core/Engine', () => ({
  context: {
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
}));

describe('AssetPill', () => {
  const selectChainIdMock = jest.mocked(selectChainId);
  const selectTickerMock = jest.mocked(selectTicker);

  beforeAll(() => {
    selectChainIdMock.mockReturnValue('0x1');
    selectTickerMock.mockReturnValue('ETH');
  });

  it('renders correctly for native assets', () => {
    const asset = { type: AssetType.Native } as AssetIdentifier;
    const { getByText, getByTestId } = render(<AssetPill asset={asset} />);

    expect(
      getByTestId('simulation-details-asset-pill-avatar-network'),
    ).toBeTruthy();
    expect(getByText('ETH')).toBeTruthy();
  });

  it('renders Name component for ERC20 tokens', () => {
    const asset = {
      type: AssetType.ERC20,
      address: '0xabc123',
    } as AssetIdentifier;
    const { getByTestId } = render(<AssetPill asset={asset} />);

    expect(getByTestId('simulation-details-asset-pill-name')).toBeTruthy();
  });
});
