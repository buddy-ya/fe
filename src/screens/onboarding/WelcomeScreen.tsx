import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import "@/../global.css";

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation("onboarding");

  const handleButton = () => {
    navigation.navigate("OnboardingPhone");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <View className="items-center mt-[60px]">
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
        <View className="mt-14">
          <Image
            source={require("@assets/images/onboarding/han-gang.png")}
            className="w-full h-[344px]"
          />
        </View>
        <TouchableOpacity
          className="mt-16 py-5 items-center bg-primary rounded-[20px]"
          onPress={handleButton}
        >
          <Text className="text-white text-lg font-bold">
            {t("intro.button")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
