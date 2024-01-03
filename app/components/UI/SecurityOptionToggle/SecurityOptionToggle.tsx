import React, { useCallback } from 'react';
import { Platform, Switch, View } from 'react-native';
import { mockTheme, useAppThemeFromContext } from '../../../util/theme';
import { createStyles } from './styles';
import { colors as importedColors } from '../../../styles/common';
import generateTestId from '../../../../wdio/utils/generateTestId';
import Text, {
  TextColor,
  TextVariant,
} from '../../../component-library/components/Texts/Text';

interface SecurityOptionsToggleProps {
  title: string;
  description?: string;
  value: boolean;
  onOptionUpdated: (enabled: boolean) => void;
  testId?: string;
  disabled?: boolean;
}

/**
 * View that renders the toggle for security options
 * This component assumes that the parent will manage the state of the toggle. This is because most of the state is global.
 */
const SecurityOptionToggle = ({
  title,
  description,
  value,
  testId,
  onOptionUpdated,
  disabled,
}: SecurityOptionsToggleProps) => {
  const { colors } = useAppThemeFromContext() || mockTheme;
  const styles = createStyles();

  const handleOnValueChange = useCallback(
    (newValue: boolean) => {
      onOptionUpdated(newValue);
    },
    [onOptionUpdated],
  );
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text variant={TextVariant.BodyLGMedium} style={styles.title}>
          {title}
        </Text>
        <View style={styles.switchElement}>
          <Switch
            value={value}
            onValueChange={(newValue: boolean) => handleOnValueChange(newValue)}
            trackColor={{
              true: colors.primary.default,
              false: colors.border.muted,
            }}
            thumbColor={importedColors.white}
            style={styles.switch}
            ios_backgroundColor={colors.border.muted}
            disabled={disabled}
            {...generateTestId(Platform, testId)}
          />
        </View>
      </View>
      {description ? (
        <Text
          variant={TextVariant.BodyMD}
          color={TextColor.Alternative}
          style={styles.desc}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
};

export default React.memo(SecurityOptionToggle);
