import {
  personalSignatureConfirmationState,
  stakingDepositConfirmationState,
} from '../../../../util/test/confirm-data-helpers';
import { renderHookWithProvider } from '../../../../util/test/renderWithProvider';
import Routes from '../../../../constants/navigation/Routes';
import { useStandaloneConfirmation } from './useStandaloneConfirmation';

describe('useStandaloneConfirmation', () => {
  it('returns true for staking confirmation', async () => {
    const { result } = renderHookWithProvider(useStandaloneConfirmation, {
      state: stakingDepositConfirmationState,
    });

    expect(result.current.isStandaloneConfirmation).toBe(true);
    expect(result.current.navigationOpts).toEqual([
      'StakeScreens',
      {
        screen: Routes.STANDALONE_CONFIRMATIONS.STAKE_DEPOSIT,
      },
    ]);
  });

  it('returns false for personal sign request', async () => {
    const { result } = renderHookWithProvider(useStandaloneConfirmation, {
      state: personalSignatureConfirmationState,
    });

    expect(result.current.isStandaloneConfirmation).toBe(false);
  });
});
