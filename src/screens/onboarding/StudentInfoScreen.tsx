import Button from "@/components/common/Button";
import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import React from "react";
import { View, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";

export default function StudentInfoScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const handleNavigate = () => {
    navigation.replace("OnboardingUniversitySelect");
  };
  return (
    <Layout>
      <InnerLayout>
        <Heading className="mt-20">{t("studentInfo.title1")}</Heading>
        <Heading>{t("studentInfo.title2")}</Heading>
        <HeadingDescription className="mt-5">
          {t("studentInfo.description1")}
        </HeadingDescription>
        <HeadingDescription>{t("studentInfo.description2")}</HeadingDescription>
        <View className="flex-1 mt-16">
          <Image
            className="w-[385px] h-[290px]"
            source={require("@assets/images/onboarding/id-card.png")}
          />
        </View>
        <Button
          className="absolute bottom-8 right-8"
          type="circle"
          onPress={handleNavigate}
        >
          <ChevronRight color={"white"} />
        </Button>
      </InnerLayout>
    </Layout>
  );
}
