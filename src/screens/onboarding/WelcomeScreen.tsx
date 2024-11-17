import React from "react";
import { Text, View, Image } from "react-native";
import { useTranslation } from "react-i18next";
import "@/../global.css";
import Button from "@/components/common/Button";
import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation("onboarding");

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingPhone");
  };

  return (
    <Layout>
      <InnerLayout>
        <View className="items-center mt-14">
          <Image
            source={require("@assets/images/onboarding/logo.png")}
            className="w-[225px] h-[65px]"
          />
        </View>
        <View className="mt-5">
          <Text className="text-center text-2xl">
            <Text className="text-primary font-bold">
              {t("intro.title-primary")}
            </Text>
            {t("intro.title")}
          </Text>
          <Text className="text-center mt-2 text-2xl">
            {t("intro.subTitle")}
            <Text className="text-primary font-bold">
              {t("intro.subTitle-primary")}
            </Text>
          </Text>
        </View>
        <View className="flex-1 mt-14">
          <Image
            source={require("@assets/images/onboarding/han-gang.png")}
            className="w-full h-[344px]"
          />
        </View>
        <Button onPress={handleNavigateButton}>
          <Text className="text-white text-lg font-bold">
            {t("intro.button")}
          </Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
