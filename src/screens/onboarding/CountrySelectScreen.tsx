import React, { useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import SearchInput from "@/components/common/SearchInput";
import SelectItem from "@/components/common/SelectItem";
import { COUNTRIES } from "@/utils/constants/countries";
import { useOnboardingStore } from "@/store/onboarding";
import MyText from "@/components/common/MyText";

type CountryID = (typeof COUNTRIES)[number]["id"];

interface Country {
  id: CountryID;
  icon: string;
  name: string;
}

export default function CountrySelectScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const filteredOptions = COUNTRIES.filter((option) =>
    t(`countries:countries.${option.id}`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleNavigateButton = () => {
    if (selectedCountry) {
      updateOnboardingData({
        country: selectedCountry.id,
        isKorean: selectedCountry.id === "ko",
      });
      navigation.navigate("OnboardingLanguageSelect");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Layout showHeader onBack={() => navigation.goBack()}>
        <InnerLayout>
          <Heading>{t("country.title")}</Heading>
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
            nameSpace="countries"
          />

          <Button
            type="box"
            onPress={handleNavigateButton}
            disabled={!selectedCountry}
            className="flex-row items-center justify-center mt-5"
          >
            <MyText
              size="text-base"
              color="text-white"
              className="font-semibold"
            >
              {t("common.next")}
            </MyText>
          </Button>
        </InnerLayout>
      </Layout>
    </TouchableWithoutFeedback>
  );
}
