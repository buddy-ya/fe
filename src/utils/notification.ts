import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

console.log('Notifications module loaded!');

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
    token = (await Notifications.getExpoPushTokenAsync()).data; // 원래 코드로 복원
  } else {
    alert('Push notifications require a physical device.');
  }

  return token;
}
