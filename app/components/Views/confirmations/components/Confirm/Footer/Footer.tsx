import React from 'react';
import { View } from 'react-native';

import { strings } from '../../../../../../../locales/i18n';
import Button, {
  ButtonSize,
  ButtonVariants,
  ButtonWidthTypes,
} from '../../../../../../component-library/components/Buttons/Button';
import { useStyles } from '../../../../../../component-library/hooks';
import { useConfirmActions } from '../../../hooks/useConfirmActions';
import { useSecurityAlertResponse } from '../../../hooks/useSecurityAlertResponse';
import styleSheet from './Footer.styles';

const Footer = () => {
  const { onConfirm, onReject } = useConfirmActions();
  const { securityAlertResponse } = useSecurityAlertResponse();

  const { styles } = useStyles(styleSheet, {});

  // eslint-disable-next-line
  console.log(
    '====================================',
    securityAlertResponse,
    securityAlertResponse !== undefined,
  );
  return (
    <View style={styles.buttonsContainer}>
      <Button
        onPress={onReject}
        label={strings('confirm.reject')}
        style={styles.footerButton}
        size={ButtonSize.Lg}
        variant={ButtonVariants.Secondary}
        width={ButtonWidthTypes.Full}
      />
      <View style={styles.buttonDivider} />
      <Button
        onPress={onConfirm}
        label={strings('confirm.confirm')}
        style={styles.footerButton}
        size={ButtonSize.Lg}
        variant={ButtonVariants.Primary}
        width={ButtonWidthTypes.Full}
        isDanger={securityAlertResponse !== undefined}
      />
    </View>
  );
};

export default Footer;
