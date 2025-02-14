import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import Routes from '../../../../constants/navigation/Routes';
import { useFlatConfirmation } from '../hooks/useFlatConfirmation';
import { useConfirmationRedesignEnabled } from '../hooks/useConfirmationRedesignEnabled';
import { useStandaloneConfirmation } from '../hooks/useStandaloneConfirmation';

export const ConfirmRoot = () => {
  const { isRedesignedEnabled } = useConfirmationRedesignEnabled();
  const { isFlatConfirmation } = useFlatConfirmation();
  const { isStandaloneConfirmation } = useStandaloneConfirmation();
  const navigation = useNavigation();

  useEffect(() => {
    if (isRedesignedEnabled) {
      if (isStandaloneConfirmation) {
        // TODO: Decide if we want to navigate to a standalone confirmation page or do it in wherever it's used
        return;
      }
      navigation.navigate(
        isFlatConfirmation ? Routes.CONFIRM_FLAT_PAGE : Routes.CONFIRM_MODAL,
      );
    }
  }, [
    isFlatConfirmation,
    isRedesignedEnabled,
    isStandaloneConfirmation,
    navigation,
  ]);

  return null;
};
