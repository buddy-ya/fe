import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useUserStore } from '@/store';
import { MatchDTO } from '@/types';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { useMatchStore } from '@/store/useMatchStore';
import MatchRepository from '@/api/MatchRepository';
import { queryClient } from '@/api/queryClient';
import { registerForPushNotificationsAsync } from '@/utils';

export function getExpoToken() {
  return registerForPushNotificationsAsync();
}

export function useNotification() {
  const update = useUserStore((state) => state.update);
  const updateMatchData = useMatchStore((state) => state.updateMatchData);
  const prefix = Linking.createURL('/');

  const terminateDelay = Platform.OS === 'android' ? 1400 : 1200;
  const backgroundDelay = 500;
  const foregroundDelay = 200;

  const handleNotificationData = (data: any, delay: number) => {
    if (!data) return;

    if (data?.type === 'AUTHORIZATION') {
      const failDeepLinkUrl = `${prefix}verification/studentIdCard`;
      update({ isCertificated: data?.isCertificated, point: data?.point });
      if (data?.isCertificated === false) {
        setTimeout(() => Linking.openURL(failDeepLinkUrl), delay);
      }
    } else if (data?.type === 'FEED' && data?.feedId) {
      const deepLinkUrl = `${prefix}feeds/${data.feedId}`;
      setTimeout(() => Linking.openURL(deepLinkUrl), delay);
    } else if (data?.type === 'MATCH') {
      const deepLinkUrl = `${prefix}match`;
      setTimeout(() => Linking.openURL(deepLinkUrl), delay);
    } else if (data?.type === 'CHAT_REQUEST') {
      const deepLinkUrl = `${prefix}chatRequests`;
      setTimeout(() => Linking.openURL(deepLinkUrl), delay);
    } else if (data?.type === 'CHAT_ACCEPT' && data?.roomId) {
      const deepLinkUrl = `${prefix}chats/${data.roomId}`;
      setTimeout(() => Linking.openURL(deepLinkUrl), delay);
    } else if (data?.type === 'CHAT' && data?.chatroomId) {
      const deepLinkUrl = `${prefix}chats/${data.chatroomId}`;
      setTimeout(() => Linking.openURL(deepLinkUrl), delay);
    } else if (data?.type === 'POINT') {
      const deepLinkUrl = `${prefix}point`;
      setTimeout(() => Linking.openURL(deepLinkUrl), delay);
    }
  };

  const handleForegroundStateChange = async (data: any, delay: number) => {
    if (!data) return;

    if (data?.type === 'AUTHORIZATION') {
      update({ isCertificated: data?.isCertificated, point: data?.point });
    } else if (data?.type === 'MATCH') {
      updateMatchData(data as MatchDTO);
    } else if (data?.type === 'CHAT') {
      await queryClient.invalidateQueries({ queryKey: ['roomList'] });
    } else if (data?.type === 'POINT') {
      update({ point: data?.point });
    }
  };

  useEffect(() => {
    const checkInitialNotification = async () => {
      const lastResponse = await Notifications.getLastNotificationResponseAsync();

      if (lastResponse) {
        handleNotificationData(lastResponse.notification.request.content.data, terminateDelay);
      }
    };

    checkInitialNotification();

    const backgroundListener = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationData(response.notification.request.content.data, backgroundDelay);
    });

    const foregroundResponseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationData(response.notification.request.content.data, foregroundDelay);
      }
    );

    // 포그라운드 상태에서 알림이 수신되면(클릭 없이) 즉시 처리
    const foregroundReceivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        handleForegroundStateChange(notification.request.content.data, foregroundDelay);
      }
    );

    return () => {
      backgroundListener.remove();
      foregroundResponseListener.remove();
      foregroundReceivedListener.remove();
    };
  }, [update, prefix]);
}
