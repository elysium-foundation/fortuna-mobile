import React from 'react';
import { render } from '@testing-library/react-native';
import TemplateConfirmation, {
  TemplateConfirmationProps,
} from './TemplateConfirmation';
import { ApprovalTypes } from '../../../../../../core/RPCMethods/RPCMethodMiddleware';
import { getTemplateValues } from './Templates';

jest.mock('./Templates', () => ({
  getTemplateValues: jest.fn(),
}));

const CONTENT_MOCK = 'CONTENT_MOCK';
const CANCEL_TEXT_MOCK = 'CANCEL_TEXT_MOCK';
const CONFIRM_TEXT_MOCK = 'CONFIRM_TEXT_MOCK';

jest.mock('../../../../../../core/Engine', () => ({
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

describe('TemplateConfirmation', () => {
  const mockProps: TemplateConfirmationProps = {
    approvalRequest: {
      id: 'mocked',
      origin: 'metamask',
      requestData: {
        data: '123',
      },
      // Add props here in order to satisfy the type
      type: ApprovalTypes.RESULT_SUCCESS,
      expectsResult: false,
      requestState: null,
      time: 123456,
    },
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  it('renders content and actions', () => {
    (getTemplateValues as jest.Mock).mockReturnValue({
      content: [CONTENT_MOCK],
      cancelText: CANCEL_TEXT_MOCK,
      confirmText: CONFIRM_TEXT_MOCK,
    });
    const wrapper = render(<TemplateConfirmation {...mockProps} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.queryByText(CONTENT_MOCK)).toBeDefined();
    expect(wrapper.queryByText(CANCEL_TEXT_MOCK)).toBeDefined();
    expect(wrapper.queryByText(CONFIRM_TEXT_MOCK)).toBeDefined();
  });

  it('renders content without actions', () => {
    (getTemplateValues as jest.Mock).mockReturnValue({
      content: [CONTENT_MOCK],
      cancelText: CANCEL_TEXT_MOCK,
      confirmText: CONFIRM_TEXT_MOCK,
      hideSubmitButton: true,
      hideCancelButton: true,
    });
    const wrapper = render(<TemplateConfirmation {...mockProps} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.queryByText(CONTENT_MOCK)).toBeDefined();
    expect(wrapper.queryByText(CANCEL_TEXT_MOCK)).toBeNull();
    expect(wrapper.queryByText(CONFIRM_TEXT_MOCK)).toBeNull();
  });
});
