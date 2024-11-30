import Button from "@/components/common/Button";
import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import React from "react";
import { Text, View, Image } from "react-native";
import { useTranslation } from "react-i18next";

export default function StudentInfoScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const handleNavigate = () => {
    navigation.replace("OnboardingUniversitySelect");
  };
  return (
    <Layout>
      <InnerLayout>
        <Heading>{t("studentInfo.title")}</Heading>
        <HeadingDescription>{t("studentInfo.description")}</HeadingDescription>
        <View className="flex-1">
          <Image
            className="w-[385px] h-[290px]"
            source={require("@assets/images/onboarding/id-card.png")}
          />
        </View>
        <Button onPress={handleNavigate}>
          <Text className="text-white text-lg font-semibold">
            {t("common.next")}
          </Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
