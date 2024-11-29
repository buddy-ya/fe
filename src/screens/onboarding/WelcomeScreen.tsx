import React, { useEffect } from "react";
import { View, Image, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import "@/../global.css";
import Button from "@/components/common/Button";
import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";
import MyText from "@/components/common/MyText";
import messaging from "@react-native-firebase/messaging";

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    const getFcmToken = async () => {
      if (Platform.OS === "ios") {
        try {
          // 1. 먼저 원격 알림 등록
          const isRegistered = await messaging()
            .isDeviceRegisteredForRemoteMessages;
          if (!isRegistered) {
            await messaging().registerDeviceForRemoteMessages();
          }

          // 2. APNS 권한 요청
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED;

          if (enabled) {
            // 3. FCM 토큰 받기
            const token = await messaging().getAPNSToken();
            console.log("APNS Token:", token);
            const fcmToken = await messaging().getToken();
            console.log("FCM Token:", fcmToken);
          }
        } catch (error) {
          console.error("FCM Token Error:", error);
        }
      }
    };

    getFcmToken();
  }, []);
  const { t } = useTranslation("onboarding");

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingPhone");
  };

  return (
    <Layout showHeader={false}>
      <InnerLayout>
        <View className="items-center mt-14">
          <Image
            source={require("@assets/images/onboarding/logo.png")}
            className="w-[225px] h-[65px]"
          />
        </View>
        <View className="mt-5">
          <MyText size="text-2xl" className="text-center">
            <MyText size="text-2xl" color="text-primary" className="font-bold">
              {t("intro.title-primary")}
            </MyText>
            {t("intro.title")}
          </MyText>
          <MyText size="text-2xl" className="text-center mt-2">
            {t("intro.subTitle")}
            <MyText size="text-2xl" color="text-primary" className="font-bold">
              {t("intro.subTitle-primary")}
            </MyText>
          </MyText>
        </View>
        <View className="flex-1 mt-14">
          <Image
            source={require("@assets/images/onboarding/han-gang.png")}
            className="w-full h-[344px]"
          />
        </View>
        <Button onPress={handleNavigateButton}>
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t("intro.button")}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
