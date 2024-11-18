import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import SelectItem from "@/components/onboarding/SelectItem";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import Label from "@/components/onboarding/Label";
import { useOnboardingStore } from "@/store/onboarding";

type Gender = "male" | "female" | "unknown" | null;

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();

  const handleNavigate = () => {
    updateOnboardingData({
      gender: selectedGender,
    });
    navigation.navigate("OnboardingName");
  };

  const GENDER_OPTIONS = [
    { id: "male", label: "gender.male" },
    { id: "female", label: "gender.female" },
    { id: "unknown", label: "gender.preferNotToSay" },
  ] as const;

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <View className="flex-1">
          <Heading>{t("gender.title")}</Heading>
          <HeadingDescription>{t("gender.title")}</HeadingDescription>
          <Label>{t("gender.label")}</Label>
          {GENDER_OPTIONS.map((item) => (
            <SelectItem
              key={item.id}
              selected={selectedGender === item.id}
              onPress={() => setSelectedGender(item.id)}
            >
              <Text className="text-base">{t(item.label)}</Text>
            </SelectItem>
          ))}
        </View>
        <Button onPress={handleNavigate} disabled={!selectedGender}>
          <Text className="text-white text-lg font-semibold">
            {t("common.next")}
          </Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
