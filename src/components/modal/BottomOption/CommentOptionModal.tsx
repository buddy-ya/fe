import React from 'react';
import { useFeedDetail } from '@/hooks';
import { useModalStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import i18next from 'i18next';
import { Ban, Siren, Trash2, Send } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface CommentOptionModalProps {
  visible: boolean;
  onClose: () => void;
  feed: any;
  comment: any;
  onSelect: (action: string) => void;
}

export function CommentOptionModal({
  visible,
  onClose,
  feed,
  comment,
  onSelect,
}: CommentOptionModalProps) {
  const navigation = useNavigation<any>();
  const { handleCommentActions } = useFeedDetail({ feedId: feed.id });
  const handleModalOpen = useModalStore((state) => state.handleOpen);

  const options: OptionItem[] = comment.isCommentOwner
    ? [
        {
          id: 2,
          label: i18next.t('feed:modal.delete'),
          icon: <Trash2 size={16} color="#282828" />,
          onPress: async () => {
            await handleCommentActions.delete(comment.id);
          },
        },
      ]
    : [
        {
          id: 3,
          label: i18next.t('feed:modal.block'),
          icon: <Ban size={16} color="#282828" />,
          onPress: () => console.log('block'),
        },
        {
          id: 4,
          label: i18next.t('feed:modal.report'),
          icon: <Siren size={16} color="#282828" />,
          onPress: () => console.log('report'),
        },
        {
          id: 5,
          label: i18next.t('feed:modal.chat'),
          icon: <Send size={16} color="#282828" />,
          onPress: () => {
            onClose();
            onSelect('chat');
          },
        },
      ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
