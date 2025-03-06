import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatSocketRepository, UserRepository } from '@/api';
import { useToastStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { logError } from '@/utils';
import { MyText } from '../common';
import { StandardModal } from './Common';

interface BlockModalProps {
  visible: boolean;
  roomId: number;
  buddyId: number;
  onClose: () => void;
  onBlockSuccess?: () => Promise<void>;
}

export function BlockModal({ visible, roomId, buddyId, onClose, onBlockSuccess }: BlockModalProps) {
  const { t } = useTranslation('common');
  const { showToast } = useToastStore();
  const handleBlock = async () => {
    try {
      await UserRepository.block({ userId: buddyId });
      onClose();
      if (onBlockSuccess) {
        await onBlockSuccess();
      }
      showToast(<MyText>🚫</MyText>, t('toast.blockSuccess'), 2000);
    } catch (error) {
      logError(error);
    }
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
