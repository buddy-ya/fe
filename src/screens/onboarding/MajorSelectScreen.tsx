// screens/MajorSelectScreen.tsx
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import SelectItem from "@/components/common/SelectItem";
import { MAJORS } from "@/utils/constants/majors";
import type { MajorID } from "@/utils/constants/majors";
import { useOnboardingStore } from "@/store/onboarding";

interface Major {
  id: MajorID;
  icon: string;
}

export default function MajorSelectScreen({ navigation }) {
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const { t } = useTranslation(["onboarding", "majors"]);
  const { updateOnboardingData } = useOnboardingStore();
  const MAX_SELECT = 2;

  const handleSelect = (major: Major) => {
    setSelectedMajors((prev) => {
      if (prev.some((m) => m.id === major.id)) {
        return prev.filter((m) => m.id !== major.id);
      }
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, major];
    });
  };

  const handleNavigateButton = () => {
    updateOnboardingData({
      major: selectedMajors.map((major) => major.id),
    });
    navigation.navigate("OnboardingInterestSelect");
  };
  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading>{t("onboarding:major.title")}</Heading>
        {/* <HeadingDescription /> */}
        {/* <Text className="text-textDescription mt-2"></Text> */}
        <Text className="mt-3 text-textDescription">
          {t("language.maxSelect", { count: MAX_SELECT })}
        </Text>
        <SelectItem
          options={MAJORS}
          selectedValues={selectedMajors}
          onSelect={handleSelect}
          maxSelect={MAX_SELECT}
          multiple={true}
          nameSpace="majors"
        />

        <Button
          type="box"
          onPress={handleNavigateButton}
          disabled={selectedMajors.length === 0}
          className="flex-row items-center justify-center mt-5"
        >
          <View>
            <Text className="text-white text-base font-semibold">
              {t("onboarding:common.selected")}
            </Text>
          </View>
          <View className="ml-1">
            <Text className="text-white text-base font-semibold">
              {selectedMajors.length}/{MAX_SELECT}
            </Text>
          </View>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
