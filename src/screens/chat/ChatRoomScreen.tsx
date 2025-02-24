import { Suspense, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import {
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { InteractionManager } from 'react-native';
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
import { Message } from '@/model';
import { ChatStackParamList } from '@/navigation/navigationRef';
import { useMessageStore, useModalStore, useUserStore } from '@/store';
import { ChatListResponse } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ImagePickerOptions } from 'expo-image-picker';
import { EllipsisVertical, ChevronLeft, Image } from 'lucide-react-native';
import ChatRepository from '@/api/ChatRepository';

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
  const CURRENT_USER_ID = useUserStore((state) => state.id);
  const { handleUpload } = useImageUpload({ options: IMAGE_PICKER_OPTIONS });
  const { text, messages, setMessage, handleChange, handleSubmit } = useMessageStore();
  const flatListRef = useRef<FlatList<any>>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const BOTTOM_THRESHOLD = 200; // 사용자가 하단에 있다고 간주할 임계치(픽셀 단위)

  // 채팅방 기본 정보 조회 (룸 이름, 프로필 이미지 등)
  const { data: roomData } = useSuspenseQuery({
    queryKey: ['room', route.params.id],
    queryFn: () => RoomRepository.get({ id: route.params.id }),
  });

  // 채팅 데이터 조회 (페이징 처리)
  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chats', route.params.id] as const,
    queryFn: ({ pageParam = 0 }) =>
      ChatRepository.getChats({ roomId: route.params.id, page: pageParam, size: 15 }),
    getNextPageParam: (lastPage: ChatListResponse) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (chatData) {
      const newMessages = chatData.pages.flatMap((page) =>
        page.messages.map((chat) => ({
          id: chat.id,
          sender: chat.senderId === CURRENT_USER_ID ? 'me' : chat.senderId.toString(),
          content: chat.message,
          type: chat.type,
          createdDate: chat.createdDate,
        }))
      );
      setMessage(newMessages);
    }
  }, [chatData, setMessage, CURRENT_USER_ID]);

  // FlatList의 onScroll을 통해 현재 스크롤 위치 추적
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = event;
    setScrollOffset(nativeEvent.contentOffset.y);
  };

  const handleLayout = () => {
    if (scrollOffset < BOTTOM_THRESHOLD) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const onSubmit = () => {
    handleSubmit();
  };

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
          {roomData.name}
        </MyText>
      }
      headerRight={
        <TouchableOpacity onPress={() => handleModalOpen('chat')}>
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
                <View className="ml-2 h-[24px] w-[24px] flex-row items-center">
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
            inverted // 최신 메시지가 하단에 위치하도록 반전 적용
            renderItem={({ item, index }) => (
              <MessageItem
                key={item.id}
                message={item}
                profileImageUrl={roomData.profileImageUrl || ''}
                isCurrentUser={item.sender === 'me'}
                shouldShowProfile={
                  (index === 0 && item.sender !== 'me') ||
                  (index > 0 && messages[index - 1].sender !== item.sender && item.sender !== 'me')
                }
              />
            )}
            ref={flatListRef}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onLayout={handleLayout}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
          />
          {isFetchingNextPage && (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          )}
        </InnerLayout>
      </KeyboardLayout>
      <ChatOptionModal visible={modalVisible.chat} onClose={() => handleModalClose('chat')} />
    </Layout>
  );
};

export const SuspendedChatRoomScreen = (props: ChatRoomScreenProps) => (
  <ErrorBoundary fallback={<></>}>
    <Suspense fallback={<></>}>
      <ChatRoomScreen {...props} />
    </Suspense>
  </ErrorBoundary>
);

export default SuspendedChatRoomScreen;
