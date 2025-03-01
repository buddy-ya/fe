import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import {
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
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
import { useMessageStore, useModalStore, useUserStore, useToastStore } from '@/store';
import { ChatListResponse } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSuspenseQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { ImagePickerOptions } from 'expo-image-picker';
import { EllipsisVertical, ChevronLeft, Image } from 'lucide-react-native';
import ChatRepository from '@/api/ChatRepository';
import { Toast } from '@/components/common/Toast';

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 0.7,
  allowsMultipleSelection: true,
  selectionLimit: 3,
};

type ChatRoomScreenProps = {
  route: { params: { id: number } };
};

export const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList, 'ChatRoom'>>();
  const { t } = useTranslation('chat');
  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const CURRENT_USER_ID = useUserStore((state) => state.id);
  const { handleUpload } = useImageUpload({ options: IMAGE_PICKER_OPTIONS });
  const { text, messages, setMessage, handleChange, sendMessage } = useMessageStore();
  const { visible, icon, text: toastText, showToast, hideToast } = useToastStore();
  const flatListRef = useRef<FlatList<any>>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const BOTTOM_THRESHOLD = 200;
  const roomId = route.params.id;
  const queryClient = useQueryClient();

  // 상대방 나감 상태 (HTTP와 소켓에서 모두 업데이트)
  const [buddyExited, setBuddyExited] = useState(false);

  // 채팅방 기본 정보 조회 (roomData에 isBuddyExited 포함)
  const { data: roomData } = useSuspenseQuery({
    queryKey: ['room', roomId],
    queryFn: () => RoomRepository.get({ id: roomId }),
  });

  // HTTP로 받은 roomData에서 isBuddyExited가 true면 상태 갱신
  useEffect(() => {
    if (roomData?.isBuddyExited && !buddyExited) {
      setBuddyExited(true);
    }
  }, [roomData, buddyExited]);

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

  // 채팅 목록 반영
  useEffect(() => {
    if (chatData) {
      const newMessages = chatData.pages.flatMap((page) =>
        page.messages.map((chat) => ({
          id: chat.id,
          sender: chat.senderId === CURRENT_USER_ID ? 'me' : String(chat.senderId),
          content: chat.message,
          type: chat.type,
          createdDate: chat.createdDate,
        }))
      );
      setMessage(newMessages);
    }
  }, [chatData, setMessage, CURRENT_USER_ID]);

  // 채팅방 입장/퇴장
  const joinChatRoom = useCallback(async (roomId: number) => {
    try {
      await ChatSocketRepository.roomIn(roomId);
      console.log('채팅방 입장 성공');
    } catch (error) {
      console.error('채팅방 입장 실패', error);
    }
  }, []);

  const leaveChatRoom = useCallback(async () => {
    try {
      await ChatSocketRepository.roomBack(roomId);
      queryClient.invalidateQueries({ queryKey: ['roomList'] });
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
    // 상대방 나간 상태면 메시지 전송 불가
    if (buddyExited) return;
    sendMessage(roomId);
  }, [roomId, sendMessage, buddyExited]);

  // 길게 누르면 복사
  const handleMessageLongPress = useCallback(
    (messageContent: string) => {
      Clipboard.setString(messageContent);
      showToast(<Text>📋</Text>, '메시지가 복사되었습니다.');
    },
    [showToast]
  );

  // 프로필 이미지 클릭
  const handleProfilePress = useCallback(
    (senderId: string) => {
      navigation.navigate('Profile', { id: Number(senderId) });
    },
    [navigation]
  );

  // roomOut 이벤트 처리: 핸드셰이크는 이미 완료된 상태이므로 바로 콜백 등록
  useEffect(() => {
    ChatSocketRepository.setRoomOutHandler((data) => {
      console.log('ChatRoomScreen: roomOut 이벤트 발생', data);
      setBuddyExited(true);
    });
  }, []);

  // buddyExited가 true이면, 시스템 메시지를 추가 (중복 추가 방지)
  useEffect(() => {
    if (buddyExited) {
      const systemMsgExists = messages.some((m: Message) => m.type === 'SYSTEM');
      if (!systemMsgExists && roomData?.name) {
        setMessage([
          {
            id: Date.now(),
            sender: 'system',
            content: t('room.systemExit', { name: roomData.name }),
            type: 'SYSTEM',
            createdDate: new Date().toISOString(),
          },
          ...messages,
        ]);
      }
    }
  }, [buddyExited, messages, setMessage, roomData, t]);

  // 메시지 렌더링
  const renderMessageItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      // 시스템 메시지 렌더링
      if (item.type === 'SYSTEM') {
        return (
          <View className="my-7 items-center justify-center">
            <View className="rounded-lg bg-[#F4F4F4] px-3 py-2">
              <MyText className="text-xs text-[#999999]">{item.content}</MyText>
            </View>
          </View>
        );
      }
      // 일반 메시지 렌더링
      const prevItem = messages[index + 1];
      const nextItem = messages[index - 1];
      const isSameUser = (a: string, b: string) => a === b;
      const isLastMessageOfUser = nextItem ? !isSameUser(item.sender, nextItem.sender) : true;
      const timeChanged = prevItem
        ? (() => {
            const currentDate = new Date(item.createdDate);
            const prevDate = new Date(prevItem.createdDate);
            return (
              currentDate.getHours() !== prevDate.getHours() ||
              currentDate.getMinutes() !== prevDate.getMinutes()
            );
          })()
        : false;
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
          onLongPress={handleMessageLongPress}
          onProfilePress={handleProfilePress}
        />
      );
    },
    [messages, roomData, handleMessageLongPress, handleProfilePress]
  );

  // 무한 스크롤
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
            disabled={buddyExited}
            placeholder={
              buddyExited
                ? t('room.systemExit', { name: roomData?.name })
                : t('keyboard.placeholder')
            }
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
      <ChatOptionModal
        visible={modalVisible.chat}
        onClose={() => handleModalClose('chat')}
        roomId={roomId}
      />
      {visible && <Toast visible={visible} icon={icon!} text={toastText} onClose={hideToast} />}
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
