import React from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import "@/../global.css";

export default function WelcomeScreen() {
  const { t } = useTranslation("onboarding");

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
            <Text className="text-primary font-bold">버디야</Text>
            에서 만나는
          </Text>
          <Text className="text-center mt-2 text-2xl">
            즐거운 대학생활의{" "}
            <Text className="text-primary font-bold">버디</Text>
          </Text>
        </View>
        <View className="mt-14 mb-[47px]">
          <Image
            source={require("@assets/images/onboarding/han-gang.png")}
            className="w-full h-[344px]"
          />
        </View>
        <TouchableOpacity className="py-5 items-center bg-primary rounded-[20px]">
          <Text className="text-white text-base text-[16px] font-semibold">
            전화번호로 시작하기
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
