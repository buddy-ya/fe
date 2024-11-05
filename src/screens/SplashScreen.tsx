import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const isLoggedIn = await getLoginStatus();
      if (isLoggedIn) {
        navigation.replace("Main");
      } else {
        navigation.replace("Onboarding");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Splash</Text>
    </View>
  );
}

const getLoginStatus = async () => {
  return false;
};
