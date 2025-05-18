import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { useModalStore, useUserStore } from '@/store';
import { Feed } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Pencil, Trash2, Pin, Siren, Ban, Send } from 'lucide-react-native';
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
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const role = useUserStore((state) => state.role);
  const isOwner = role === 'OWNER';

  async function handleBlock() {
    navigation.reset({ index: 0, routes: [{ name: 'FeedHome' }] });
    await queryClient.invalidateQueries({ queryKey: feedKeys.all });
  }

  const handleReportOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('report', {
        type: 'FEED',
        reportedId: feed.id,
        reportedUserId: feed.userId,
      });
    }, 200);
  };

  const handleBlockOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('block', { buddyId: feed.userId, onBlockSuccess: handleBlock });
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
      handleModalOpen('chatRequest', { data: feed });
    }, 200);
  };

  const handleTogglePin = async () => {
    try {
      await FeedRepository.togglePin({ feedId: feed.id });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
      onClose();
    } catch (err: any) {
      logError(err);
    }
  };

  const authorOptions: OptionItem[] = [
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
              predicate: (q) => q.queryKey[0] === 'feeds' && q.queryKey[1] !== 'detail',
            });
            navigation.goBack();
            onClose();
          } catch (error: any) {
            logError(error);
          }
        }),
    },
  ];

  const guestOptions: OptionItem[] = [
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

  const ownerOption: OptionItem[] = [
    {
      id: 6,
      label: feed.isPinned ? i18next.t('feed:modal.unpin') : i18next.t('feed:modal.pin'),
      icon: <Pin size={16} color="#282828" />,
      onPress: handleTogglePin,
    },
    {
      id: 7,
      label: i18next.t('feed:modal.delete'),
      icon: <Trash2 size={16} color="#282828" />,
      onPress: () =>
        showDeleteAlert(async () => {
          try {
            await FeedRepository.delete({ feedId: feed.id });
            queryClient.invalidateQueries({
              predicate: (q) => q.queryKey[0] === 'feeds' && q.queryKey[1] !== 'detail',
            });
            navigation.goBack();
            onClose();
          } catch (error: any) {
            logError(error);
          }
        }),
    },
  ];

  const options: OptionItem[] = [
    ...(feed.isFeedOwner ? authorOptions : guestOptions),
    ...(isOwner ? ownerOption : []),
  ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
