import React from 'react';
import { useSelector } from 'react-redux';

import { strings } from '../../../../../../../locales/i18n';
import { selectUseTransactionSimulations } from '../../../../../../selectors/preferencesController';
import InfoSection from '../../UI/InfoRow/InfoSection';
import InfoRow from '../../UI/InfoRow';

// todo: this component can be deleted if not used anywhere
const NoChangeSimulation = () => {
  const useTransactionSimulations = useSelector(
    selectUseTransactionSimulations,
  );

  if (useTransactionSimulations !== true) {
    return null;
  }

  return (
    <InfoSection>
      <InfoRow
        label={strings('confirm.simulation.title')}
        tooltip={strings('confirm.simulation.tooltip')}
      >
        {strings('confirm.simulation.info_no_changes')}
      </InfoRow>
    </InfoSection>
  );
};

export default NoChangeSimulation;
