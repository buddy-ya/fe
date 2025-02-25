import React, { useEffect, useCallback, useRef, useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import {
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  AppState,
  AppStateStatus,
} from 'react-native';
import { ChatSocketRepository, RoomRepository } from '@/api';
import {
  ChatOptionModal,
  InnerLayout,
  Input,
  KeyboardLayout,
  Layout,
  MessageItem,
  MyText,
} from '@/components';
import { useImageUpload, useRoomStateHandler } from '@/hooks';
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

export const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation('chat');
  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const CURRENT_USER_ID = useUserStore((state) => state.id);
  const { handleUpload } = useImageUpload({ options: IMAGE_PICKER_OPTIONS });
  const { text, messages, setMessage, handleChange, sendMessage } = useMessageStore();
  const flatListRef = useRef<FlatList<any>>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const BOTTOM_THRESHOLD = 200;
  const roomId = route.params.id;

  // 채팅방 기본 정보 조회
  const { data: roomData } = useSuspenseQuery({
    queryKey: ['room', roomId],
    queryFn: () => RoomRepository.get({ id: roomId }),
  });

  // 채팅 데이터 조회 (페이징 처리)
  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chats', roomId] as const,
    queryFn: ({ pageParam = 0 }) =>
      ChatRepository.getChats({ roomId: roomId, page: pageParam, size: 15 }),
    getNextPageParam: (lastPage: ChatListResponse) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 0,
  });

  // 서버에서 불러온 채팅 데이터를 상태에 설정
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

  // 채팅방 입장
  const joinChatRoom = useCallback(async (roomId: number) => {
    try {
      await ChatSocketRepository.roomIn(roomId);
      console.log('채팅방 입장 성공');
    } catch (error) {
      console.error('채팅방 입장 실패', error);
    }
  }, []);

  // 채팅방 퇴장
  const leaveChatRoom = useCallback(async () => {
    try {
      await ChatSocketRepository.roomBack(roomId);
      console.log('채팅방 나가기 성공');
    } catch (error) {
      console.error('채팅방 뒤로가기 실패', error);
    }
  }, [roomId]);

  useEffect(() => {
    joinChatRoom(roomId);
  }, [roomId, joinChatRoom]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', leaveChatRoom);
    return unsubscribe;
  }, [roomId, navigation, leaveChatRoom]);

  useRoomStateHandler(roomId);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  }, []);

  const handleLayout = useCallback(() => {
    if (scrollOffset < BOTTOM_THRESHOLD) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollOffset]);

  const onSubmit = useCallback(() => {
    sendMessage(roomId);
  }, [roomId, sendMessage]);

  return (
    <Layout
      showHeader
      isBackgroundWhite
      disableBottomSafeArea
      headerLeft={
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
            keyExtractor={(item) => item.id.toString()}
            inverted
            renderItem={({ item, index }) => (
              <MessageItem
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

export const SuspendedChatRoomScreen: React.FC<ChatRoomScreenProps> = (props) => (
  <ErrorBoundary fallback={<></>}>
    <Suspense fallback={<></>}>
      <ChatRoomScreen {...props} />
    </Suspense>
  </ErrorBoundary>
);

export default SuspendedChatRoomScreen;
