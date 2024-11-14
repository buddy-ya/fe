import React, { useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import SearchInput from "@/components/common/SearchInput";
import MultiSelectItem from "@/components/common/MultiSelectItem";
import { LANGUAGE_OPTIONS } from "@/utils/constants/languages";

interface Language {
  en: string;
  ko: string;
}

export default function LanguageMultiSelectScreen({ navigation }) {
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation("onboarding");
  const MAX_SELECT = 5;
  const currentLang = i18n.language.startsWith("ko") ? "ko" : "en";

  const handleToggleSelect = (language: Language) => {
    setSelectedLanguages((prev) => {
      if (prev.some((l) => l.en === language.en)) {
        return prev.filter((l) => l.en !== language.en);
      }
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, language];
    });
  };

  const filteredOptions = LANGUAGE_OPTIONS.filter((option) =>
    option[currentLang].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingMajorSelect");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Layout showHeader onBack={() => navigation.goBack()}>
        <InnerLayout>
          <Heading className="mt-8">{t("language.multiSelect.title")}</Heading>
          <HeadingDescription>
            {t("language.multiSelect.description")}
          </HeadingDescription>
          <Text className="mt-3 text-textDescription">
            {t("language.multiSelect.maxSelect", { count: MAX_SELECT })}
          </Text>

          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("language.multiSelect.searchPlaceholder")}
            className=""
          />

          <MultiSelectItem
            options={filteredOptions}
            selectedValues={selectedLanguages}
            onToggleSelect={handleToggleSelect}
            maxSelect={MAX_SELECT}
            className=""
          />

          <Button
            type="box"
            onPress={handleNavigateButton}
            disabled={selectedLanguages.length === 0}
            className="flex-row items-center justify-center mt-5"
          >
            <View>
              <Text className="text-white text-base font-semibold">
                {t("language.multiSelect.submit")}
              </Text>
            </View>
            <View className="ml-1">
              <Text className="text-white text-base font-semibold">
                {selectedLanguages.length + "/" + MAX_SELECT}
              </Text>
            </View>
          </Button>
        </InnerLayout>
      </Layout>
    </TouchableWithoutFeedback>
  );
}
