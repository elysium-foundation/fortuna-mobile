import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useStyles } from '../../../../../../component-library/hooks';
import Tooltip from '../Tooltip';
import styleSheet from './InfoRow.styles';

export interface InfoRowProps {
  label: string;
  children: ReactNode | string;
  tooltip?: string;
  style?: Record<string, unknown>;
  labelChildren?: React.ReactNode;
}

const InfoRow = ({ label, children, tooltip, style, labelChildren = null }: InfoRowProps) => {
  const { styles } = useStyles(styleSheet, {});

  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {labelChildren}
        {!labelChildren && tooltip && <Tooltip content={tooltip} />}
      </View>
      {typeof children === 'string' ? (
        <Text style={styles.value}>{children}</Text>
      ) : (
        <View style={styles.valueComponent}>{children}</View>
      )}
    </View>
  );
};

export default InfoRow;
