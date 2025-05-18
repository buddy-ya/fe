import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { useFeedDetail } from '@/hooks';
import { useModalStore, useToastStore, useUserStore } from '@/store';
import { Comment, Feed } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Ban, Siren, Trash2, Send } from 'lucide-react-native';
import { logError } from '@/utils';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface CommentOptionModalProps {
  visible: boolean;
  onClose: () => void;
  feedId: number;
  comment: Comment;
  feed: Feed;
}

export function CommentOptionModal({
  visible,
  onClose,
  feedId,
  feed,
  comment,
}: CommentOptionModalProps) {
  const queryClient = useQueryClient();
  const { handleCommentActions } = useFeedDetail({
    feedCategory: feed.category,
    university: feed.universityTab,
    feedId,
  });
  const handleModalOpen = useModalStore((state) => state.handleOpen);

  const handleBlock = async () => {
    await queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
  };

  const handleReportOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('report', {
        type: 'COMMENT',
        reportedId: comment.id,
        reportedUserId: comment.userId,
      });
    }, 200);
  };

  const handleBlockOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('block', {
        buddyId: comment.userId,
        onBlockSuccess: handleBlock,
      });
    }, 200);
  };

  const handleChatRequestOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('chatRequest', { data: comment });
    }, 200);
  };

  const options: OptionItem[] = comment.isCommentOwner
    ? [
        {
          id: 2,
          label: i18next.t('feed:modal.delete'),
          icon: <Trash2 size={16} color="#282828" />,
          onPress: async () => {
            try {
              await handleCommentActions.delete(comment.id);
            } catch (error: any) {
              logError(error);
            }
          },
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
