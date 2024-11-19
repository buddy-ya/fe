import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import SelectItem from "@/components/onboarding/SelectItem";
import SejongLogo from "@assets/icons/universities/sejong.svg";
import Label from "@/components/onboarding/Label";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { useOnboardingStore } from "@/store/onboarding";

export default function UniversitySelectScreen({ navigation }) {
  const [selected, setSelected] = useState(true);
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();

  const handleNavigateButton = () => {
    updateOnboardingData({
      university: "sju",
    });
    navigation.navigate("OnboardingGenderSelect");
  };

  return (
    <Layout preserveHeader>
      <InnerLayout>
        <View className="flex-1">
          <Heading>{t("universitySelect.title")}</Heading>
          <HeadingDescription>{t("universitySelect.title")}</HeadingDescription>
          <Label>{t("universitySelect.label")}</Label>
          <SelectItem selected={selected} disabled={true} onPress={() => {}}>
            <View className="flex-row items-center">
              <SejongLogo width={24} height={24} />
              <Text className="ml-4">
                {t("universitySelect.universities.sejong")}
              </Text>
            </View>
          </SelectItem>
        </View>
        <Button onPress={handleNavigateButton}>
          <Text className="text-white text-lg font-semibold">
            {t("common.next")}
          </Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
