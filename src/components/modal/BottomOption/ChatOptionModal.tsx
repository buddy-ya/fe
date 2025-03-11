import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/store';
import { Ban, LogOut, Siren } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface ChatOptionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatOptionModal({ visible, onClose }: ChatOptionModalProps) {
  const { t } = useTranslation('feed');
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);

  const handleReportOption = useCallback(() => {
    onClose();
    setTimeout(() => {
      handleModalOpen('report');
    }, 300);
  }, [onClose, handleModalClose, handleModalOpen]);

  const handleBlockOption = useCallback(() => {
    onClose();
    setTimeout(() => {
      handleModalOpen('block');
    }, 300);
  }, [onClose, handleModalClose, handleModalOpen]);

  const handleExitOption = useCallback(() => {
    onClose();
    setTimeout(() => {
      handleModalOpen('exit');
    }, 300);
  }, [onClose, handleModalClose, handleModalOpen]);

  const options: OptionItem[] = [
    {
      id: 1,
      label: t('modal.report'),
      icon: <Siren size={16} color="#282828" />,
      onPress: handleReportOption,
    },
    {
      id: 2,
      label: t('modal.block') || 'Block',
      icon: <Ban size={16} color="#282828" />,
      onPress: handleBlockOption,
    },
    {
      id: 3,
      label: t('modal.exit'),
      icon: <LogOut size={16} color="#282828" />,
      onPress: handleExitOption,
    },
  ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
