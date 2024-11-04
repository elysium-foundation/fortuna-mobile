
import { useSelector } from 'react-redux';
import usePolling from '../usePolling';
import { selectNetworkConfigurations } from '../../../selectors/networkController';
import Engine from '../../../core/Engine';
import { selectConversionRate, selectCurrencyRates } from '../../../selectors/currencyRateController';

// Polls native currency prices across networks.
//
// Note: Don't check this in until assets controllers version 41,
//       where the input changes to an array of tickers.
const useCurrencyRatePolling = () => {

  // Selectors to determine polling input
  const networkConfigurations = useSelector(selectNetworkConfigurations);

  // Selectors returning state updated by the polling
  const conversionRate = useSelector(selectConversionRate);
  const currencyRates = useSelector(selectCurrencyRates);

  const networkClientIds =
    Object.values(networkConfigurations).map(networkConfiguration => ({
      networkClientId: networkConfiguration.rpcEndpoints[
        networkConfiguration.defaultRpcEndpointIndex].networkClientId
    }));

  const { CurrencyRateController } = Engine.context;

  usePolling({
    startPolling:
      CurrencyRateController.startPolling.bind(CurrencyRateController),
    stopPollingByPollingToken:
      CurrencyRateController.stopPollingByPollingToken.bind(CurrencyRateController),
    input: networkClientIds,
  });

  return {
    conversionRate,
    currencyRates,
  };
};

export default useCurrencyRatePolling;
