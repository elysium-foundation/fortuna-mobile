import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import CollectibleMedia from '../CollectibleMedia';
import ActionSheet from '@metamask/react-native-actionsheet';
import { strings } from '../../../../locales/i18n';
import Engine from '../../../core/Engine';
import { removeFavoriteCollectible } from '../../../actions/collectibles';
import {
  collectiblesSelector,
  isNftFetchingProgressSelector,
} from '../../../reducers/collectibles';
import { useTheme } from '../../../util/theme';
import Text, {
  TextColor,
  TextVariant,
} from '../../../component-library/components/Texts/Text';
import {
  MetaMetricsEvents,
  useMetrics,
} from '../../../components/hooks/useMetrics';
import { getDecimalChainId } from '../../../util/networks';
import { Nft } from '@metamask/assets-controllers';
import { debounce } from 'lodash';
import styleSheet from './NftGrid.styles';
import { useStyles } from '../../hooks/useStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { WalletViewSelectorsIDs } from '../../../../e2e/selectors/wallet/WalletView.selectors';
import CollectibleDetectionModal from '../CollectibleDetectionModal';
import { selectUseNftDetection } from '../../../selectors/preferencesController';
import ButtonLink from '../../../component-library/components/Buttons/Button/variants/ButtonLink';
import AppConstants from '../../../core/AppConstants';
import {
  RefreshTestId,
  SpinnerTestId,
} from '../CollectibleContracts/constants';
import NftGridItem from './NftGridItem';

const noNftPlaceholderSrc = require('../../../images/no-nfts-placeholder.png');

const debouncedNavigation = debounce((navigation, collectible) => {
  navigation.navigate('NftDetails', { collectible });
}, 200);

interface ActionSheetType {
  show: () => void;
}

interface LongPressedCollectibleType {
  address: string;
  tokenId: string;
}

interface NftGridNavigationParamList {
  AddAsset: { assetType: string };
  [key: string]: undefined | object;
}

interface NftGridProps {
  navigation: StackNavigationProp<NftGridNavigationParamList, 'AddAsset'>;
  chainId: string;
  selectedAddress: string;
}

function NftGrid({ navigation, chainId, selectedAddress }: NftGridProps) {
  const collectibles = useSelector(collectiblesSelector);
  const isNftFetchingProgress = useSelector(isNftFetchingProgressSelector);
  const isNftDetectionEnabled = useSelector(selectUseNftDetection);
  const actionSheetRef = useRef<ActionSheetType>(null);
  const longPressedCollectible = useRef<LongPressedCollectibleType | null>(
    null,
  );
  const { themeAppearance, colors } = useTheme();
  const { styles } = useStyles(styleSheet, {});
  const { trackEvent, createEventBuilder } = useMetrics();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    requestAnimationFrame(async () => {
      setRefreshing(true);
      const { NftDetectionController, NftController } = Engine.context;
      const actions = [
        NftDetectionController.detectNfts(),
        NftController.checkAndUpdateAllNftsOwnershipStatus(),
      ];
      await Promise.allSettled(actions);
      setRefreshing(false);
    });
  }, [setRefreshing]);

  const onLongPressCollectible = useCallback((collectible) => {
    actionSheetRef?.current?.show();
    longPressedCollectible.current = collectible;
  }, []);

  const removeNft = () => {
    const { NftController } = Engine.context;

    if (
      !longPressedCollectible?.current?.address &&
      !longPressedCollectible?.current?.tokenId
    ) {
      return null;
    }

    removeFavoriteCollectible(
      selectedAddress,
      chainId,
      longPressedCollectible.current,
    );
    NftController.removeAndIgnoreNft(
      longPressedCollectible.current.address,
      longPressedCollectible.current.tokenId,
    );

    trackEvent(
      createEventBuilder(MetaMetricsEvents.COLLECTIBLE_REMOVED)
        .addProperties({
          chain_id: getDecimalChainId(chainId),
        })
        .build(),
    );
    Alert.alert(
      strings('wallet.collectible_removed_title'),
      strings('wallet.collectible_removed_desc'),
    );
  };

  const refreshMetadata = () => {
    const { NftController } = Engine.context;

    if (
      !longPressedCollectible?.current?.address &&
      !longPressedCollectible?.current?.tokenId
    ) {
      return null;
    }

    NftController.addNft(
      longPressedCollectible.current.address,
      longPressedCollectible.current.tokenId,
    );
  };

  const handleMenuAction = (index: number) => {
    if (index === 1) {
      removeNft();
    } else if (index === 0) {
      refreshMetadata();
    }
  };

  const onItemPress = useCallback(
    (collectible) => {
      debouncedNavigation(navigation, collectible);
    },
    [navigation],
  );

  const renderCollectible = (collectible: Nft, index: number) => {
    if (!collectible) return null;
    return (
      <TouchableOpacity
        key={collectible.address}
        style={styles.collectibleCard}
        onPress={() => onItemPress(collectible)}
        onLongPress={() => onLongPressCollectible(collectible)}
        testID={collectible.name as string}
      >
        <CollectibleMedia
          style={styles.collectibleIcon}
          collectible={collectible}
          isTokenImage
        />
        <Text numberOfLines={1} ellipsizeMode="tail">
          {collectible.name}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {collectible.collection?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const NftGridFooter = () => (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Text variant={TextVariant.BodyMDMedium} color={TextColor.Alternative}>
        {strings('wallet.no_collectibles')}
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.push('AddAsset', { assetType: 'collectible' })
        }
        disabled={false}
        testID={WalletViewSelectorsIDs.IMPORT_NFT_BUTTON}
      >
        <Text variant={TextVariant.BodyMDMedium} color={TextColor.Info}>
          {strings('wallet.add_collectibles')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const NftGridEmpty = () => (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Image
        style={{
          height: 90,
          width: 90,
          tintColor: 'lightgray',
          marginTop: 30,
          marginBottom: 12,
        }}
        source={noNftPlaceholderSrc}
        resizeMode="contain"
      />
      <Text
        style={styles.headingMd}
        variant={TextVariant.HeadingMD}
        color={TextColor.Alternative}
      >
        {strings('wallet.no_nfts_yet')}
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Webview', {
            screen: 'SimpleWebview',
            params: { url: AppConstants.URLS.NFT },
          })
        }
        testID={WalletViewSelectorsIDs.IMPORT_NFT_BUTTON}
      >
        <Text
          variant={TextVariant.BodyMDMedium}
          color={TextColor.Info}
          onPress={() => console.log('goToLearnMore')}
        >
          {strings('wallet.learn_more')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View testID="collectible-contracts">
      {!isNftDetectionEnabled && <CollectibleDetectionModal />}
      {/* fetching state */}
      {isNftFetchingProgress && (
        <ActivityIndicator
          size="large"
          style={styles.spinner}
          testID={SpinnerTestId}
        />
      )}
      {/* empty state */}
      {!isNftFetchingProgress && collectibles.length === 0 && (
        <>
          <NftGridEmpty />
          <NftGridFooter />
        </>
      )}
      {/* nft grid */}
      {!isNftFetchingProgress && collectibles.length > 0 && (
        <FlatList
          numColumns={3}
          data={collectibles}
          renderItem={({ item, index }: { item: Nft; index: number }) => (
            <NftGridItem nft={item} navigation={navigation} />
          )}
          keyExtractor={(_, index) => index.toString()}
          testID={RefreshTestId}
          refreshControl={
            <RefreshControl
              colors={[colors.primary.default]}
              tintColor={colors.icon.default}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListFooterComponent={<NftGridFooter />}
        />
      )}
      <ActionSheet
        ref={actionSheetRef}
        title={strings('wallet.collectible_action_title')}
        options={[
          strings('wallet.refresh_metadata'),
          strings('wallet.remove'),
          strings('wallet.cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={handleMenuAction}
        theme={themeAppearance}
      />
    </View>
  );
}

export default NftGrid;
