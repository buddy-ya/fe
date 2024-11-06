import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (token) {
        navigation.navigate("Main");
      } else {
        navigation.navigate("Onboarding", { screen: "OnboardingPhone" });
      }
    } catch (error) {
      console.error("App initialization failed:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        className="w-[100px] h-[123px]"
        source={require("@assets/images/splash.png")}
      />
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
