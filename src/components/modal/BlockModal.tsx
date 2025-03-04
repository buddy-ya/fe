import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatSocketRepository } from '@/api';
import { useToastStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { MyText } from '../common';
import { StandardModal } from './Common';

interface BlockModalProps {
  visible: boolean;
  roomId: number;
  onClose: () => void;
}

export function BlockModal({ visible, roomId, onClose }: BlockModalProps) {
  const { t } = useTranslation('common');
  const navigation = useNavigation<any>();
  const { showToast } = useToastStore();

  const handleBlock = async () => {
    await ChatSocketRepository.roomOut(roomId);
    onClose();
    navigation.goBack();
    showToast(<MyText>🚫</MyText>, t('toast.blockSuccess'));
  };

  return (
    <StandardModal
      visible={visible}
      title={t('modal.block.title')}
      description={t('modal.block.description')}
      cancelText={t('modal.block.cancel')}
      acceptText={t('modal.block.confirm')}
      onCancel={onClose}
      onAccept={handleBlock}
    />
  );
}
