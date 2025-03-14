import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TextInput, Text } from 'react-native';
import { UserRepository } from '@/api';
import { useToastStore } from '@/store';
import { StandardModal } from './Common';

interface ReportModalProps {
  visible: boolean;
  type: 'CHATROOM' | 'FEED' | 'COMMENT';
  reportedId: number;
  reportedUserId: number;
  onClose: () => void;
  onReportSuccess?: () => void;
}

export function ReportModal({
  visible,
  type,
  reportedId,
  reportedUserId,
  onClose,
  onReportSuccess,
}: ReportModalProps) {
  const { t } = useTranslation('common');
  const [reason, setReason] = useState('');
  const { showToast } = useToastStore();

  const handleAccept = async () => {
    if (!reason.trim()) {
      Alert.alert(t('modal.report.errorTitle'), t('modal.report.errorMessage'));
      return;
    }
    try {
      await UserRepository.report({
        type,
        reportedId,
        reportedUserId,
        reason: reason.trim(),
      });
      if (type === 'CHATROOM' && onReportSuccess) {
        onReportSuccess();
      }
      showToast(<Text>🙌</Text>, t('toast.reportSuccess'), 2000);
    } catch (error: any) {
      const errorCode = error.response?.data?.code;
      const errorMapping: Record<number, { emoji: string; translationKey: string }> = {
        4000: { emoji: '🗑️', translationKey: 'feed:error.deletedFeed' },
        4006: { emoji: '🗑️', translationKey: 'feed:error.deletedComment' },
      };
      const errorInfo = errorMapping[errorCode];
      if (errorInfo) {
        showToast(<Text>{errorInfo.emoji}</Text>, t(errorInfo.translationKey), 2000);
      }
    } finally {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setReason('');
    onClose();
  };

  return (
    <StandardModal
      visible={visible}
      title={t('modal.report.title')}
      description={
        type === 'CHATROOM' ? t('modal.report.chat.description') : t('modal.report.description')
      }
      cancelText={t('modal.report.cancel')}
      acceptText={t('modal.report.accept')}
      onCancel={handleCancel}
      onAccept={handleAccept}
      className="mb-[50px]"
    >
      <TextInput
        value={reason}
        onChangeText={setReason}
        multiline
        maxLength={100}
        className="rounded-lg bg-[#F6F6F6] p-2 text-base"
        style={{ height: 100, textAlignVertical: 'top' }}
      />
    </StandardModal>
  );
}
