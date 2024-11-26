import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import Button from "@/components/common/Button";

export default function StudentIdCompleteScreen({ navigation }) {
  const { t } = useTranslation("onboarding");

  const handleComplete = () => {
    navigation.popToTop(); // 또는 필요한 화면으로 이동
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <View className="flex-1 px-5">
        <Heading>{t("studentIdComplete.title")}</Heading>
        <HeadingDescription>
          {t("studentIdComplete.description1")}
          {"\n"}
          {t("studentIdComplete.description2")}
        </HeadingDescription>

        <View className="flex-1" />

        <Button onPress={handleComplete} className="mb-8">
          {t("studentIdComplete.complete")}
        </Button>
      </View>
    </Layout>
  );
}
