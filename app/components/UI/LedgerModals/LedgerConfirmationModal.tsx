/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-commonjs */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { mockTheme, useAppThemeFromContext } from '../../../util/theme';
import { strings } from '../../../../locales/i18n';
import { Colors } from '../../../util/theme/models';
import useLedgerBluetooth, {
  LedgerCommunicationErrors,
} from '../../../components/hooks/useLedgerBluetooth';
import Engine from '../../../core/Engine';
import useBluetooth from '../../../components/Views/LedgerConnect/hooks/useBluetooth';
import useBluetoothPermissions, {
  BluetoothPermissionErrors,
} from '../../../components/Views/LedgerConnect/hooks/useBluetoothPermissions';
import ConfirmationStep from './Steps/ConfirmationStep';
import ErrorStep from './Steps/ErrorStep';
import OpenETHAppStep from './Steps/OpenETHAppStep';
import SearchingForDeviceStep from './Steps/SearchingForDeviceStep';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      height: 450,
    },
    contentWrapper: {
      flex: 1,
      alignItems: 'center',
      marginTop: 35,
    },
  });

export interface LedgerConfirmationModalProps {
  onConfirmation: () => Promise<void>;
  onRejection: () => void;
  deviceId: string;
}

const LedgerConfirmationModal = ({
  onConfirmation,
  onRejection,
  deviceId,
}: LedgerConfirmationModalProps) => {
  const { KeyringController } = Engine.context as any;
  const { colors } = useAppThemeFromContext() || mockTheme;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    isSendingLedgerCommands,
    isAppLaunchConfirmationNeeded,
    ledgerLogicToRun,
    error: ledgerError,
  } = useLedgerBluetooth(deviceId);
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    subtitle: string;
  }>();

  const {
    hasBluetoothPermissions,
    bluetoothPermissionError,
    checkPermissions,
  } = useBluetoothPermissions();
  const { bluetoothOn, bluetoothConnectionError } = useBluetooth(
    hasBluetoothPermissions,
  );

  const connectLedger = () => {
    ledgerLogicToRun(async () => {
      // Connection attempt
      await KeyringController.unlockLedgerDefaultAccount();
      await onConfirmation();
    });
  };

  // In case of manual rejection
  const onReject = () => {
    onRejection();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onReject, []);

  const onRetry = async () => {
    if (!hasBluetoothPermissions) {
      await checkPermissions();
    }

    if (hasBluetoothPermissions && bluetoothOn) {
      connectLedger();
    }
  };

  useEffect(() => {
    hasBluetoothPermissions && bluetoothOn && connectLedger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBluetoothPermissions, bluetoothOn]);

  useEffect(() => {
    if (ledgerError) {
      switch (ledgerError) {
        case LedgerCommunicationErrors.FailedToOpenApp:
          setErrorDetails({
            title: strings('ledger.failed_to_open_eth_app'),
            subtitle: strings('ledger.ethereum_app_open_error'),
          });
          break;
        case LedgerCommunicationErrors.FailedToCloseApp:
          setErrorDetails({
            title: strings('ledger.running_app_close'),
            subtitle: strings('ledger.running_app_close_error'),
          });
          break;
        case LedgerCommunicationErrors.AppIsNotInstalled:
          setErrorDetails({
            title: strings('ledger.ethereum_app_not_installed'),
            subtitle: strings('ledger.ethereum_app_not_installed_error'),
          });
          break;
        case LedgerCommunicationErrors.LedgerIsLocked:
          setErrorDetails({
            title: strings('ledger.ledger_is_locked'),
            subtitle: strings('ledger.unlock_ledger_message'),
          });
          break;
        case LedgerCommunicationErrors.UserRefusedConfirmation:
          onReject();
          break;
        case LedgerCommunicationErrors.UnknownError:
        case LedgerCommunicationErrors.LedgerDisconnected:
        default:
          setErrorDetails({
            title: strings('ledger.ledger_disconnected'),
            subtitle: strings('ledger.ledger_disconnected_error'),
          });
          break;
      }
    }

    if (bluetoothPermissionError) {
      switch (bluetoothPermissionError) {
        case BluetoothPermissionErrors.LocationAccessBlocked:
          setErrorDetails({
            title: strings('ledger.location_access_blocked'),
            subtitle: strings('ledger.location_access_blocked_error'),
          });
          break;
        case BluetoothPermissionErrors.BluetoothAccessBlocked:
          setErrorDetails({
            title: strings('ledger.bluetooth_access_blocked'),
            subtitle: strings('ledger.bluetooth_access_blocked_error'),
          });
          break;
      }
    }

    if (bluetoothConnectionError) {
      setErrorDetails({
        title: strings('ledger.bluetooth_off'),
        subtitle: strings('ledger.bluetooth_off_message'),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledgerError, bluetoothConnectionError, bluetoothPermissionError]);

  const displayErrorView = !!errorDetails;
  const displayLookingForDevice = !isSendingLedgerCommands && !displayErrorView;
  const displayOpenYourLedger =
    isSendingLedgerCommands &&
    !displayErrorView &&
    isAppLaunchConfirmationNeeded;
  const displayConfirmation =
    isSendingLedgerCommands &&
    !displayErrorView &&
    !isAppLaunchConfirmationNeeded;

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.contentWrapper}>
        {displayLookingForDevice && <SearchingForDeviceStep />}
        {displayOpenYourLedger && <OpenETHAppStep onReject={onReject} />}
        {displayErrorView && (
          <ErrorStep
            onReject={onReject}
            onRetry={onRetry}
            title={errorDetails?.title}
            subTitle={errorDetails?.subtitle}
            showViewSettings={
              !!bluetoothConnectionError || !!bluetoothPermissionError
            }
          />
        )}
        {displayConfirmation && <ConfirmationStep onReject={onReject} />}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(LedgerConfirmationModal);
