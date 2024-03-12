import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Text, {
  TextVariant,
  TextColor,
} from '../../../component-library/components/Texts/Text';
import PickerNetwork from '../../../component-library/components/Pickers/PickerNetwork';
import { strings } from '../../../../locales/i18n';
import { useSelector } from 'react-redux';
import { ProviderConfig } from '@metamask/network-controller';
import { selectProviderConfig } from '../../../selectors/networkController';
import {
  getNetworkImageSource,
  getNetworkNameFromProviderConfig,
} from '../../../util/networks';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../constants/navigation/Routes';
import getDecimalChainId from '../../../util/networks/getDecimalChainId';
import { useMetrics } from '../../../components/hooks/useMetrics';
import { MetaMetricsEvents } from '../../../core/Analytics';

const styles = StyleSheet.create({
  setting: {
    marginTop: 32,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 10,
    lineHeight: 22,
    fontWeight: '400',
  },
  networkPicker: {
    marginVertical: 16,
    alignSelf: 'flex-start',
  },
});

export default function ManageNetworksComponent() {
  const providerConfig: ProviderConfig = useSelector(selectProviderConfig);
  const navigation = useNavigation();
  const { trackEvent } = useMetrics();

  const networkImageSource = () => {
    const { type, chainId } = providerConfig;
    return getNetworkImageSource({ networkType: type, chainId });
  };

  const networkName = getNetworkNameFromProviderConfig(providerConfig);

  const switchNetwork = useCallback(() => {
    navigation.navigate(Routes.MODAL.ROOT_MODAL_FLOW, {
      screen: Routes.SHEET.NETWORK_SELECTOR,
    });

    trackEvent(MetaMetricsEvents.NETWORK_SELECTOR_PRESSED, {
      chain_id: getDecimalChainId(providerConfig.chainId),
    });
  }, [navigation, trackEvent, providerConfig]);

  return (
    <View style={styles.setting}>
      <View style={styles.heading}>
        <Text variant={TextVariant.HeadingSM}>
          {strings('default_settings.manage_networks')}
        </Text>
      </View>
      <Text
        variant={TextVariant.BodyMD}
        color={TextColor.Alternative}
        style={styles.description}
      >
        {strings('default_settings.manage_networks_body')}
      </Text>
      <PickerNetwork
        label={networkName}
        imageSource={networkImageSource()}
        onPress={switchNetwork}
        style={styles.networkPicker}
        // testID={ConnectedAccountsSelectorsIDs.NETWORK_PICKER}
      />
    </View>
  );
}
