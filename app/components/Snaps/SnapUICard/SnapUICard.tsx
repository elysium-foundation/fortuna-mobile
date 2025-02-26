import React, { FunctionComponent, ReactNode } from 'react';
import { Box } from '../../UI/Box/Box';
import Text, {
  TextColor,
  TextVariant,
} from '../../../component-library/components/Texts/Text';
import { SnapUIImage } from '../../UI/Snaps/SnapUIImage/SnapUIImage';
import {
  FlexDirection,
  TextAlign,
  JustifyContent,
  AlignItems,
} from '../../UI/Box/box.types';

interface SnapUICardProps {
  image?: string | undefined;
  title: string | ReactNode;
  description?: string | undefined;
  value: string;
  extra?: string | undefined;
}

export const SnapUICard: FunctionComponent<SnapUICardProps> = ({
  image,
  title,
  description,
  value,
  extra,
}) => (
  <Box
    testID="snaps-ui-card"
    flexDirection={FlexDirection.Row}
    justifyContent={JustifyContent.spaceBetween}
    alignItems={AlignItems.center}
  >
    <Box
      gap={16}
      flexDirection={FlexDirection.Row}
      alignItems={AlignItems.center}
    >
      {image && (
        <SnapUIImage width={32} height={32} borderRadius={999} value={image} />
      )}
      <Box flexDirection={FlexDirection.Column}>
        <Text variant={TextVariant.BodyMDMedium} ellipsizeMode="tail">
          {title}
        </Text>
        {description && (
          <Text color={TextColor.Alternative} ellipsizeMode="tail">
            {description}
          </Text>
        )}
      </Box>
    </Box>
    <Box flexDirection={FlexDirection.Column} textAlign={TextAlign.right}>
      <Text variant={TextVariant.BodyMDMedium} ellipsizeMode="tail">
        {value}
      </Text>
      {extra && (
        <Text color={TextColor.Alternative} ellipsizeMode="tail">
          {extra}
        </Text>
      )}
    </Box>
  </Box>
);
