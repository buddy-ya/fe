import { useEffect, useState } from 'react';
import { NotificationRepository } from '@/api';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/utils';

export default function useNotification() {
  const [expoPushToken, setExpoPushToken] = useState('');

  const prefix = Linking.createURL('/'); // path 앞부분

  const registerToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        NotificationRepository.registerToken({ token });
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    registerToken();
  }, []);

  useEffect(() => {
    const backgroundListener = Notifications.addNotificationResponseReceivedListener((response) => {
      // 🔥 푸시 알림의 데이터 가져오기
      const data = response.notification.request.content.data;
      if (data.feedId) {
        const deepLinkUrl = `${prefix}feeds/${data.feedId}`;
        Linking.openURL(deepLinkUrl);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(backgroundListener);
    };
  }, []);

  return expoPushToken;
}
