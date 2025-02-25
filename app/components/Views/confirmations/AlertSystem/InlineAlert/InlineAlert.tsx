import React from 'react';
import Icon, { IconName, IconSize } from '../../../../../component-library/components/Icons/Icon';
import Text, { TextColor, TextVariant } from '../../../../../component-library/components/Texts/Text';
import { IconSizes } from '../../../../../component-library/components-temp/KeyValueRow';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../../util/theme';
import { Severity } from '../../types/alerts';
import styleSheet from './InlineAlert.styles';
import { useStyles } from '../../../../../component-library/hooks';
import { strings } from '../../../../../../locales/i18n';
import { ThemeColors } from '@metamask/design-tokens';

export interface InlineAlertProps {
  /** The onClick handler for the inline alerts */
  onClick?: () => void;
  /** The severity of the alert, e.g. Severity.Warning */
  severity?: Severity;
  /** Additional styles to apply to the inline alert */
  style?: ViewStyle;
}

const getBackgroundColor = (severity: Severity, colors: ThemeColors) => {
  switch (severity) {
    case Severity.Danger:
      return colors.error.muted;
    case Severity.Warning:
      return colors.warning.muted;
    case Severity.Info:
      return colors.info.muted;
    default:
      return colors.info.default;
  }
};

const getTextColor = (severity: Severity) => {
  switch (severity) {
    case Severity.Danger:
      return TextColor.Error;
    case Severity.Warning:
      return TextColor.Warning;
    case Severity.Info:
      return TextColor.Info;
    default:
      return TextColor.Default;
  }
};

export default function InlineAlert({
  onClick,
  severity = Severity.Info,
  style,
}: InlineAlertProps) {
  const { colors } = useTheme();
  const { styles } = useStyles(styleSheet, {});

  return (
    <View style={[styles.wrapper, { backgroundColor: getBackgroundColor(severity, colors) }, style]}>
      <TouchableOpacity
        testID="inline-alert"
        onPress={onClick}
        style={styles.inlineContainer}
      >
        <Icon
          name={severity === Severity.Info ? IconName.Info : IconName.Danger}
          size={IconSize.Sm}
          color={getTextColor(severity)}
          style={styles.icon}
          testID="inline-alert-icon"
        />
        <Text variant={TextVariant.BodySM} color={getTextColor(severity)}>
          {strings('alert_system.inline_alert_label')}
        </Text>
        <Icon name={IconName.ArrowRight} size={IconSizes.Xs} color={getTextColor(severity)}/>
      </TouchableOpacity>
    </View>
  );
}
