import { useCallback, useEffect, useState } from 'react';
import etherscanLink from '@metamask/etherscan-link';
import { RPC } from '../../../../constants/network';
import {
  findBlockExplorerForRpc,
  getBlockExplorerName,
} from '../../../../util/networks';
import { strings } from '../../../../../locales/i18n';
import { getEtherscanBaseUrl } from '../../../../util/etherscan';
import { useSelector } from 'react-redux';
import {
  selectNonEvmBlockExplorerUrl,
  selectNonEvmSelected,
} from '../../../../selectors/multichainNetworkController';
import {
  selectChainId,
  selectProviderConfig,
} from '../../../../selectors/networkController';
import { selectNetworkName } from '../../../../selectors/networkInfos';

function useBlockExplorer(networkConfigurations, providerConfigTokenExplorer) {
  const [explorer, setExplorer] = useState({
    name: '',
    value: null,
    isValid: false,
    isRPC: false,
    baseUrl: '',
  });
  const providerConfig = useSelector(selectProviderConfig);
  const chainId = useSelector(selectChainId);
  const isNonEvmSelected = useSelector(selectNonEvmSelected);
  const networkName = useSelector(selectNetworkName);
  const nonEvmBlockExplorerUrl = useSelector(selectNonEvmBlockExplorerUrl);

  useEffect(() => {
    const definitiveProviderConfig =
      providerConfigTokenExplorer ?? providerConfig;
    if (definitiveProviderConfig.type === RPC && !isNonEvmSelected) {
      try {
        const blockExplorer = findBlockExplorerForRpc(
          definitiveProviderConfig.rpcUrl,
          networkConfigurations,
        );
        if (!blockExplorer) {
          throw new Error('No block explorer url');
        }
        const url = new URL(blockExplorer);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Block explorer URL is not a valid http(s) protocol');
        }

        const name =
          getBlockExplorerName(blockExplorer) ||
          strings('swaps.block_explorer');
        setExplorer({
          name,
          value: blockExplorer,
          isValid: true,
          isRPC: true,
          baseUrl: url.href,
        });
      } catch {
        setExplorer({
          name: '',
          value: null,
          isValid: false,
          isRPC: false,
          baseUrl: '',
        });
      }
    } else if (isNonEvmSelected) {
      // TODO: [SOLANA] Revisit this before shipping, swaps team block explorer
      setExplorer({
        name: networkName,
        value: chainId,
        isValid: true,
        isRPC: false,
        baseUrl: nonEvmBlockExplorerUrl,
      });
    } else {
      setExplorer({
        name: 'Etherscan',
        value: chainId,
        isValid: true,
        isRPC: false,
        baseUrl: getEtherscanBaseUrl(definitiveProviderConfig.type),
      });
    }
  }, [
    networkConfigurations,
    providerConfig,
    providerConfigTokenExplorer,
    chainId,
    isNonEvmSelected,
    networkName,
    nonEvmBlockExplorerUrl,
  ]);

  const tx = useCallback(
    (hash) => {
      if (!explorer.isValid) {
        return '';
      }

      const create = explorer.isRPC
        ? etherscanLink.createCustomExplorerLink
        : etherscanLink.createExplorerLink;
      return create(hash, explorer.value);
    },
    [explorer],
  );
  const account = useCallback(
    (address) => {
      if (!explorer.isValid) {
        return '';
      }

      const create = explorer.isRPC
        ? etherscanLink.createCustomAccountLink
        : etherscanLink.createAccountLink;
      return create(address, explorer.value);
    },
    [explorer],
  );
  const token = useCallback(
    (address) => {
      if (!explorer.isValid) {
        return '';
      }

      const create = explorer.isRPC
        ? etherscanLink.createCustomTokenTrackerLink
        : etherscanLink.createTokenTrackerLink;
      return create(address, explorer.value);
    },
    [explorer],
  );

  return {
    ...explorer,
    tx,
    account,
    token,
  };
}

export default useBlockExplorer;
