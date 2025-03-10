import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { useModalStore, useToastStore, useUserStore } from '@/store';
import { Feed } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Pencil, Trash2, Flag, Ban, Siren } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface FeedOptionModalProps {
  visible: boolean;
  onClose: () => void;
  feed: Feed;
}

export function FeedOptionModal({ visible, onClose, feed }: FeedOptionModalProps) {
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();

  const { t } = useTranslation('feed');

  const isCertificated = useUserStore((state) => state.isCertificated);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const { showToast } = useToastStore();

  const handleReportOption = useCallback(() => {
    onClose();
    isCertificated ? handleModalOpen('report') : handleModalOpen('studentCertification');
  }, [onClose, handleModalClose, handleModalOpen]);

  const handleBlockOption = useCallback(() => {
    onClose();
    isCertificated ? handleModalOpen('block') : handleModalOpen('studentCertification');
  }, [onClose, handleModalClose, handleModalOpen]);

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
            onClose();
          },
        },
        {
          id: 2,
          label: i18next.t('feed:modal.delete'),
          icon: <Trash2 size={16} color="#282828" />,
          onPress: () =>
            showDeleteAlert(async () => {
              try {
                await FeedRepository.delete({ feedId: feed.id });
                queryClient.invalidateQueries({ queryKey: feedKeys.all });
                navigation.goBack();
                onClose();
              } catch (error: any) {
                const errorCode = error.response?.data?.code;
                const errorMapping: Record<number, { emoji: string; translationKey: string }> = {
                  4000: { emoji: '🗑️', translationKey: 'feed:error.deletedFeed' },
                };
                const errorInfo = errorMapping[errorCode];
                if (errorInfo) {
                  showToast(<Text>{errorInfo.emoji}</Text>, t(errorInfo.translationKey), 2000);
                }
              }
            }),
        },
      ]
    : [
        {
          id: 3,
          label: i18next.t('feed:modal.report'),
          icon: <Siren size={16} color="#282828" />,
          onPress: handleReportOption,
        },
        {
          id: 4,
          label: i18next.t('feed:modal.block'),
          icon: <Ban size={16} color="#282828" />,
          onPress: handleBlockOption,
        },
      ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
