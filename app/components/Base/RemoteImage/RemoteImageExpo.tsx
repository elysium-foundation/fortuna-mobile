import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import useIpfsGateway from '../../hooks/useIpfsGateway';
import { getFormattedIpfsUrl } from '@metamask/assets-controllers';
import { useSelector } from 'react-redux';
import {
  selectChainId,
  selectTicker,
} from '../../../selectors/networkController';
import { selectNetworkName } from '../../../selectors/networkInfos';
import {
  getTestNetImageByChainId,
  isLineaMainnet,
  isMainNet,
  isTestNet,
} from '../../../util/networks';
import images from 'images/image-icons';
import FadeIn from 'react-native-fade-in-image';
import { Theme } from '@metamask/design-tokens';
import { useStyles } from '../../../component-library/hooks';
import BadgeWrapper from '../../../component-library/components/Badges/BadgeWrapper';
import { BadgeAnchorElementShape } from '../../../component-library/components/Badges/BadgeWrapper/BadgeWrapper.types';
import Badge, {
  BadgeVariant,
} from '../../../component-library/components/Badges/Badge';
import { AvatarSize } from '../../../component-library/components/Avatars/Avatar';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Image as ExpoImage, ImageErrorEventData } from 'expo-image';
import Identicon from '../../UI/Identicon';
import ComponentErrorBoundary from '../../UI/ComponentErrorBoundary';

interface Props {
  // Testing Props
  testID?: string;

  // Image Props
  source: { uri: string } | ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  placeholderSyle?: string;
  errorCallback?: (error: unknown) => void;

  /**
   * Token/Fallback address (Identicon Fallback)
   */
  address?: string;

  /**
   * Enable Fade In Container
   */
  fadeIn?: boolean;

  /**
   * Enable Network Badge
   */
  showNetworkBadge?: boolean;
}

const isImageSourcePropType = (
  source: Props['source'],
): source is ImageSourcePropType => {
  if (typeof source === 'number') {
    return true;
  }
  if (typeof source === 'object' && source !== null) {
    if (Array.isArray(source)) {
      return source.every(
        (item) =>
          typeof item === 'number' ||
          (typeof item === 'object' && 'uri' in item),
      );
    }
    return 'uri' in source;
  }
  return false;
};

const RemoteImageExpoStyles = (params: { theme: Theme }) =>
  StyleSheet.create({
    svgContainer: {
      overflow: 'hidden',
    },
    badgeWrapper: {
      flex: 1,
    },
    imageStyle: {
      width: '100%',
      height: '100%',
      aspectRatio: 1,
    },
    imageContainerStyle: {
      borderRadius: 8,
      overflow: 'hidden',
    },
    defaultPlaceholderStyle: {
      backgroundColor: params.theme.colors.background.alternative,
    },
  });

const DEFAULT_BADGE_POSITION = {
  top: -4,
  right: -4,
};

function useIPFSUrl(uri?: string) {
  const ipfsGateway = useIpfsGateway();
  const [resolvedIpfsUrl, setResolvedIpfsUrl] = useState<string | null>(null);

  useEffect(() => {
    resolveIpfsUrl();
    async function resolveIpfsUrl() {
      if (!uri) {
        return;
      }
      try {
        const url = new URL(uri);
        if (url.protocol !== 'ipfs:') setResolvedIpfsUrl(null);
        const ipfsUrl = await getFormattedIpfsUrl(ipfsGateway, uri, false);
        setResolvedIpfsUrl(ipfsUrl);
      } catch (err) {
        setResolvedIpfsUrl(null);
      }
    }
  }, [uri, ipfsGateway]);

  return resolvedIpfsUrl;
}

function useNetworkBadgeProps() {
  const chainId = useSelector(selectChainId);
  const ticker = useSelector(selectTicker);
  const networkName = useSelector(selectNetworkName);

  const networkBadgeSource = useMemo(() => {
    if (isTestNet(chainId)) return getTestNetImageByChainId(chainId);

    if (isMainNet(chainId)) return images.ETHEREUM;

    if (isLineaMainnet(chainId)) return images['LINEA-MAINNET'];

    return ticker ? images[ticker] : undefined;
  }, [chainId, ticker]);

  return {
    badgeSource: networkBadgeSource,
    networkName,
  };
}

function useCaptureErrorAndFallback(props: {
  errorCallback?: (error: unknown) => void;
  address?: string;
  style: unknown;
}) {
  const [error, setError] = useState<string | undefined>(undefined);
  const onError = useCallback(
    (errorData?: ImageErrorEventData) => {
      setError(errorData?.error);
      props.errorCallback?.(errorData?.error);
    },
    [props],
  );

  const ErrorFallback = useCallback(
    () => (
      <Identicon
        address={props.address}
        customStyle={props.style as ImageStyle}
      />
    ),
    [props.address, props.style],
  );

  return {
    error,
    onError,
    ErrorFallback,
  };
}

export default function RemoteImageExpo(props: Props) {
  const {
    testID,
    placeholderSyle,
    fadeIn,
    showNetworkBadge,
    style,
    source,
    errorCallback,
  } = props;

  const { styles } = useStyles(RemoteImageExpoStyles, {});
  const networkBadgeProps = useNetworkBadgeProps();
  const errorProps = useCaptureErrorAndFallback({
    errorCallback,
    address: props.address,
    style,
  });

  const FadeInContainer = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (fadeIn) {
        return (
          <FadeIn
            placeholderStyle={placeholderSyle ?? styles.defaultPlaceholderStyle}
          >
            {children}
          </FadeIn>
        );
      }

      return <>{children}</>;
    },
    [fadeIn, placeholderSyle, styles.defaultPlaceholderStyle],
  );

  const BadgeContainer = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (showNetworkBadge) {
        return (
          <BadgeWrapper
            badgePosition={DEFAULT_BADGE_POSITION}
            anchorElementShape={BadgeAnchorElementShape.Rectangular}
            badgeElement={
              <Badge
                variant={BadgeVariant.Network}
                imageSource={networkBadgeProps.badgeSource}
                name={networkBadgeProps.networkName}
                isScaled={false}
                size={AvatarSize.Md}
              />
            }
          >
            {children}
          </BadgeWrapper>
        );
      }

      return <>{children}</>;
    },
    [
      showNetworkBadge,
      networkBadgeProps.badgeSource,
      networkBadgeProps.networkName,
    ],
  );

  const uri = !isImageSourcePropType(source) ? source.uri : null;
  const ipfsUri = useIPFSUrl(uri ?? undefined);
  const finalUri = ipfsUri || uri || '';

  if (errorProps.error) {
    return <errorProps.ErrorFallback />;
  }

  return (
    <ComponentErrorBoundary componentLabel="RemoteImageExpo">
      <FadeInContainer>
        <BadgeContainer>
          <View style={[styles.imageContainerStyle, style]} testID={testID}>
            <ExpoImage
              source={
                isImageSourcePropType(source) ? source : { uri: finalUri }
              }
              contentFit="contain"
              style={styles.imageStyle}
              onError={errorProps.onError}
            />
          </View>
        </BadgeContainer>
      </FadeInContainer>
    </ComponentErrorBoundary>
  );
}
