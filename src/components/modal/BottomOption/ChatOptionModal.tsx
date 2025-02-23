import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Ban, LogOut, Siren } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface ChatOptionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatOptionModal({ visible, onClose }: ChatOptionModalProps) {
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  const { t } = useTranslation('feed');

  const showDeleteAlert = (onConfirm: () => void) => {
    Alert.alert(
      t('delete.title'),
      t('delete.description'),
      [
        { text: t('delete.cancel'), style: 'cancel' },
        { text: t('delete.confirm'), style: 'destructive', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  };

  const options: OptionItem[] = [
    {
      id: 1,
      label: i18next.t('feed:modal.report'),
      icon: <Siren size={16} color="#282828" />,
      onPress: () => console.log('report'),
    },
    {
      id: 2,
      label: i18next.t('feed:modal.block'),
      icon: <Ban size={16} color="#282828" />,
      onPress: () => console.log('block'),
    },
    {
      id: 3,
      label: i18next.t('feed:modal.exit'),
      icon: <LogOut size={16} color="#282828" />,
      onPress: () => console.log('report'),
    },
  ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
