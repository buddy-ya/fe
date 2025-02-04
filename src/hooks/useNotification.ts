import { useEffect, useState } from 'react';
import { NotificationRepository } from '@/api';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/utils';

export default function useNotification() {
  const [expoPushToken, setExpoPushToken] = useState('');

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
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return expoPushToken;
}
