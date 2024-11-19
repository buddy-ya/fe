import Button from "@/components/common/Button";
import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import React from "react";
import { View, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";
import { useOnboardingStore } from "@/store/onboarding";

export default function NotificationScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();

  const requestNotificationPermission = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      updateOnboardingData({
        isNotificationEnabled: finalStatus === "granted",
      });

      navigation.replace("OnboardingUniversitySelect");
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  return (
    <Layout preserveHeader>
      <InnerLayout>
        <Heading>{t("notification.title")}</Heading>
        <HeadingDescription>{t("notification.description")}</HeadingDescription>
        <View className="flex-1">
          <Image
            className="w-[344px] h-[344px]"
            source={require("@assets/images/onboarding/notification.png")}
          />
        </View>
        <Button
          className="w-full"
          type="box"
          onPress={requestNotificationPermission}
        >
          <Text className="text-white text-lg font-bold">
            {t("notification.allow")}
          </Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
