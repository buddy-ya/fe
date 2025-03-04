import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import { ChatSocketRepository, UserRepository } from '@/api';
import { useNavigation } from '@react-navigation/native';
import { StandardModal } from './Common';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: number;
  reportedUserId?: number;
}

export function ReportModal({ visible, roomId, reportedUserId = 0, onClose }: ReportModalProps) {
  const { t } = useTranslation('common');
  const navigation = useNavigation<any>();

  const [reason, setReason] = useState('');

  const handleAccept = async () => {
    try {
      // 밖에서 비동기 통신 하도록 수정.
      await UserRepository.report({
        type: 'CHATROOM',
        reportedId: roomId,
        reportedUserId,
        reason: reason.trim(),
      });
      handleCancel();
      handleExit();
    } catch (error) {}
  };

  const handleCancel = () => {
    setReason('');
    onClose();
  };

  const handleExit = async () => {
    await ChatSocketRepository.roomOut(roomId);
    onClose();
    navigation.goBack();
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
