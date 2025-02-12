import { StyleSheet } from 'react-native';

import { Theme } from '../../../../../../../util/theme/models';
import { fontStyles } from '../../../../../../../styles/common';

const styleSheet = (params: { theme: Theme }) => {
  const { theme } = params;

  return StyleSheet.create({
    collpasedInfoRow: {
      marginStart: -8,
      paddingBottom: 4,
    },
    dataRow: {
      paddingHorizontal: 0,
      paddingBottom: 16,
    },
    title: {
      color: theme.colors.text.default,
      ...fontStyles.normal,
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 16,
    },
  });
};

export default styleSheet;
