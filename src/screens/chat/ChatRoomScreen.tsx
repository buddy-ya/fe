import { Suspense, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, FlatList, View } from 'react-native';
import { RoomRepository } from '@/api';
import {
  ChatOptionModal,
  InnerLayout,
  Input,
  KeyboardLayout,
  Layout,
  MessageItem,
  MyText,
} from '@/components';
import { useImageUpload } from '@/hooks';
import { ChatStackParamList } from '@/navigation/navigationRef';
import { useMessageStore, useModalStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ImagePickerOptions } from 'expo-image-picker';
import { EllipsisVertical, ChevronLeft, Image } from 'lucide-react-native';

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 0.7,
  allowsMultipleSelection: true,
  selectionLimit: 3,
};

type ChatRoomScreenProps = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;

export const ChatRoomScreen = ({ route }: ChatRoomScreenProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation('chat');
  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);

  const { handleUpload, loading } = useImageUpload({ options: IMAGE_PICKER_OPTIONS });
  const {
    text,
    messages,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    setMessage,
    addMessage,
    deleteMessage,
  } = useMessageStore();
  const flatListRef = useRef<FlatList>(null);

  // TODO: 추후에 알림 등으로 바로 들어온 경우 뒤로가기 스택이 없으므로 룸리스트로 보내게끔 해야 할 듯
  const handleBack = () => {
    navigation.goBack();
  };

  const onSubmit = () => {
    handleSubmit();
  };

  const { data } = useSuspenseQuery({
    queryKey: ['room', route.params.id],
    queryFn: () => RoomRepository.get({ id: route.params.id }),
  });

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 0);
  }, [messages]);

  return (
    <Layout
      showHeader
      isBackgroundWhite
      disableBottomSafeArea
      headerLeft={
        <TouchableOpacity
          onPress={handleBack}
          className="flex-row items-center"
          hitSlop={{ right: 20 }}
        >
          <ChevronLeft strokeWidth={2} size={30} color="#797979" />
        </TouchableOpacity>
      }
      headerCenter={
        <MyText size="text-lg" className="font-semibold">
          {data.name}
        </MyText>
      }
      headerRight={
        <TouchableOpacity
          onPress={() => {
            handleModalOpen('chat');
          }}
        >
          <EllipsisVertical strokeWidth={2} size={24} color="#797979" />
        </TouchableOpacity>
      }
    >
      <KeyboardLayout
        footer={
          <Input
            value={text}
            leftImage={
              <TouchableOpacity onPress={handleUpload}>
                <View className={`ml-2 h-[24px] w-[24px] flex-row items-center`}>
                  <Image size={24} strokeWidth={1.3} color="#797979" />
                </View>
              </TouchableOpacity>
            }
            onChange={handleChange}
            onSubmit={onSubmit}
            placeholder={t('keyboard.placeholder')}
          />
        }
      >
        <InnerLayout>
          <FlatList
            data={messages}
            renderItem={({ item, index }) => (
              <MessageItem
                key={item.id}
                message={item}
                profileImageUrl={data.profileImageUrl || ''}
                isCurrentUser={item.sender === 'me'}
                shouldShowProfile={
                  (index === 0 && item.sender !== 'me') ||
                  (index > 0 && messages[index - 1].sender !== item.sender && item.sender !== 'me')
                }
              />
            )}
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // 안전하게 current에 접근
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })} // 안전하게 current에 접근
          />
        </InnerLayout>
      </KeyboardLayout>
      <ChatOptionModal visible={modalVisible.chat} onClose={() => handleModalClose('chat')} />
    </Layout>
  );
};

export const SuspendedChatRoomScreen = (props: ChatRoomScreenProps) => {
  return (
    <ErrorBoundary fallback={<></>}>
      <Suspense fallback={<></>}>
        <ChatRoomScreen {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
