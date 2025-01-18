import React, { useCallback, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import CollectibleMedia from '../CollectibleMedia';
import Text from '../../../component-library/components/Texts/Text';
import { Nft } from '@metamask/assets-controllers';
import { debounce } from 'lodash';
import styleSheet from './NftGrid.styles';
import { useStyles } from '../../hooks/useStyles';
import { StackNavigationProp } from '@react-navigation/stack';

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

function NftGridItem({
  nft,
  navigation,
}: {
  nft: Nft;
  navigation: StackNavigationProp<NftGridNavigationParamList, 'AddAsset'>;
}) {
  const actionSheetRef = useRef<ActionSheetType>(null);
  const longPressedCollectible = useRef<LongPressedCollectibleType | null>(
    null,
  );
  const { styles } = useStyles(styleSheet, {});

  const onLongPressCollectible = useCallback((collectible) => {
    actionSheetRef?.current?.show();
    longPressedCollectible.current = collectible;
  }, []);

  const onItemPress = useCallback(
    (nftItem) => {
      debouncedNavigation(navigation, nftItem);
    },
    [navigation],
  );

  if (!nft) return null;

  return (
    <TouchableOpacity
      key={nft.address}
      style={styles.collectibleCard}
      onPress={() => onItemPress(nft)}
      onLongPress={() => onLongPressCollectible(nft)}
      testID={nft.name as string}
    >
      <CollectibleMedia
        style={styles.collectibleIcon}
        collectible={nft}
        isTokenImage
      />
      <Text numberOfLines={1} ellipsizeMode="tail">
        {nft.name}
      </Text>
      <Text numberOfLines={1} ellipsizeMode="tail">
        {nft.collection?.name}
      </Text>
    </TouchableOpacity>
  );
}

export default NftGridItem;
