import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "@/components/common/Button";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import InnerLayout from "@/components/common/InnerLayout";

export default function PhoneScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const phoneRegex = /^[0-9]{11}$/;
    setIsValid(phoneRegex.test(phone));
  }, [phone]);

  const handlePhoneChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setPhone(numericValue);
  };

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingPhoneVerification", { phone });
  };

  const nextButton = (
    <Button type="circle" onPress={handleNavigateButton} disabled={!isValid}>
      <Text className="text-white text-2xl">→</Text>
    </Button>
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout bottomButton={nextButton}>
        <InnerLayout>
          <Heading>{t("phone.title")}</Heading>
          <TextInput
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="number-pad"
            maxLength={11}
            placeholder={t("phone.placeholder")}
            className="px-6 py-4 w-[70%] text-xl tracking-wide border border-gray-400 rounded-xl"
            placeholderTextColor="#999"
            autoFocus
          />

          <Text className="text-gray-400 text-[14px] ml-2 mt-4">
            {t("phone.description")}
          </Text>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
