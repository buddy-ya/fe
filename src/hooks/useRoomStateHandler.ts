import { useEffect, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { ChatSocketRepository } from '@/api';
import { useQueryClient } from '@tanstack/react-query';

export const useRoomStateHandler = (roomId: number) => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const queryClient = useQueryClient();

  const joinChatRoom = useCallback(async () => {
    try {
      queryClient.invalidateQueries({ queryKey: ['chats', roomId] });
      await ChatSocketRepository.roomIn(roomId);
      console.log('roomIn 호출(채팅방 입장 성공)');
    } catch (error) {
      console.error('roomIn 호출 실패', error);
    }
  }, [roomId]);

  const leaveChatRoom = useCallback(async () => {
    try {
      await ChatSocketRepository.roomBack(roomId);
      console.log('roomBack 호출(채팅방 퇴장 성공)');
    } catch (error) {
      console.error('roomBack 호출 실패', error);
    }
  }, [roomId]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appState === 'active' && nextAppState !== 'active') {
        leaveChatRoom();
      } else if (appState !== 'active' && nextAppState === 'active') {
        joinChatRoom();
      }
      setAppState(nextAppState);
    },
    [appState, joinChatRoom, leaveChatRoom]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);
};
