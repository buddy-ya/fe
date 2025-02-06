import { Modal, TouchableOpacity, View } from 'react-native';
import { useFeedDetail } from '@/hooks';
import { useModalStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import i18next from 'i18next';
import { Ban, Flag, Pencil, Send, Siren, Trash2 } from 'lucide-react-native';
import MyText from '@/components/common/MyText';
import { ChatRequestModal } from '../Common/ChatRequestModal';

interface BottomModalProps {
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
}: BottomModalProps) {
  const navigation = useNavigation<any>();
  const { handleCommentActions } = useFeedDetail({
    feedId: feed.id,
  });

  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const options = comment.isCommentOwner
    ? [
        // {
        //     id: 1,
        //     label: i18next.t('feed:modal.edit'),
        //     icon: <Pencil size={20} color="#282828" />,
        //     onPress: () =>
        //         navigation.navigate('CommentEdit', {
        //             feedId: feed.id,
        //             commentId: comment.id,
        //             initialContent: comment.content,
        //         }),
        // },
        {
          id: 2,
          label: i18next.t('feed:modal.delete'),
          icon: <Trash2 size={20} color="#282828" />,
          onPress: async () => await handleCommentActions.delete(comment.id),
        },
      ]
    : [
        {
          id: 3,
          label: i18next.t('feed:modal.block'),
          icon: <Ban size={20} color="#282828" />,
          onPress: () => console.log('block'),
        },
        {
          id: 4,
          label: i18next.t('feed:modal.report'),
          icon: <Siren size={20} color="#282828" />,
          onPress: () => console.log('report'),
        },
        {
          id: 5,
          label: i18next.t('feed:modal.chat'),
          icon: <Send size={20} color="#282828" />,
          onPress: () => {
            onClose();
            onSelect('chat');
          },
        },
      ];

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
          <View className="absolute bottom-8 left-5 right-5 rounded-[20px] bg-white py-0">
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className={`py-6 ${index !== 0 && 'border-t'} border-modalBorderBottom`}
                onPress={() => {
                  option.onPress();
                  onClose();
                }}
              >
                <View className="flex-row items-center justify-center">
                  {option.icon && <View className="mr-2">{option.icon}</View>}
                  <MyText size="text-[16px]" className="text-center" color={'text-[#282828]'}>
                    {option.label}
                  </MyText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
