import React, { useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import SearchInput from "@/components/common/SearchInput";
import SelectItem from "@/components/common/SelectItem";
import { COUNTRIES } from "@/utils/constants/countries";

interface Country {
  id: string;
  en: string;
  ko: string;
  flag: string;
}

export default function CountrySelectScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation("onboarding");
  const currentLang = i18n.language.startsWith("ko") ? "ko" : "en";

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const filteredOptions = COUNTRIES.filter((option) =>
    option[currentLang].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingLanguageSelect");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Layout showHeader onBack={() => navigation.goBack()}>
        <InnerLayout>
          <Heading className="mt-8">{t("country.title")}</Heading>
          <HeadingDescription>{t("country.description")}</HeadingDescription>

          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("country.searchPlaceholder")}
          />

          <SelectItem
            options={filteredOptions}
            selectedValues={selectedCountry ? [selectedCountry] : []}
            onSelect={handleSelect}
            multiple={false}
          />

          <Button
            type="box"
            onPress={handleNavigateButton}
            disabled={!selectedCountry}
            className="flex-row items-center justify-center mt-5"
          >
            <Text className="text-white text-base font-semibold">
              {t("common.next")}
            </Text>
          </Button>
        </InnerLayout>
      </Layout>
    </TouchableWithoutFeedback>
  );
}
