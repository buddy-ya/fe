import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatSocketRepository } from '@/api';
import { useNavigation } from '@react-navigation/native';
import { StandardModal } from './Common';

interface ExitModalProps {
  visible: boolean;
  roomId: number;
  onClose: () => void;
}

export function ExitModal({ visible, roomId, onClose }: ExitModalProps) {
  const { t } = useTranslation('common');
  const navigation = useNavigation<any>();

  const handleExit = async () => {
    await ChatSocketRepository.roomOut(roomId);
    onClose();
    navigation.goBack();
  };

  return (
    <StandardModal
      visible={visible}
      title={t('modal.exit.title')}
      description={t('modal.exit.description')}
      cancelText={t('modal.exit.cancel')}
      acceptText={t('modal.exit.accept')}
      onCancel={onClose}
      onAccept={handleExit}
    />
  );
}
