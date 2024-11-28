import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";

export const useFCMToken = () => {
  useEffect(() => {
    const getFcmToken = async () => {
      await messaging().requestPermission();
      const token = await messaging().getToken();
      console.log("FCM Token:", token);
    };

    getFcmToken();
  }, []);
};
