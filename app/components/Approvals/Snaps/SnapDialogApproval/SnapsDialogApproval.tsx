///: BEGIN:ONLY_INCLUDE_IF(preinstalled-snaps)
import React, { useState } from 'react';
import { useStyles } from '../../../hooks/useStyles';
import { strings } from '../../../../../locales/i18n';
import stylesheet from './SnapDialogApproval.styles';
import useApprovalRequest from '../../../Views/confirmations/hooks/useApprovalRequest';
import { View } from 'react-native-animatable';
import ApprovalModal from '../../ApprovalModal';
import BottomSheetFooter, {
  ButtonsAlignment,
} from '../../../../component-library/components/BottomSheets/BottomSheetFooter';
import {
  ButtonVariants,
  ButtonSize,
} from '../../../../component-library/components/Buttons/Button';
import Engine from '../../../../core/Engine';
import { SnapUIRenderer } from '../SnapUIRenderer/SnapUIRenderer';
import { SnapId } from '@metamask/snaps-sdk';
import { IconName } from '../../../../component-library/components/Icons/Icon';

enum SnapDialogTypes {
  ALERT = 'snap_dialog:alert',
  CONFIRM = 'snap_dialog:confirmation',
  PROMPT = 'snap_dialog:prompt',
  CUSTOM = 'snap_dialog',
}

enum TemplateConfirmation {
  Ok = 'template_confirmation.ok',
  CANCEL = 'template_confirmation.cancel',
}

const SnapDialogApproval = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { approvalRequest } = useApprovalRequest();
  const { styles } = useStyles(stylesheet, {});

  const onCancel = async () => {
    if (!approvalRequest) return;

    await Engine.acceptPendingApproval(approvalRequest.id, null as any);
  };

  const onConfirmInput = async () => {
    setIsLoading(true);
    if (!approvalRequest) return;

    const inputState =
      await Engine.context.SnapInterfaceController.getInterface(
        approvalRequest?.origin as SnapId,
        approvalRequest.requestData.id,
      );
    await Engine.acceptPendingApproval(
      approvalRequest.id,
      inputState.state['custom-input'] as any,
    );
    setIsLoading(false);
  };

  const onConfirm = async () => {
    setIsLoading(true);
    if (!approvalRequest) return;

    await Engine.acceptPendingApproval(approvalRequest.id, true as any);

    setIsLoading(false);
  };

  const onReject = async () => {
    if (!approvalRequest) return;

    await Engine.acceptPendingApproval(approvalRequest.id, false as any);
  };

  if (
    approvalRequest?.type !== SnapDialogTypes.ALERT &&
    approvalRequest?.type !== SnapDialogTypes.CONFIRM &&
    approvalRequest?.type !== SnapDialogTypes.PROMPT &&
    approvalRequest?.type !== SnapDialogTypes.CUSTOM
  )
    return null;

  const getDialogButtons = (type: SnapDialogTypes | undefined) => {
    switch (type) {
      case SnapDialogTypes.ALERT:
        return [
          {
            variant: ButtonVariants.Primary,
            label: strings(TemplateConfirmation.Ok),
            size: ButtonSize.Lg,
            onPress: onCancel,
          },
        ];

      case SnapDialogTypes.CONFIRM:
      case SnapDialogTypes.PROMPT:
        return [
          {
            variant: ButtonVariants.Secondary,
            label: strings(TemplateConfirmation.CANCEL),
            size: ButtonSize.Lg,
            onPress: onReject,
          },
          {
            variant: ButtonVariants.Primary,
            label: strings(TemplateConfirmation.Ok),
            size: ButtonSize.Lg,
            onPress: onConfirm,
          },
        ];
      case SnapDialogTypes.CUSTOM:
        return [
          {
            variant: ButtonVariants.Secondary,
            label: strings(TemplateConfirmation.CANCEL),
            size: ButtonSize.Lg,
            onPress: onCancel,
            startIconName: IconName.Close,
          },
          {
            variant: ButtonVariants.Primary,
            label: strings(TemplateConfirmation.Ok),
            size: ButtonSize.Lg,
            onPress: onConfirmInput,
            endIconName: IconName.Check,
          },
        ];

      default:
        return [];
    }
  };

  const buttons = getDialogButtons(approvalRequest?.type);
  const snapId = approvalRequest?.origin;
  const interfaceId = approvalRequest?.requestData?.id;

  return (
    <ApprovalModal
      isVisible={
        approvalRequest?.type === SnapDialogTypes.ALERT ||
        approvalRequest?.type === SnapDialogTypes.CONFIRM ||
        approvalRequest?.type === SnapDialogTypes.PROMPT ||
        approvalRequest?.type === SnapDialogTypes.CUSTOM
      }
      onCancel={onCancel}
    >
      <View style={styles.root}>
        <SnapUIRenderer
          snapId={snapId}
          interfaceId={interfaceId}
          isLoading={isLoading}
        />
        <View style={styles.actionContainer}>
          <BottomSheetFooter
            buttonsAlignment={ButtonsAlignment.Horizontal}
            buttonPropsArray={buttons}
          />
        </View>
      </View>
    </ApprovalModal>
  );
};

export default SnapDialogApproval;
///: END:ONLY_INCLUDE_IF
