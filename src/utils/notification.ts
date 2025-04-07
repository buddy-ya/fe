import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 알림을 화면에 표시
    shouldPlaySound: true, // 소리를 재생
    shouldSetBadge: true, // 배지 업데이트
  }),
});

Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.HIGH,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});

export async function registerForPushNotificationsAsync() {
  let token: string | null = null;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Push notifications require a physical device.');
  }

  return token;
}
