import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { IconSize } from '../../../../component-library/components/Icons/Icon';
import { AvatarFaviconProps } from '../../../../component-library/components/Avatars/Avatar/variants/AvatarFavicon/AvatarFavicon.types';
import {
  BackgroundColor,
  getAvatarFallbackLetter,
} from '../SnapUIRenderer/utils';
import AvatarBase from '../../../../component-library/components/Avatars/Avatar/foundation/AvatarBase';
import AvatarFavicon from '../../../../component-library/components/Avatars/Avatar/variants/AvatarFavicon';
import { AvatarSize } from '../../../../component-library/components/Avatars/Avatar/Avatar.types';
import Text from '../../../../component-library/components/Texts/Text';
import { selectSnapsMetadata } from '../../../../selectors/snaps/snapController';

type SnapIconProps = {
  snapId: string;
  avatarSize?: IconSize;
  borderWidth?: number;
  className?: string;
  badgeBackgroundColor?: BackgroundColor;
} & AvatarFaviconProps;

export const SnapIcon: FunctionComponent<SnapIconProps> = ({
  snapId,
  avatarSize = IconSize.Lg,
  ...props
}) => {
  const snapsMetadata = useSelector(selectSnapsMetadata);

  const snapSubjectMetadata = snapsMetadata[snapId];
  const iconUrl = snapSubjectMetadata.iconUrl;
  const snapName = snapSubjectMetadata.name;

  // // We choose the first non-symbol char as the fallback icon.
  const fallbackIcon = getAvatarFallbackLetter(snapName);

  return iconUrl ? (
    <AvatarFavicon
      {...props}
      style={{
        backgroundColor: 'var(--color-background-alternative-hover)',
      }}
      imageSource={{ uri: iconUrl }}
      name={snapName}
      size={avatarSize as unknown as AvatarSize}
    />
  ) : (
    <AvatarBase
      style={{
        borderRadius: 50,
        borderWidth: 0,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
      }}
      {...props}
      size={avatarSize as unknown as AvatarSize}
    >
      <Text>{fallbackIcon}</Text>
    </AvatarBase>
  );
};
