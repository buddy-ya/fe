import React, { useEffect } from "react";
import { View, ActivityIndicator, Image } from "react-native";
import * as Font from "expo-font";
import { getAccessToken, removeTokens } from "@/utils/service/auth";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const [accessToken] = await Promise.all([
        getAccessToken(),
        loadFonts(),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
      if (accessToken) {
        navigation.navigate("Tab");
      } else {
        navigation.navigate("Onboarding", {
          screen: "OnboardingWelcome",
        });
      }
    } catch (error) {
      console.error("App initialization failed:", error);
    }
  };

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        "Pretendard-Thin": require("@assets/fonts/Pretendard-Thin.otf"),
        "Pretendard-ExtraLight": require("@assets/fonts/Pretendard-ExtraLight.otf"),
        "Pretendard-Light": require("@assets/fonts/Pretendard-Light.otf"),
        "Pretendard-Regular": require("@assets/fonts/Pretendard-Regular.otf"),
        "Pretendard-Medium": require("@assets/fonts/Pretendard-Medium.otf"),
        "Pretendard-SemiBold": require("@assets/fonts/Pretendard-SemiBold.otf"),
        "Pretendard-Bold": require("@assets/fonts/Pretendard-Bold.otf"),
        "Pretendard-ExtraBold": require("@assets/fonts/Pretendard-ExtraBold.otf"),
        "Pretendard-Black": require("@assets/fonts/Pretendard-Black.otf"),
      });
    } catch (error) {
      console.error("Font loading failed:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#00A176]">
      <Image source={require("@assets/splash.png")} width={203} height={206} />
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
