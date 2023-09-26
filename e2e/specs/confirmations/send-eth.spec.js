/* eslint-disable no-console */

'use strict';

import { Smoke } from '../../tags';
import TestHelpers from '../../helpers';

import AmountView from '../../pages/AmountView';
import SendView from '../../pages/SendView';
import TransactionConfirmationView from '../../pages/TransactionConfirmView';
import { loginToApp } from '../../viewHelper';
import TabBarComponent from '../../pages/TabBarComponent';
import WalletActionsModal from '../../pages/modals/WalletActionsModal';
import root from '../../../locales/languages/en.json';
import FixtureBuilder from '../../fixtures/fixture-builder';
import {
  withFixtures,
  defaultGanacheOptions,
} from '../../fixtures/fixture-helper';
import { SMART_CONTRACTS } from '../../../app/util/test/smart-contracts';
import Ganache from '../../../app/util/test/ganache';

describe(Smoke('Send ETH'), () => {
  const TOKEN_NAME = root.unit.eth;
  const AMOUNT = '0.12345';
  let ganacheServer;

  beforeAll(async () => {
    jest.setTimeout(2500000);
    if (device.getPlatform() === 'android') {
      await device.reverseTcpPort('8545'); // ganache
    }
  });

  beforeEach(async () => {
    try {
      ganacheServer = new Ganache();
      await ganacheServer.start(defaultGanacheOptions);
    } catch (e) {
      console.log(e);
    }
  });

  afterEach(async () => {
    try {
      await ganacheServer.quit();
      await TestHelpers.delay(3000);
    } catch (e) {
      console.log(e);
    }
  });

  it('should send ETH to an EOA from inside the wallet', async () => {
    const RECIPIENT = '0x1FDb169Ef12954F20A15852980e1F0C122BfC1D6';
    await withFixtures(
      {
        fixture: new FixtureBuilder().withGanacheNetwork().build(),
        restartDevice: true,
      },
      async () => {
        await loginToApp();

        await TabBarComponent.tapActions();
        await WalletActionsModal.tapSendButton();

        await SendView.inputAddress(RECIPIENT);
        await SendView.tapNextButton();

        await AmountView.typeInTransactionAmount(AMOUNT);
        await AmountView.tapNextButton();

        await TransactionConfirmationView.tapConfirmButton();
        await TabBarComponent.tapActivity();

        await TestHelpers.checkIfElementByTextIsVisible(
          `${AMOUNT} ${TOKEN_NAME}`,
        );
      },
    );
  });

  it('should send ETH to a Multisig from inside the wallet', async () => {
    const MULTISIG_CONTRACT = SMART_CONTRACTS.MULTISIG;

    await withFixtures(
      {
        fixture: new FixtureBuilder().withGanacheNetwork().build(),
        restartDevice: true,
        ganacheServer,
        smartContract: MULTISIG_CONTRACT,
      },
      async ({ contractRegistry }) => {
        const multisigAddress = await contractRegistry.getContractAddress(
          MULTISIG_CONTRACT,
        );
        await loginToApp();

        await TabBarComponent.tapActions();
        await WalletActionsModal.tapSendButton();

        await SendView.inputAddress(multisigAddress);
        await SendView.tapNextButton();

        await AmountView.typeInTransactionAmount(AMOUNT);
        await AmountView.tapNextButton();

        await TransactionConfirmationView.tapConfirmButton();
        await TabBarComponent.tapActivity();

        await TestHelpers.checkIfElementByTextIsVisible(
          `${AMOUNT} ${TOKEN_NAME}`,
        );
      },
    );
  });
});
