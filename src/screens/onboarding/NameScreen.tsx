import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { IdCard } from "lucide-react-native";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import ErrorMessage from "@/components/onboarding/ErrorMessage";
import { useOnboardingStore } from "@/store/onboarding";
import Label from "@/components/onboarding/Label";
import FooterLayout from "@/components/common/FooterLayout";

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 15;

export default function NameScreen({ navigation }) {
  const [name, setName] = useState("");
  const [isNonEnglish, setIsNonEnglish] = useState(false);
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();

  const handleNameChange = (text) => {
    setName(text);
    setIsNonEnglish(/[^\x00-\x7F\s]/.test(text));
  };

  const nameLength = name.trim().length;
  const isValidName =
    nameLength >= MIN_NAME_LENGTH &&
    nameLength <= MAX_NAME_LENGTH &&
    !isNonEnglish;
  const isInvalidLength =
    nameLength > 0 &&
    (nameLength < MIN_NAME_LENGTH || nameLength > MAX_NAME_LENGTH);

  const isWarning = isNonEnglish || isInvalidLength;

  const handleNavigation = () => {
    updateOnboardingData({
      name: name.trim(),
    });
    navigation.navigate("OnboardingCountrySelect");
  };

  const footer = (
    <FooterLayout
      icon={<IdCard strokeWidth={1} size={28} color="#797979" />}
      content={
        <Text className="text-sm text-textDescription mx-3">
          {t("name.footer")}
        </Text>
      }
      onPress={handleNavigation}
      disabled={!isValidName}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t("name.title")}</Heading>
          <HeadingDescription>{t("name.description")}</HeadingDescription>
          <Label>{t("name.label")}</Label>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder={t("name.placeholder")}
            className={`px-4 py-3 w-[262px] h-[50px] text-[18px] text-text tracking-wide border border-inputBorder rounded-xl mb-4`}
            keyboardType="ascii-capable"
            placeholderTextColor="placeholderPrimary"
            autoFocus
          />
          {isNonEnglish && <ErrorMessage>{t("name.warning")}</ErrorMessage>}
          {isInvalidLength && (
            <ErrorMessage>
              {t("name.warningLength", {
                min: MIN_NAME_LENGTH,
                max: MAX_NAME_LENGTH,
              })}
            </ErrorMessage>
          )}
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
