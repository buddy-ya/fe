import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useUserStore } from '@/store';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/utils';

export function getExpoToken() {
  return registerForPushNotificationsAsync();
}

export function useNotification() {
  const update = useUserStore((state) => state.update);
  const prefix = Linking.createURL('/');

  const terminateDelay = Platform.OS === 'android' ? 1400 : 700;
  const backgroundDelay = 400;
  const foregroundDelay = 200;

  const handleNotificationData = (data: any, delay: number) => {
    if (!data) return;

    if (data?.type === 'AUTHORIZATION') {
      const failDeepLinkUrl = `${prefix}verification/studentIdCard`;
      update({ isCertificated: data?.isCertificated });
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

    const foregroundListener = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationData(response.notification.request.content.data, foregroundDelay);
    });

    return () => {
      Notifications.removeNotificationSubscription(backgroundListener);
      Notifications.removeNotificationSubscription(foregroundListener);
    };
  }, [update, prefix]);
}
