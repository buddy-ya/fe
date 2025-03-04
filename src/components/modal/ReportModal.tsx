import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TextInput } from 'react-native';
import { StandardModal } from './Common';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: (reason: string) => void;
}

export function ReportModal({ visible, onClose, onAccept }: ReportModalProps) {
  const { t } = useTranslation('common');
  const [reason, setReason] = useState('');

  const handleAccept = () => {
    if (!reason.trim()) {
      Alert.alert(t('modal.report.errorTitle'), t('modal.report.errorMessage'));
      return;
    }
    onAccept(reason.trim());
    setReason('');
    onClose();
  };

  const handleCancel = () => {
    setReason('');
    onClose();
  };

  return (
    <StandardModal
      visible={visible}
      title={t('modal.report.title')}
      description={t('modal.report.description')}
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
        className="rounded-lg bg-[#F6F6F6] p-2 text-base"
        placeholder={t('modal.report.placeholder')}
        style={{ height: 100 }}
      />
    </StandardModal>
  );
}
