// Third party dependencies.
import React, { useEffect, useRef } from 'react';

// External dependencies.
import { useMetrics } from '../../../hooks/useMetrics';
import BottomSheet, {
  BottomSheetRef,
} from '../../../../component-library/components/BottomSheets/BottomSheet';
import { strings } from '../../../../../locales/i18n';

import  {
  IconColor,
  IconName,
  IconSize,
} from '../../../../component-library/components/Icons/Icon';
import { MetaMetricsEvents } from '../../../../core/Analytics';
import { useResetNotificationsStorageKey } from '../../../../util/notifications/hooks/useNotifications';
import ModalContent from '../Modal';

const ResetNotificationsModal = () => {
  const { trackEvent } = useMetrics();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [isChecked, setIsChecked] = React.useState(false);
  const { resetNotificationsStorageKey, loading } = useResetNotificationsStorageKey();


  const closeBottomSheet = () => bottomSheetRef.current?.onCloseBottomSheet();

  const handleCta = async () => {
    await resetNotificationsStorageKey();
      trackEvent(MetaMetricsEvents.NOTIFICATION_STORAGE_KEY_DELETED, {
        settings_type: 'reset_notifications_storage_key',
      });
  };

  const prevLoading = useRef(loading);
  useEffect(() => {
    if (prevLoading.current && !loading) {
      closeBottomSheet();
    }
    prevLoading.current = loading;
  }, [loading]);


  return (
    <BottomSheet ref={bottomSheetRef}>
      <ModalContent
        title={strings('app_settings.reset_notifications_title')}
        message={strings('app_settings.reset_notifications_description')}
        iconName={IconName.Danger}
        iconColor={IconColor.Error}
        iconSize={IconSize.Xl}
        checkBoxLabel={strings('default_settings.sheet.checkbox_label')}
        btnLabelCancel={strings('default_settings.sheet.buttons.cancel')}
        btnLabelCta={strings('default_settings.sheet.buttons.reset')}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        handleCta={handleCta}
        handleCancel={closeBottomSheet}
        loading={loading}
        />
    </BottomSheet>
  );
};

export default ResetNotificationsModal;
