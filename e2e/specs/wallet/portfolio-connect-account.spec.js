'use strict';
import { SmokeCore } from '../../tags';
import TabBarComponent from '../../pages/wallet/TabBarComponent';
import { loginToApp } from '../../viewHelper';
import {
  loadFixture,
  startFixtureServer,
  stopFixtureServer,
} from '../../fixtures/fixture-helper';
import FixtureBuilder from '../../fixtures/fixture-builder';
import WalletView from '../../pages/wallet/WalletView';
import { getFixturesServerPort } from '../../fixtures/utils';
import FixtureServer from '../../fixtures/fixture-server';
import BrowserView from '../../pages/Browser/BrowserView';
import PortfolioHomePage from '../../pages/Browser/PortfolioHomePage';
import Assertions from '../../utils/Assertions';
import ConnectBottomSheet from '../../pages/Browser/ConnectBottomSheet';
import Utilities from '../../utils/Utilities';
const fixtureServer = new FixtureServer();

describe(SmokeCore('Connect account to Portfolio'), () => {
  beforeAll(async () => {
    await Utilities.reverseServerPort();
    const fixture = new FixtureBuilder().withKeyringController().build();
    fixture.state.user.seedphraseBackedUp = false;
    await startFixtureServer(fixtureServer);
    await loadFixture(fixtureServer, { fixture });
    await Utilities.launchApp({
      permissions: { notifications: 'YES' },
      launchArgs: { fixtureServerPort: `${getFixturesServerPort()}` },
    });
  });
  afterAll(async () => {
    await stopFixtureServer(fixtureServer);
  });

  it('should connect wallet account to portfolio', async () => {
    await loginToApp();
    await Assertions.checkIfVisible(WalletView.container);
    await TabBarComponent.tapBrowser();
    await BrowserView.tapOpenAllTabsButton();
    await BrowserView.tapCloseTabsButton();
    await Assertions.checkIfVisible(BrowserView.noTabsMessage);
    await TabBarComponent.tapWallet();
    await WalletView.tapPortfolio();
    await BrowserView.waitForBrowserPageToLoad();

    try {
      await PortfolioHomePage.closePrivacyModal();
    } catch {
      /* eslint-disable no-console */
      console.log('The Portfolio privacy modal is not visible');
    }
    await device.disableSynchronization();
    await PortfolioHomePage.tapConnectMetaMask();
    await Utilities.delay(2000);
    await ConnectBottomSheet.tapConnectButton();
    await device.enableSynchronization();
  });

  it('should not open additional browser tabs to portfolio', async () => {
    await Assertions.checkIfElementToHaveText(BrowserView.tabsNumber, '1');
    await TabBarComponent.tapWallet();
    await WalletView.tapPortfolio();
    await BrowserView.waitForBrowserPageToLoad();
    await Assertions.checkIfElementToHaveText(BrowserView.tabsNumber, '1');
  });
});
