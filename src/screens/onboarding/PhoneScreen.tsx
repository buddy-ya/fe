import React, { useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import InnerLayout from "@/components/common/InnerLayout";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { Lock } from "lucide-react-native";
import Label from "@/components/onboarding/Label";
import ErrorMessage from "@/components/onboarding/ErrorMessage";
import FooterLayout from "@/components/common/FooterLayout";
import { useMutation } from "@tanstack/react-query";
import { postPhoneVerification } from "@/api/auth/phone";
import { logError } from "@/utils/service/error";
import MyText from "@/components/common/MyText";

export default function PhoneScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const formattedPhone = phone.replace(/[^0-9]/g, "");

  const { mutate: sendVerification } = useMutation({
    mutationFn: postPhoneVerification,
    onSuccess: () => {
      navigation.navigate("OnboardingPhoneVerification", {
        phone: formatPhoneNumber(phone),
      });
    },
    onError: logError,
  });

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const checkStartWithValidPrefix = (phoneNumber: string) => {
    return phoneNumber.length > 2 && !phoneNumber.startsWith("010");
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
    if (match) {
      const groups = match.slice(1).filter(Boolean);
      return groups.join("-");
    }
    return phoneNumber;
  };

  const handlePhoneValidation = (phoneNumber: string) => {
    const isValidPhone = validatePhoneNumber(phoneNumber);
    setIsValid(isValidPhone);
    setShowError(checkStartWithValidPrefix(phoneNumber));
  };

  useEffect(() => {
    handlePhoneValidation(formattedPhone);
  }, [formattedPhone]);

  const handlePhoneChange = (text: string) => {
    const newValue = text.replace(/[^0-9]/g, "");
    if (newValue.length <= 11) {
      setPhone(newValue);
    }
  };

  const handleNavigateButton = () => {
    // sendVerification({ phoneNumber: formattedPhone });
    navigation.navigate("OnboardingPhoneVerification", {
      phone: formatPhoneNumber(phone),
    });
  };

  const footer = (
    <FooterLayout
      icon={<Lock strokeWidth={1} size={23} color={"#797979"} />}
      content={
        <MyText size="text-sm" color="text-textDescription" className="mx-3">
          {t("phone.footer")}
        </MyText>
      }
      onPress={handleNavigateButton}
      disabled={!isValid}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t("phone.title")}</Heading>
          <HeadingDescription>{t("phone.titleDescription")}</HeadingDescription>
          <Label>{t("phone.label")}</Label>
          <View>
            <View className="flex-row items-center mb-4">
              <View className="flex-row items-center mr-2 px-[14px] h-[52px] border border-border rounded-xl">
                <MyText size="text-xl" color="text-textDescription">
                  🇰🇷 +82
                </MyText>
              </View>
              <TextInput
                value={formatPhoneNumber(phone)}
                onChangeText={handlePhoneChange}
                keyboardType="number-pad"
                placeholder="010-1234-5678"
                className="px-[14px] text-[18px] text-text w-[172px] border border-border rounded-xl h-[52px]"
                placeholderTextColor="#DFDFDF"
                textAlignVertical="center"
                autoFocus
              />
            </View>
            {showError && <ErrorMessage>{t("phone.warning")}</ErrorMessage>}
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
