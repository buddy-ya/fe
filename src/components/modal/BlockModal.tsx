import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { UserRepository } from '@/api';
import { useToastStore } from '@/store';
import { MyText } from '../common';
import { StandardModal } from './Common';

interface BlockModalProps {
  visible: boolean;
  roomId?: number;
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
    } catch (error: any) {
      const errorCode = error.response?.data?.code;
      const errorMapping: Record<number, { emoji: string; translationKey: string }> = {
        2011: { emoji: '🚫', translationKey: 'feed:error.alreadyBlocked' },
        4000: { emoji: '🗑️', translationKey: 'feed:error.deletedFeed' },
        4006: { emoji: '🗑️', translationKey: 'feed:error.deletedComment' },
      };
      const errorInfo = errorMapping[errorCode];
      if (errorInfo) {
        showToast(<Text>{errorInfo.emoji}</Text>, t(errorInfo.translationKey), 2000);
      }
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
