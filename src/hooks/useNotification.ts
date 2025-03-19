import { useEffect } from 'react';
import { NotificationRepository } from '@/api';
import { useUserStore } from '@/store';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/utils';

export async function getExpoToken() {
  const token = await registerForPushNotificationsAsync();
  return token;
}

export function useNotification() {
  const update = useUserStore((state) => state.update);
  const prefix = Linking.createURL('/');

  useEffect(() => {
    const backgroundListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'AUTHORIZATION') {
        if (data?.isCertificated) {
          update({ isCertificated: data?.isCertificated });
        }
      }
      if (data?.type === 'FEED' && data?.feedId) {
        const deepLinkUrl = `${prefix}feeds/${data.feedId}`;
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
    });

    return () => {
      Notifications.removeNotificationSubscription(backgroundListener);
    };
  }, [update, prefix]);
}
