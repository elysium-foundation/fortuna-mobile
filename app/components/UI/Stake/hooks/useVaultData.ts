import { useSelector } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';
import { selectPooledStakingVaultData } from '../../../../selectors/earnController';
import Engine from '../../../../core/Engine';

const useVaultData = () => {
  const vaultData = useSelector(selectPooledStakingVaultData);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVaultData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Engine.context.EarnController.refreshVaultData();
    } catch (err) {
      setError('Failed to fetch vault data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  const apy = vaultData?.apy || '0';
  const annualRewardRatePercentage = apy ? parseFloat(apy) : 0;
  const annualRewardRateDecimal = annualRewardRatePercentage / 100;

  const annualRewardRate =
    annualRewardRatePercentage === 0
      ? '0%'
      : `${annualRewardRatePercentage.toFixed(1)}%`;

  return {
    vaultData,
    isLoadingVaultData: isLoading,
    error,
    annualRewardRate,
    annualRewardRateDecimal,
  };
};

export default useVaultData;
