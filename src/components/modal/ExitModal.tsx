import { useTranslation } from 'react-i18next';
import { useToastStore } from '@/store';
import { MyText } from '../common';
import { StandardModal } from './Common';

interface ExitModalProps {
  visible: boolean;
  roomId: number;
  onClose: () => void;
  onExit: () => Promise<void>;
}

export function ExitModal({ visible, roomId, onClose, onExit }: ExitModalProps) {
  const { t } = useTranslation('common');
  const { showToast } = useToastStore();

  const handleExit = async () => {
    onClose();
    await onExit();
    showToast(<MyText>🚪</MyText>, t('toast.exitSuccess'), 2000);
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
