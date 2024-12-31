import React, { useState } from "react";
import { Keyboard, View, TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import SearchInput from "@/components/common/SearchInput";
import SelectItem from "@/components/common/SelectItem";
import { LANGUAGES } from "@/utils/constants/languages";
import { useOnboardingStore } from "@/store/onboarding";
import MyText from "@/components/common/MyText";
import { updateLanguages } from "@/api/mypage/mypage";

interface Language {
  id: string;
}

export default function LanguageSelectScreen({ navigation, route }) {
  const { mode, initialLanguages, onComplete } = route.params || {};
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(
    initialLanguages?.map((id) => ({ id })) || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();
  const MAX_SELECT = 4;

  const handleSelect = (language: Language) => {
    setSelectedLanguages((prev) => {
      if (prev.some((l) => l.id === language.id)) {
        return prev.filter((l) => l.id !== language.id);
      }
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, language];
    });
  };

  const filteredOptions = LANGUAGES.filter((option) =>
    t(`languages:languages.${option.id}`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleNavigateButton = async () => {
    const languages = selectedLanguages.map((lang) => lang.id);
    if (mode === "edit") {
      await updateLanguages(languages);
      navigation.goBack();
    } else {
      updateOnboardingData({ languages });
      navigation.navigate("OnboardingMajorSelect");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Layout showHeader onBack={() => navigation.goBack()}>
        <InnerLayout>
          <Heading>{t("language.title")}</Heading>
          <HeadingDescription>
            {t("language.maxSelect", { count: MAX_SELECT })}
          </HeadingDescription>

          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("language.searchPlaceholder")}
          />

          <SelectItem
            options={filteredOptions}
            selectedValues={selectedLanguages}
            onSelect={handleSelect}
            maxSelect={MAX_SELECT}
            multiple={true}
            nameSpace="languages"
          />

          <Button
            type="box"
            onPress={handleNavigateButton}
            disabled={selectedLanguages.length === 0}
            className="flex-row items-center justify-center"
          >
            <View>
              <MyText
                size="text-base"
                color="text-white"
                className="font-semibold"
              >
                {t("common.selected")}
              </MyText>
            </View>
            <View className="ml-1">
              <MyText
                size="text-base"
                color="text-white"
                className="font-semibold"
              >
                {selectedLanguages.length}/{MAX_SELECT}
              </MyText>
            </View>
          </Button>
        </InnerLayout>
      </Layout>
    </TouchableWithoutFeedback>
  );
}
