import { useEffect, useRef, useState } from 'react';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';

import Engine from '../../core/Engine';
import { strings } from '../../../locales/i18n';

export enum LedgerCommunicationErrors {
  LedgerDisconnected = 'LedgerDisconnected',
  FailedToOpenApp = 'FailedToOpenApp',
  FailedToCloseApp = 'FailedToCloseApp',
  UserRefusedConfirmation = 'UserRefusedConfirmation',
  AppIsNotInstalled = 'AppIsNotInstalled',
  LedgerIsLocked = 'LedgerIsLocked',
  UnknownError = 'UnknownError',
}
class LedgerError extends Error {
  public readonly code: LedgerCommunicationErrors;

  constructor(message: string, code: LedgerCommunicationErrors) {
    super(message);
    this.code = code;
  }
}

type LedgerLogicToRunType = (transport: BluetoothTransport) => Promise<void>;

interface UseLedgerBluetoothHook {
  isSendingLedgerCommands: boolean;
  isAppLaunchConfirmationNeeded: boolean;
  ledgerLogicToRun: (func: LedgerLogicToRunType) => Promise<void>;
  error?: LedgerCommunicationErrors;
  cleanupBluetoothConnection: () => void;
}

const RESTART_LIMIT = 5;

// Assumptions
// 1. One big code block - logic all encapsulated in logicToRun
// 2. logicToRun calls setUpBluetoothConnection
function useLedgerBluetooth(deviceId?: string): UseLedgerBluetoothHook {
  const { KeyringController } = Engine.context as any;

  // This is to track if we are expecting code to run or connection operational
  const [isSendingLedgerCommands, setIsSendingLedgerCommands] =
    useState<boolean>(false);

  const [isAppLaunchConfirmationNeeded, setIsAppLaunchConfirmationNeeded] =
    useState<boolean>(false);

  const transportRef = useRef<BluetoothTransport>();
  const restartConnectionState = useRef<{
    shouldRestartConnection: boolean;
    restartCount: number;
  }>({
    shouldRestartConnection: false,
    restartCount: 0,
  });

  // Due to the async nature of the disconnects after sending an APDU command we load the code to run in a stack
  // with code being pushed and popped off of the stack
  const workflowSteps = useRef<(() => Promise<void>)[]>([]);
  const [ledgerError, setLedgerError] = useState<LedgerCommunicationErrors>();

  const resetConnectionState = () => {
    restartConnectionState.current.restartCount = 0;
    restartConnectionState.current.shouldRestartConnection = false;
    workflowSteps.current = [];
    setIsSendingLedgerCommands(false);
  };

  useEffect(
    () => () => {
      if (transportRef.current) {
        resetConnectionState();
        transportRef.current.close();
      }
    },
    [],
  );

  // Sets up the Bluetooth transport
  const setUpBluetoothConnection = async () => {
    if (!transportRef.current && deviceId) {
      try {
        transportRef.current = await BluetoothTransport.open(deviceId);
        transportRef.current?.on('disconnect', (e) => {
          transportRef.current = undefined;
          // Restart connection if more code is to be run
          if (
            workflowSteps.current.length > 0 &&
            restartConnectionState.current.restartCount < RESTART_LIMIT &&
            restartConnectionState.current.shouldRestartConnection
          ) {
            restartConnectionState.current.restartCount += 1;

            const funcAfterDisconnect = workflowSteps.current.pop();
            if (!funcAfterDisconnect) {
              return setLedgerError(LedgerCommunicationErrors.UnknownError);
            }

            return funcAfterDisconnect();
          }

          // In case we somehow end up in an infinite loop or bluetooth connection is faulty
          if (restartConnectionState.current.restartCount === RESTART_LIMIT) {
            setLedgerError(LedgerCommunicationErrors.LedgerDisconnected);
          }

          // Reset all connection states
          resetConnectionState();
        });

        // We set this after the bluetooth connection has been established to be defensive
        setIsSendingLedgerCommands(true);
      } catch (e) {
        // Reset all connection states
        resetConnectionState();
        setLedgerError(LedgerCommunicationErrors.LedgerDisconnected);
      }
    }
  };

  const processLedgerWorkflow = async () => {
    try {
      // Must do this at start of every code block to run to ensure transport is set
      await setUpBluetoothConnection();
      // Initialise the keyring and check for pre-conditions (is the correct app running?)
      const appName = await KeyringController.connectLedgerHardware(
        transportRef.current,
        deviceId,
      );

      // BOLOS is the Ledger main screen app
      if (appName === 'BOLOS') {
        // Open Ethereum App
        try {
          setIsAppLaunchConfirmationNeeded(true);
          await KeyringController.openEthereumApp();
        } catch (e: any) {
          if (e.name === 'TransportStatusError') {
            switch (e.statusCode) {
              case 0x6984:
              case 0x6807:
                throw new LedgerError(
                  strings('ledger.ethereum_app_not_installed_error'),
                  LedgerCommunicationErrors.AppIsNotInstalled,
                );
              case 0x6985:
              case 0x5501:
                throw new LedgerError(
                  strings('ledger.ethereum_app_unconfirmed_error'),
                  LedgerCommunicationErrors.UserRefusedConfirmation,
                );
            }
          }

          throw new LedgerError(
            strings('ledger.ethereum_app_open_error'),
            LedgerCommunicationErrors.FailedToOpenApp,
          );
        } finally {
          setIsAppLaunchConfirmationNeeded(false);
        }

        workflowSteps.current.push(processLedgerWorkflow);
        restartConnectionState.current.shouldRestartConnection = true;

        return;
      } else if (appName !== 'Ethereum') {
        try {
          await KeyringController.closeRunningApp();
        } catch (e) {
          throw new LedgerError(
            strings('ledger.running_app_close_error'),
            LedgerCommunicationErrors.FailedToCloseApp,
          );
        }

        workflowSteps.current.push(processLedgerWorkflow);
        restartConnectionState.current.shouldRestartConnection = true;

        return;
      }

      // Should now be on the Ethereum app if reached this point
      if (workflowSteps.current.length === 1) {
        const finalLogicFunc = workflowSteps.current.pop();
        if (!finalLogicFunc) {
          throw new Error('finalLogicFunc is undefined inside workflowSteps.');
        }
        return await finalLogicFunc();
      }
    } catch (e: any) {
      if (e.name === 'TransportStatusError' && e.statusCode === 0x6b0c) {
        setLedgerError(LedgerCommunicationErrors.LedgerIsLocked);
      }

      if (e instanceof LedgerError) {
        setLedgerError(e.code);
      } else {
        setLedgerError(LedgerCommunicationErrors.UnknownError);
      }

      resetConnectionState();
    }
  };

  return {
    isSendingLedgerCommands,
    isAppLaunchConfirmationNeeded,
    ledgerLogicToRun: async (func) => {
      // Reset error
      setLedgerError(undefined);
      // Add code block as last item in stack
      workflowSteps.current.push(() =>
        func(transportRef.current as BluetoothTransport),
      );
      //  Start off workflow
      processLedgerWorkflow();
    },
    error: ledgerError,
    cleanupBluetoothConnection: resetConnectionState,
  };
}

export default useLedgerBluetooth;
