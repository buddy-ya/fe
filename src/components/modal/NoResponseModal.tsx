import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text } from 'react-native';
import { UserRepository } from '@/api';
import { useToastStore } from '@/store';
import { logError } from '@/utils';
import { StandardModal } from './Common';

interface NoResponseModalProps {
  visible: boolean;
  reportedId: number;
  reportedUserId: number;
  onClose: () => void;
  onReportSuccess: () => void;
}

export function NoResponseModal({
  visible,
  reportedId,
  reportedUserId,
  onClose,
  onReportSuccess,
}: NoResponseModalProps) {
  const { t } = useTranslation('common');
  const { showToast } = useToastStore();

  const handleAccept = async () => {
    try {
      await UserRepository.report({
        type: 'CHATROOM_NO_RESPONSE',
        reportedId,
        reportedUserId,
        reason: '',
      });
      onReportSuccess();
      showToast(<Text>📭</Text>, t('toast.reportSuccess'), 2000);
    } catch (error: any) {
      logError(error);
    } finally {
      onClose();
    }
  };

  return (
    <StandardModal
      visible={visible}
      title={t('modal.noResponse.title')}
      description={t('modal.noResponse.description')}
      cancelText={t('modal.noResponse.cancel')}
      acceptText={t('modal.noResponse.confirm')}
      onCancel={onClose}
      onAccept={handleAccept}
    />
  );
}
