import { SnapKeyring, SnapKeyringCallbacks } from '@metamask/eth-snap-keyring';
import Logger from '../../util/Logger';
import { showAccountNameSuggestionDialog } from './utils/showDialog';
import { SnapKeyringBuilderMessenger } from './types';
import { SnapId } from '@metamask/snaps-sdk';
import { assertIsValidSnapId } from '@metamask/snaps-utils';

/**
 * Builder type for the Snap keyring.
 */
export interface SnapKeyringBuilder {
  (): SnapKeyring;
  type: typeof SnapKeyring.type;
}

/**
 * Helpers for the Snap keyring implementation.
 */
export interface SnapKeyringHelpers {
  persistKeyringHelper: () => Promise<void>;
  removeAccountHelper: (address: string) => Promise<void>;
}

class SnapKeyringImpl implements SnapKeyringCallbacks {
  readonly #messenger: SnapKeyringBuilderMessenger;

  readonly #persistKeyringHelper: SnapKeyringHelpers['persistKeyringHelper'];

  readonly #removeAccountHelper: SnapKeyringHelpers['removeAccountHelper'];

  constructor(
    messenger: SnapKeyringBuilderMessenger,
    { persistKeyringHelper, removeAccountHelper }: SnapKeyringHelpers,
  ) {
    this.#messenger = messenger;
    this.#persistKeyringHelper = persistKeyringHelper;
    this.#removeAccountHelper = removeAccountHelper;
  }

  async addressExists(address: string) {
    const addresses = await this.#messenger.call(
      'KeyringController:getAccounts',
    );
    return addresses.includes(address.toLowerCase());
  }

  async saveState() {
    await this.#persistKeyringHelper();
  }

  private async withApprovalFlow<Return>(
    run: (flowId: string) => Promise<Return>,
  ): Promise<Return> {
    const { id: flowId } = this.#messenger.call('ApprovalController:startFlow');

    try {
      return await run(flowId);
    } finally {
      this.#messenger.call('ApprovalController:endFlow', {
        id: flowId,
      });
    }
  }

  private async addAccountConfirmations({
    snapId,
    handleUserInput,
    accountNameSuggestion,
  }: {
    snapId: SnapId;
    accountNameSuggestion: string;
    handleUserInput: (accepted: boolean) => Promise<void>;
  }): Promise<{ accountName?: string }> {
    return await this.withApprovalFlow(async (_) => {
      // Show the account **renaming** confirmation dialog.
      const { success, name: accountName } =
        await showAccountNameSuggestionDialog(
          snapId,
          this.#messenger,
          accountNameSuggestion,
        );

      if (!success) {
        // User has cancelled account creation
        await handleUserInput(success);

        throw new Error('User denied account creation');
      }

      await handleUserInput(success);

      return { accountName };
    });
  }

  private async addAccountFinalize({
    accountName,
    onceSaved,
  }: {
    address: string;
    snapId: SnapId;
    onceSaved: Promise<string>;
    accountName?: string;
  }) {
    await this.withApprovalFlow(async (_) => {
      try {
        // First, wait for the account to be fully saved.
        // NOTE: This might throw, so keep this in the `try` clause.
        const accountId = await onceSaved;

        // From here, we know the account has been saved into the Snap keyring
        // state, so we can safely uses this state to run post-processing.
        // (e.g. renaming the account, select the account, etc...)

        // Set the selected account to the new account
        this.#messenger.call(
          'AccountsController:setSelectedAccount',
          accountId,
        );

        if (accountName) {
          this.#messenger.call(
            'AccountsController:setAccountName',
            accountId,
            accountName,
          );
        }
      } catch (e) {
        // Error occurred while naming the account
        const error = (e as Error).message;
        // This part of the flow is not awaited, so we just log the error for now:
        console.error('Error occurred while creating snap account:', error);
      }
    });
  }

  async addAccount(
    address: string,
    snapId: string,
    handleUserInput: (accepted: boolean) => Promise<void>,
    onceSaved: Promise<string>,
    accountNameSuggestion: string = '',
  ) {
    assertIsValidSnapId(snapId);

    // First part of the flow, which includes confirmation dialogs (if not skipped).
    // Once confirmed, we resume the Snap execution.
    const { accountName } = await this.addAccountConfirmations({
      snapId,
      accountNameSuggestion,
      handleUserInput,
    });

    // The second part is about selecting the newly created account and showing some other
    // confirmation dialogs (or error dialogs if anything goes wrong while persisting the account
    // into the state.
    // eslint-disable-next-line no-void
    void this.addAccountFinalize({
      address,
      snapId,
      onceSaved,
      accountName,
    });
  }

  async removeAccount(
    address: string,
    snapId: string,
    handleUserInput: (accepted: boolean) => Promise<void>,
  ) {
    assertIsValidSnapId(snapId);
    // TODO: Implement proper snap account confirmations. Currently, we are approving everything for testing purposes.
    Logger.log(
      `SnapKeyring: removeAccount called with \n
          - address: ${address} \n
          - handleUserInput: ${handleUserInput} \n
          - snapId: ${snapId} \n`,
    );
    // Approve everything for now because we have not implemented snap account confirmations yet
    await handleUserInput(true);
    await this.#removeAccountHelper(address);
    await this.#persistKeyringHelper();
  }

  async redirectUser(snapId: string, url: string, message: string) {
    Logger.log(
      `SnapKeyring: redirectUser called with \n
          - snapId: ${snapId} \n
          - url: ${url} \n
          - message: ${message} \n`,
    );
  }
}

/**
 * Constructs a SnapKeyring builder with specified handlers for managing Snap accounts.
 *
 * @param messenger - The messenger instace.
 * @param helpers - Helpers required by the Snap keyring implementation.
 * @returns A Snap keyring builder.
 */
export function snapKeyringBuilder(
  messenger: SnapKeyringBuilderMessenger,
  helpers: SnapKeyringHelpers,
) {
  const builder = (() =>
    new SnapKeyring(
      // @ts-expect-error TODO: Resolve mismatch between base-controller versions.
      messenger,
      new SnapKeyringImpl(messenger, helpers),
    )) as SnapKeyringBuilder;
  builder.type = SnapKeyring.type;

  return builder;
}
