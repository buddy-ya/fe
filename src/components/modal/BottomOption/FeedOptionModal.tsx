import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Pencil, Trash2, Flag, Ban, Siren } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface FeedOptionModalProps {
  visible: boolean;
  onClose: () => void;
  feed: any;
}

export function FeedOptionModal({ visible, onClose, feed }: FeedOptionModalProps) {
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

  const options: OptionItem[] = feed.isFeedOwner
    ? [
        {
          id: 1,
          label: i18next.t('feed:modal.edit'),
          icon: <Pencil size={16} color="#282828" />,
          onPress: () => {
            navigation.navigate('FeedWrite', {
              feed,
              isEdit: true,
            });
          },
        },
        {
          id: 2,
          label: i18next.t('feed:modal.delete'),
          icon: <Trash2 size={16} color="#282828" />,
          onPress: () =>
            showDeleteAlert(async () => {
              await FeedRepository.delete({ feedId: feed.id });
              queryClient.invalidateQueries({ queryKey: feedKeys.all });
              navigation.goBack();
              onClose();
            }),
        },
      ]
    : [
        {
          id: 3,
          label: i18next.t('feed:modal.report'),
          icon: <Siren size={16} color="#282828" />,
          onPress: () => console.log('report'),
        },
        {
          id: 4,
          label: i18next.t('feed:modal.block'),
          icon: <Ban size={16} color="#282828" />,
          onPress: () => console.log('block'),
        },
      ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
