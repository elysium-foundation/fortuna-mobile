import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import LedgerConfirmationModal from './LedgerConfirmationModal';
import { createStyles } from './styles';
import {
  createNavigationDetails,
  useParams,
} from '../../../util/navigation/navUtils';
import Routes from '../../../constants/navigation/Routes';
import { useAppThemeFromContext, mockTheme } from '../../../util/theme';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSignModal } from '../../../actions/modals';
import { RootState } from '../../../reducers';

import { RPCStageTypes, iEventGroup } from '../../../reducers/rpcEvents';
import { resetEventStage } from '../../../actions/rpcEvents';

export interface LedgerMessageSignModalParams {
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageParams: any;
  onConfirmationComplete: (
    confirmed: boolean,
    // TODO: Replace "any" with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawSignature?: any,
  ) => Promise<void>;
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deviceId: any;
}

export const createLedgerMessageSignModalNavDetails =
  createNavigationDetails<LedgerMessageSignModalParams>(
    Routes.LEDGER_MESSAGE_SIGN_MODAL,
  );

const LedgerMessageSignModal = () => {
  const dispatch = useDispatch();
  const [isVisible, setVisibility] = useState(true);
  const { colors } = useAppThemeFromContext() || mockTheme;
  const styles = createStyles(colors);
  const { signingEvent }: iEventGroup = useSelector(
    (state: RootState) => state.rpcEvents,
  );

  const { onConfirmationComplete, deviceId } =
    useParams<LedgerMessageSignModalParams>();

  const dismissModal = useCallback(() => {
    setVisibility(false);
    dispatch(resetEventStage(signingEvent.rpcName));
  }, [dispatch, signingEvent.rpcName]);

  useEffect(() => {
    dispatch(toggleSignModal(false));
    return () => {
      dispatch(toggleSignModal(true));
    };
  }, [dispatch]);

  useEffect(() => {
    //Close the modal when the signMessageStage is complete or error, error will return the error message to the user
    if (
      signingEvent.eventStage === RPCStageTypes.COMPLETE ||
      signingEvent.eventStage === RPCStageTypes.ERROR
    ) {
      dismissModal();
    }
  }, [signingEvent.eventStage, dismissModal]);

  const executeOnLedger = useCallback(async () => {
    onConfirmationComplete(true);
  }, [onConfirmationComplete]);

  const onRejection = useCallback(() => {
    onConfirmationComplete(false);
    dismissModal();
  }, [dismissModal, onConfirmationComplete]);

  return (
    <Modal isVisible={isVisible} style={styles.modal}>
      <View style={styles.contentWrapper}>
        <LedgerConfirmationModal
          onConfirmation={executeOnLedger}
          onRejection={onRejection}
          deviceId={deviceId}
        />
      </View>
    </Modal>
  );
};

export default React.memo(LedgerMessageSignModal);
