import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import Button from "@/components/common/Button";

export default function StudentIdCardCompleteScreen({ navigation }) {
  const { t } = useTranslation("");

  const handleNavigationButton = () => {
    navigation.popToTop(); // 또는 필요한 화면으로 이동
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <View className="flex-1 px-5">
        <Heading>{t("studentIdComplete.title")}</Heading>
        <HeadingDescription>
          {t("studentIdComplete.description1")}
          {t("studentIdComplete.description2")}
        </HeadingDescription>

        <View className="flex-1" />

        <Button onPress={handleNavigationButton}>
          {t("studentIdComplete.complete")}
        </Button>
      </View>
    </Layout>
  );
}
