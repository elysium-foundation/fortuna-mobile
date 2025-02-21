import { getAccountsControllerMessenger } from './accounts-controller-messenger';
import { getBridgeControllerMessenger } from './bridge-controller-messenger';
import type { ControllerMessengerByControllerName } from '../types';

/**
 * The messengers for the controllers that have been.
 */
export const CONTROLLER_MESSENGERS: ControllerMessengerByControllerName = {
  AccountsController: {
    getMessenger: getAccountsControllerMessenger,
  },
  BridgeController: {
    getMessenger: getBridgeControllerMessenger,
  },
} as const;
