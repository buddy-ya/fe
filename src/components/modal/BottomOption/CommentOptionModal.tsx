import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { useFeedDetail } from '@/hooks';
import { useModalStore, useToastStore, useUserStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import i18next from 'i18next';
import { Ban, Siren, Trash2, Send } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface CommentOptionModalProps {
  visible: boolean;
  onClose: () => void;
  feed: any;
  comment: any;
}

export function CommentOptionModal({ visible, onClose, feed, comment }: CommentOptionModalProps) {
  const { handleCommentActions } = useFeedDetail({ feedId: feed.id });
  const { t } = useTranslation();
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const { showToast } = useToastStore();
  const isCertificated = useUserStore((state) => state.isCertificated);

  const handleReportOption = () => {
    onClose();
    setTimeout(() => {
      isCertificated ? handleModalOpen('report') : handleModalOpen('studentCertification');
    }, 300);
  };

  const handleBlockOption = () => {
    onClose();
    setTimeout(() => {
      isCertificated ? handleModalOpen('block') : handleModalOpen('studentCertification');
    }, 300);
  };

  const handleChatRequestOption = () => {
    onClose();
    setTimeout(() => {
      isCertificated ? handleModalOpen('chatRequest') : handleModalOpen('studentCertification');
    }, 300);
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
