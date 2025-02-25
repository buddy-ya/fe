import React, { useEffect, useCallback, useRef, useState } from 'react';
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
import { Message } from '@/model';
import { ChatStackParamList } from '@/navigation/navigationRef';
import { useMessageStore, useModalStore, useUserStore } from '@/store';
import { ChatListResponse } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

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

  // 서버에서 불러온 채팅 데이터를 상태에 설정 (서버 생성시간 사용)
  useEffect(() => {
    if (chatData) {
      const newMessages = chatData.pages.flatMap((page) =>
        page.messages.map((chat) => ({
          id: chat.id,
          sender: chat.senderId === CURRENT_USER_ID ? 'me' : String(chat.senderId),
          content: chat.message,
          type: chat.type,
          createdDate: chat.createdDate, // 서버에서 받은 생성시간
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
      queryClient.invalidateQueries({ queryKey: ['roomList'] });
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

  const renderMessageItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const prevItem = messages[index + 1]; // inverted: index+1이 이전 메시지
      const nextItem = messages[index - 1];

      const isSameUser = (a: string, b: string) => a === b;

      // 그룹 내 마지막 메시지이면 항상 시간 라벨 표시
      const isLastMessageOfUser = nextItem ? !isSameUser(item.sender, nextItem.sender) : true;

      // 이전 메시지가 있는 경우에만 시간 변경 여부 체크
      const timeChanged = prevItem
        ? (() => {
            const currentDate = new Date(item.createdDate);
            const prevDate = new Date(prevItem.createdDate);
            const diffSeconds = Math.abs(currentDate.getTime() - prevDate.getTime()) / 1000;
            return (
              currentDate.getHours() !== prevDate.getHours() ||
              currentDate.getMinutes() !== prevDate.getMinutes()
            );
          })()
        : false;

      // 기본: 유저의 마지막 메시지에는 항상 시간 라벨, 그 외에는 시간 변경 시에만 라벨 표시
      const showTimeLabel = isLastMessageOfUser || timeChanged;

      const isFirstMessage = !prevItem || !isSameUser(prevItem.sender, item.sender);

      return (
        <MessageItem
          message={item}
          roomData={roomData}
          isFirstMessage={isFirstMessage}
          showTimeLabel={showTimeLabel}
          isLastMessageOfUser={isLastMessageOfUser}
          isCurrentUser={item.sender === 'me'}
          shouldShowProfile={item.sender !== 'me'}
        />
      );
    },
    [messages, roomData]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        <InnerLayout className="px-[12px]">
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            inverted
            renderItem={renderMessageItem}
            ref={flatListRef}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onLayout={handleLayout}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
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
    <React.Suspense fallback={<></>}>
      <ChatRoomScreen {...props} />
    </React.Suspense>
  </ErrorBoundary>
);

export default SuspendedChatRoomScreen;
