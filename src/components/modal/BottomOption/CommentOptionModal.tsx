import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { useFeedDetail } from '@/hooks';
import { useModalStore, useToastStore, useUserStore } from '@/store';
import { Comment } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Ban, Siren, Trash2, Send } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface CommentOptionModalProps {
  visible: boolean;
  onClose: () => void;
  feedId: number;
  comment: Comment;
}

export function CommentOptionModal({ visible, onClose, feedId, comment }: CommentOptionModalProps) {
  const queryClient = useQueryClient();
  const { handleCommentActions } = useFeedDetail({ feedId });
  const { t } = useTranslation();
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const { showToast } = useToastStore();
  const isCertificated = useUserStore((state) => state.isCertificated);

  // handleBlock: 쿼리 무효화로 댓글 리스트 갱신 (필요 시)
  const handleBlock = async () => {
    await queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
  };

  const handleReportOption = () => {
    onClose();
    setTimeout(() => {
      if (isCertificated) {
        handleModalOpen('report', {
          type: 'COMMENT',
          reportedId: comment.id,
          reportedUserId: comment.userId,
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
        handleModalOpen('block', {
          buddyId: comment.userId,
          onBlockSuccess: handleBlock,
        });
      } else {
        handleModalOpen('studentCertification');
      }
    }, 200);
  };

  const handleChatRequestOption = () => {
    onClose();
    setTimeout(() => {
      if (isCertificated) {
        handleModalOpen('chatRequest', { data: comment });
      } else {
        handleModalOpen('studentCertification');
      }
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
              const errorCode = error.response?.data?.code;
              const errorMapping: Record<number, { emoji: string; translationKey: string }> = {
                4000: { emoji: '🗑️', translationKey: 'feed:error.deletedFeed' },
                4006: { emoji: '🗑️', translationKey: 'feed:error.deletedComment' },
              };
              const errorInfo = errorMapping[errorCode];
              if (errorInfo) {
                showToast(<Text>{errorInfo.emoji}</Text>, t(errorInfo.translationKey), 2000);
              }
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
