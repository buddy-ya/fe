import { useEffect } from 'react';
import { useUserStore } from '@/store';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { useMatchStore } from '@/store/useMatchStore';
import { registerForPushNotificationsAsync } from '@/utils';

export function getExpoToken() {
  return registerForPushNotificationsAsync();
}

export function useNotification() {
  const update = useUserStore((state) => state.update);
  const updateMatchData = useMatchStore((state) => state.updateMatchData);
  const prefix = Linking.createURL('/');

  useEffect(() => {
    const checkInitialNotification = async () => {
      const lastResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastResponse) {
        const data = lastResponse.notification.request.content.data;
        if (data?.type === 'AUTHORIZATION') {
          const failDeepLinkUrl = `${prefix}verification/studentIdCard`;
          update({ isCertificated: data?.isCertificated });
          if (data?.isCertificated == false) {
            setTimeout(() => Linking.openURL(failDeepLinkUrl), 100);
          }
        }
        if (data?.type === 'FEED' && data?.feedId) {
          const deepLinkUrl = `${prefix}feeds/${data.feedId}`;
          setTimeout(() => Linking.openURL(deepLinkUrl), 100);
        }
        if (data?.type === 'MATCH') {
          const deepLinkUrl = `${prefix}match`;
          setTimeout(() => Linking.openURL(deepLinkUrl), 100);
        }
        if (data?.type === 'CHAT_REQUEST') {
          const deepLinkUrl = `${prefix}chatRequests`;
          setTimeout(() => Linking.openURL(deepLinkUrl), 100);
        }
        if (data?.type === 'CHAT_ACCEPT' && data?.roomId) {
          const deepLinkUrl = `${prefix}chats/${data.roomId}`;
          setTimeout(() => Linking.openURL(deepLinkUrl), 100);
        }
        if (data?.type === 'CHAT' && data?.chatroomId) {
          const deepLinkUrl = `${prefix}chats/${data.chatroomId}`;
          setTimeout(() => Linking.openURL(deepLinkUrl), 100);
        }
        if (data?.type === 'POINT') {
          const deepLinkUrl = `${prefix}point`;
          setTimeout(() => Linking.openURL(deepLinkUrl), 100);
        }
      }
    };

    checkInitialNotification();

    // 앱이 포그라운드 또는 백그라운드일 때의 알림 클릭 처리
    const backgroundListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      if (data?.type === 'AUTHORIZATION') {
        const failDeepLinkUrl = `${prefix}verification/studentIdCard`;
        update({ isCertificated: data?.isCertificated });
        if (data?.isCertificated == false) {
          setTimeout(() => Linking.openURL(failDeepLinkUrl), 100);
        }
      }
      if (data?.type === 'FEED' && data?.feedId) {
        const deepLinkUrl = `${prefix}feeds/${data.feedId}`;
        setTimeout(() => Linking.openURL(deepLinkUrl), 100);
      }
      if (data?.type === 'MATCH') {
        const deepLinkUrl = `${prefix}match`;
        setTimeout(() => Linking.openURL(deepLinkUrl), 100);
      }
      if (data?.type === 'CHAT_REQUEST') {
        const deepLinkUrl = `${prefix}chatRequests`;
        setTimeout(() => Linking.openURL(deepLinkUrl), 100);
      }
      if (data?.type === 'CHAT_ACCEPT' && data?.roomId) {
        const deepLinkUrl = `${prefix}chats/${data.roomId}`;
        setTimeout(() => Linking.openURL(deepLinkUrl), 100);
      }
      if (data?.type === 'CHAT' && data?.chatroomId) {
        const deepLinkUrl = `${prefix}chats/${data.chatroomId}`;
        setTimeout(() => Linking.openURL(deepLinkUrl), 100);
      }
      if (data?.type === 'POINT') {
        const deepLinkUrl = `${prefix}point`;
        setTimeout(() => Linking.openURL(deepLinkUrl), 100);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(backgroundListener);
    };
  }, [update, prefix]);
}
