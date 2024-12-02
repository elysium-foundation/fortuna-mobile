import { backgroundState } from './initial-root-state';

export const personalSignatureConfirmationState = {
  engine: {
    backgroundState: {
      ...backgroundState,
      ApprovalController: {
        pendingApprovals: {
          '76b33b40-7b5c-11ef-bc0a-25bce29dbc09': {
            id: '76b33b40-7b5c-11ef-bc0a-25bce29dbc09',
            origin: 'metamask.github.io',
            type: 'personal_sign',
            time: 1727282253048,
            requestData: {
              data: '0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765',
              from: '0x935e73edb9ff52e23bac7f7e043a1ecd06d05477',
              meta: {
                url: 'https://metamask.github.io/test-dapp/',
                title: 'E2E Test Dapp',
                icon: { uri: 'https://metamask.github.io/metamask-fox.svg' },
                analytics: { request_source: 'In-App-Browser' },
              },
              origin: 'metamask.github.io',
              metamaskId: '76b33b40-7b5c-11ef-bc0a-25bce29dbc09',
            },
            requestState: null,
            expectsResult: true,
          },
        },
        pendingApprovalCount: 1,
        approvalFlows: [],
      },
    },
  },
};

export const typedSignV1ConfirmationState = {
  engine: {
    backgroundState: {
      ...backgroundState,
      ApprovalController: {
        pendingApprovals: {
          '7e62bcb1-a4e9-11ef-9b51-ddf21c91a998': {
            id: '7e62bcb1-a4e9-11ef-9b51-ddf21c91a998',
            origin: 'metamask.github.io',
            type: 'eth_signTypedData',
            time: 1731850822653,
            requestData: {
              data: [
                { type: 'string', name: 'Message', value: 'Hi, Alice!' },
                { type: 'uint32', name: 'A number', value: '1337' },
              ],
              from: '0x935e73edb9ff52e23bac7f7e043a1ecd06d05477',
              requestId: 2453610887,
              meta: {
                url: 'https://metamask.github.io/test-dapp/',
                title: 'E2E Test Dapp',
                icon: { uri: 'https://metamask.github.io/metamask-fox.svg' },
                analytics: { request_source: 'In-App-Browser' },
              },
              origin: 'metamask.github.io',
              metamaskId: '7e62bcb0-a4e9-11ef-9b51-ddf21c91a998',
              version: 'V1',
            },
            requestState: null,
            expectsResult: true,
          },
        },
        pendingApprovalCount: 1,
        approvalFlows: [],
      },
    },
  },
};
