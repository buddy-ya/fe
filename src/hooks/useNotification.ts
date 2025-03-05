import { useEffect, useState } from 'react';
import { NotificationRepository } from '@/api';
import { useUserStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/utils';

export default function useNotification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const update = useUserStore((state) => state.update);

  const prefix = Linking.createURL('/'); // path 앞부분

  const registerToken = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      setExpoPushToken(token);
      NotificationRepository.registerToken({ token });
    }
    return token;
  };

  useQuery({
    queryKey: ['notifications'],
    queryFn: registerToken,
  });

  useEffect(() => {
    const backgroundListener = Notifications.addNotificationResponseReceivedListener((response) => {
      // 🔥 푸시 알림의 데이터 가져오기
      const data = response.notification.request.content.data;
      console.log(data);

      if (data?.type === 'AUTHORIZATION') {
        if (data?.isCertificated) {
          update({ isCertificated: data?.isCertificated });
        }
      }
      if (data?.type === 'FEED')
        if (data?.feedId) {
          const deepLinkUrl = `${prefix}feeds/${data.feedId}`;
          Linking.openURL(deepLinkUrl);
        }
      if (data?.type === 'CHAT_REQUEST') {
        const deepLinkUrl = `${prefix}chatRequests`;
        Linking.openURL(deepLinkUrl);
      }
      if (data?.type === 'CHAT_ACCEPT') {
        if (data?.roomId) {
          const deepLinkUrl = `${prefix}chats/${data.roomId}`;
          Linking.openURL(deepLinkUrl);
        }
      }
      if (data?.type === 'CHAT') {
        if (data?.chatroomId) {
          const deepLinkUrl = `${prefix}chats/${data.chatroomId}`;
          Linking.openURL(deepLinkUrl);
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(backgroundListener);
    };
  }, []);

  return expoPushToken;
}
