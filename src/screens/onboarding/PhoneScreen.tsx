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
import { postPhoneVerification } from "@/api/auth/phone";
import MyText from "@/components/common/MyText";
import { formatPhone } from "@/utils/service/phone";
import { logError } from "@/utils/service/error";
import { getRefreshToken } from "@/utils/service/auth";

export default function PhoneScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setIsValid(formatPhone.validate(phone));
    setShowError(formatPhone.checkPrefix(phone));
  }, [phone]);

  const handlePhoneChange = (text: string) => {
    const newValue = formatPhone.removeHyphen(text);
    if (newValue.length <= 11) {
      setPhone(newValue);
    }
  };

  const handleNavigateButton = async () => {
    try {
      await postPhoneVerification(phone);
      navigation.navigate("OnboardingPhoneVerification", {
        phone: formatPhone.addHyphen(phone),
      });
    } catch (error) {
      logError(error);
    }
  };

  const footer = (
    <FooterLayout
      icon={<Lock strokeWidth={1} size={23} color="#797979" />}
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
                value={formatPhone.addHyphen(phone)}
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
