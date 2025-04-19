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
import { API, ChatSocketRepository, RoomRepository, UserRepository } from '@/api';
import { InnerLayout, Input, KeyboardLayout, Layout, MessageItem, MyText } from '@/components';
import { useImageUpload, useRoomStateHandler } from '@/hooks';
import { Message } from '@/model';
import { ChatStackParamList } from '@/navigation/navigationRef';
import { getValidAccessToken } from '@/provider/AppInitializationProvider';
import { useMessageStore, useModalStore, useUserStore, useToastStore } from '@/store';
import { ChatListResponse } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { ImagePickerOptions } from 'expo-image-picker';
import { EllipsisVertical, ChevronLeft, Image } from 'lucide-react-native';
import ChatRepository from '@/api/ChatRepository';

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 0.5,
  selectionLimit: 1,
};

type ChatRoomScreenProps = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;

export const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const { t } = useTranslation('chat');
  // 전역 모달은 GlobalModalContainer에서 관리하므로, 여기서는 visible 관련 코드는 제거합니다.
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const CURRENT_USER_ID = useUserStore((state) => state.id);
  const { text, messages, setMessage, handleChange, sendMessage, sendImageMessage } =
    useMessageStore();
  const { text: toastText, showToast } = useToastStore();
  const flatListRef = useRef<FlatList<any>>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const roomId = route.params.id;
  const queryClient = useQueryClient();
  const [buddyExited, setBuddyExited] = useState(false);

  useRoomStateHandler(roomId);

  const { data: roomData } = useSuspenseQuery({
    queryKey: ['room', roomId],
    queryFn: () => RoomRepository.get({ id: roomId }),
  });

  useEffect(() => {
    if (roomData?.isBuddyExited && !buddyExited) {
      setBuddyExited(true);
    }
  }, [roomData, buddyExited]);

  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chats', roomId] as const,
    queryFn: ({ pageParam = 0 }) => ChatRepository.getChats({ roomId, page: pageParam, size: 15 }),
    getNextPageParam: (lastPage: ChatListResponse) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 0,
  });

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

  const joinChatRoom = useCallback(async (roomId: number) => {
    try {
      const validToken = await getValidAccessToken();
      API.defaults.headers.common['Authorization'] = `Bearer ${validToken}`;
      await ChatSocketRepository.initialize();
      await ChatSocketRepository.roomIn(roomId);
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

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  }, []);

  const handleLayout = useCallback(() => {
    if (scrollOffset < 200) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollOffset]);

  const onSubmit = useCallback(async () => {
    if (buddyExited) return;
    try {
      await sendMessage(roomId);
    } catch (error: any) {
      showToast(<Text>⚠️</Text>, t('toast.sendFailed'));
    }
  }, [roomId, sendMessage, buddyExited, showToast, t]);

  const handleMessageLongPress = useCallback(
    (messageContent: string) => {
      Clipboard.setString(messageContent);
      showToast(<Text>📋</Text>, t('toast.copySuccess'));
    },
    [showToast, t]
  );

  const handleProfilePress = useCallback(
    (senderId: string) => {
      navigation.navigate('Profile', {
        id: Number(senderId),
        showMatchingProfile: roomData.type === 'MATCHING',
      });
    },
    [navigation]
  );

  useEffect(() => {
    ChatSocketRepository.setRoomOutHandler((data) => {
      console.log('ChatRoomScreen: roomOut 이벤트 발생', data);
      setBuddyExited(true);
    });
  }, []);

  useEffect(() => {
    if (buddyExited && roomData?.name) {
      const systemMsgExists = messages.some((m: Message) => m.type === 'SYSTEM');
      if (!systemMsgExists) {
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

  const { handleUpload } = useImageUpload({ options: IMAGE_PICKER_OPTIONS });

  // const onAddImage = async () => {
  //   if (buddyExited) return;
  //   try {
  //     const selectedImages = await handleUpload();
  //     if (!selectedImages || selectedImages.length === 0) {
  //       return;
  //     }
  //     const file = selectedImages[0];
  //     showToast(<Text>⚠️</Text>, file.fileName);
  //     await sendImageMessage(roomId, file);
  //   } catch (error: any) {
  //     showToast(<Text>⚠️</Text>, t('toast.sendFailed'));
  //   }
  // };

  const renderMessageItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      if (item.type === 'SYSTEM') {
        return (
          <View className="my-7 items-center justify-center">
            <View className="rounded-lg bg-[#F4F4F4] px-3 py-2">
              <MyText className="text-xs text-[#999999]">{item.content}</MyText>
            </View>
          </View>
        );
      }
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

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleExit = async () => {
    await ChatSocketRepository.roomOut(roomId);
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoomList' }],
    });
  };

  if (!roomData || !chatData) return null;

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
        <TouchableOpacity onPress={() => handleProfilePress(String(roomData.buddyId))}>
          <MyText size="text-lg" className="font-semibold">
            {roomData.name}
          </MyText>
        </TouchableOpacity>
      }
      headerRight={
        <TouchableOpacity
          onPress={() =>
            handleModalOpen('chat', {
              roomId: roomId,
              buddyId: roomData.buddyId,
              roomType: roomData.type,
              onExit: handleExit,
            })
          }
        >
          <EllipsisVertical strokeWidth={2} size={24} color="#797979" />
        </TouchableOpacity>
      }
    >
      <KeyboardLayout
        footer={
          <View>
            <Input
              value={text}
              onChange={handleChange}
              onSubmit={onSubmit}
              disabled={buddyExited}
              maxLength={1000}
              placeholder={
                buddyExited
                  ? t('room.systemExit', { name: roomData?.name })
                  : t('keyboard.placeholder')
              }
            />
          </View>
        }
      >
        <InnerLayout className="px-[12px]">
          <FlatList
            data={messages}
            ListHeaderComponent={<View style={{ height: 20 }} />}
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
