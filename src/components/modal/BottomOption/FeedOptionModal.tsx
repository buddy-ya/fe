import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { useModalStore, useToastStore, useUserStore } from '@/store';
import { Feed } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Pencil, Trash2, Siren, Ban, Send } from 'lucide-react-native';
import { logError } from '@/utils';
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
  const { showToast } = useToastStore();

  async function handleBlock() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'FeedHome' }],
    });
    await queryClient.invalidateQueries({ queryKey: feedKeys.all });
  }

  const handleReportOption = () => {
    onClose();
    setTimeout(() => {
      if (isCertificated) {
        handleModalOpen('report', {
          type: 'FEED',
          reportedId: feed.id,
          reportedUserId: feed.userId,
        });
      } else {
        handleModalOpen('studentCertification');
      }
    }, 200);
  };

  const handleBlockOption = () => {
    onClose();
    setTimeout(() => {
      if (isCertificated) {
        handleModalOpen('block', { buddyId: feed.userId, onBlockSuccess: handleBlock });
      } else {
        handleModalOpen('studentCertification');
      }
    }, 200);
  };

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

  const handleChatRequestOption = () => {
    onClose();
    setTimeout(() => {
      if (isCertificated) {
        handleModalOpen('chatRequest', { data: feed });
      } else {
        handleModalOpen('studentCertification');
      }
    }, 200);
  };

  const options: OptionItem[] = feed.isFeedOwner
    ? [
        {
          id: 1,
          label: i18next.t('feed:modal.edit'),
          icon: <Pencil size={16} color="#282828" />,
          onPress: () => {
            navigation.navigate('FeedWrite', { feed, isEdit: true });
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
                queryClient.invalidateQueries({
                  predicate: (query) => {
                    const key = query.queryKey;
                    if (key[0] !== 'feeds') return false;
                    if (key[1] === 'detail') return false;
                    return true;
                  },
                });
                navigation.goBack();
                onClose();
              } catch (error: any) {
                logError(error);
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
        {
          id: 5,
          label: i18next.t('feed:modal.chat'),
          icon: <Send size={16} color="#282828" />,
          onPress: handleChatRequestOption,
        },
      ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
