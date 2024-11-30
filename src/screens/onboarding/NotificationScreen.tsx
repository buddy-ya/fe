import Button from "@/components/common/Button";
import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import MyText from "@/components/common/MyText";
import React from "react";
import { View, Image } from "react-native";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";
import { useOnboardingStore } from "@/store/onboarding";

export default function NotificationScreen({ navigation, route }) {
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();
  const isExistingMember = route.params?.isExistingMember;

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

      if (isExistingMember) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Tab" }],
        });
      } else {
        navigation.replace("OnboardingUniversitySelect");
      }
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
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t("notification.allow")}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
