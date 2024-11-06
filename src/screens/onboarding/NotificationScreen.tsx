import Button from "@/components/common/Button";
import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import React from "react";
import { View, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";

export default function NotificationScreen({ navigation }) {
  const { t } = useTranslation("onboarding");

  const requestNotificationPermission = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        navigation.replace("OnboardingBuddyyaIdCard");
      } else {
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  return (
    <Layout>
      <InnerLayout>
        <Heading className="mt-20">{t("notification.title1")}</Heading>
        <Heading>{t("notification.title2")}</Heading>
        <HeadingDescription className="mt-5">
          {t("notification.description1")}
        </HeadingDescription>
        <HeadingDescription>
          {t("notification.description2")}
        </HeadingDescription>
        <View className="flex-1">
          <Image
            className="w-[344px] h-[344px]"
            source={require("@assets/images/onboarding/notification.png")}
          />
        </View>
        <Button
          className="w-full bottom-8"
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
