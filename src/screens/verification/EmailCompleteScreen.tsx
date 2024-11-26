import React from "react";
import { View, Image } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import Button from "@/components/common/Button";

export default function StudentVerificationCompleteScreen({ navigation }) {
  const { t } = useTranslation("onboarding");

  const handleStartBuddya = () => {
    navigation.navigate("MainTab");
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <View className="flex-1 px-5">
        <View>
          <Heading>{t("verificationComplete.title")}</Heading>
          <HeadingDescription>
            {t("verificationComplete.description1")}
            {"\n"}
            {t("verificationComplete.description2")}
          </HeadingDescription>
        </View>

        <View className="flex-1 justify-center">
          <Image
            // source={require("@/assets/images/welcome.png")}
            className="w-full h-[200px]"
            resizeMode="contain"
          />
        </View>

        <Button onPress={handleStartBuddya} className="mb-8">
          {t("verificationComplete.start")}
        </Button>
      </View>
    </Layout>
  );
}
