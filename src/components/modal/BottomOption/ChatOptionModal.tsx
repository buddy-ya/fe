import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ban, LogOut, Siren } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface ChatOptionModalProps {
  visible: boolean;
  onClose: () => void;
  onReport: () => void;
  onExit: () => void;
}

export function ChatOptionModal({ visible, onClose, onReport, onExit }: ChatOptionModalProps) {
  const { t } = useTranslation('feed');

  const options: OptionItem[] = [
    {
      id: 1,
      label: t('modal.report'),
      icon: <Siren size={16} color="#282828" />,
      onPress: onReport,
    },
    {
      id: 2,
      label: t('modal.block') || 'Block',
      icon: <Ban size={16} color="#282828" />,
      onPress: () => console.log('block'),
    },
    {
      id: 3,
      label: t('modal.exit'),
      icon: <LogOut size={16} color="#282828" />,
      onPress: onExit,
    },
  ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
