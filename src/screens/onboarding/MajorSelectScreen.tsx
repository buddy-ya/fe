import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import CustomBottomSheet from "@/components/common/CustomBottomSheet";
import { MAJOR_OPTIONS } from "@/utils/constants/majors";

export default function MajorSelectScreen({ navigation }) {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState("");
  const { t, i18n } = useTranslation("onboarding");
  const currentLang = i18n.language.startsWith("ko") ? "ko" : "en";

  const majorOptions = MAJOR_OPTIONS.map((major) => major[currentLang]);

  const getMajorLabel = () => {
    if (!selectedMajor) return t("major.placeholder");
    return selectedMajor;
  };

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingInterestSelect");
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading className="mt-8">{t("major.title")}</Heading>

        <TouchableOpacity
          onPress={() => setIsBottomSheetVisible(true)}
          className="mt-4 flex-row items-center justify-between px-4 py-3 border border-gray-200 rounded-xl"
        >
          <Text className="text-base">{getMajorLabel()}</Text>
          <ChevronDown size={20} color="black" />
        </TouchableOpacity>

        <Button
          type="circle"
          onPress={handleNavigateButton}
          disabled={!selectedMajor}
          className="absolute bottom-8 right-5"
        >
          <ChevronRight strokeWidth={2} size={32} color="white" />
        </Button>

        <CustomBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}
          options={majorOptions}
          selectedValue={selectedMajor}
          onSelect={setSelectedMajor}
          title={t("major.bottomSheetTitle")}
        />
      </InnerLayout>
    </Layout>
  );
}
