import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Heading from "@/components/onboarding/Heading";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { Mail } from "lucide-react-native";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import ErrorMessage from "@/components/onboarding/ErrorMessage";
import { useOnboardingStore } from "@/store/onboarding";
import Label from "@/components/onboarding/Label";
import FooterLayout from "@/components/common/FooterLayout";
import MyText from "@/components/common/MyText";
import { sendEmail } from "@/api/certification/certification";

const EMAIL_REGEX = /^[A-Za-z0-9]+$/;

export default function EmailScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const { t } = useTranslation("certification");

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const isValidEmail = email.length > 0 && EMAIL_REGEX.test(email);

  const handleNavigation = async () => {
    const fullEmail = email + "@sju.ac.kr";
    const univName = "세종대학교";
    const requestBody = {
      email: fullEmail,
      univName,
    };
    await sendEmail(requestBody);
    navigation.navigate("EmailVerificationCode", {
      email: fullEmail,
      univName,
    });
  };

  const footer = (
    <FooterLayout
      icon={<Mail strokeWidth={1} size={24} color="#797979" />}
      content={
        <MyText size="text-sm" color="text-textDescription" className="mx-3">
          {t("email.footer")}
        </MyText>
      }
      onPress={handleNavigation}
      disabled={!isValidEmail}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t("email.title")}</Heading>
          <HeadingDescription>{t("email.description")}</HeadingDescription>
          <Label>{t("email.label")}</Label>
          <View>
            <View className="flex-row items-center mb-4">
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                placeholder={t("email.placeholder")}
                className="px-4 py-3 flex-1 text-[18px] text-text border border-inputBorder rounded-xl h-[50px]"
                keyboardType="email-address"
                placeholderTextColor="#DFDFDF"
                autoFocus
              />
              <View className="ml-2 px-4 py-3 h-[50px] border border-inputBorder rounded-xl justify-center">
                <MyText size="text-lg" color="text-textDescription">
                  {t(`email.domain.${"sju"}`)}
                </MyText>
              </View>
            </View>
            {email.length > 0 && !isValidEmail && (
              <ErrorMessage>{t("email.warning")}</ErrorMessage>
            )}
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
