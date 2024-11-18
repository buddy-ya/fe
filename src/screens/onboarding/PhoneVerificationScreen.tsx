import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import OTPInput from "@/components/common/OTPInput";
import LinkText from "@/components/common/LinkText";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import InnerLayout from "@/components/common/InnerLayout";
import useTimer from "@/hooks/useTimer";
import { Send } from "lucide-react-native";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import FooterLayout from "@/components/common/FooterLayout";
import Label from "@/components/onboarding/Label";
import { useOnboardingStore } from "@/store/onboarding";

export default function PhoneVerificationScreen({ navigation, route }) {
  const { t } = useTranslation("onboarding");
  const [code, setCode] = useState("");
  const phoneNumber = route.params?.phone;
  const { timeLeft, isExpired, restart } = useTimer({
    seconds: 60 * 3,
    onExpire: () => {},
  });

  const { updateOnboardingData } = useOnboardingStore();

  const handleResend = () => {
    restart();
    setCode("");
  };

  const handleNavigateButton = () => {
    updateOnboardingData({
      phoneNumber: phoneNumber.replace(/-/g, ""),
    });

    navigation.reset({
      index: 0,
      routes: [{ name: "OnboardingNotification" }],
    });
  };

  const renderTimerContent = () => {
    if (!isExpired) {
      return (
        <View>
          <Text className="text-textDescription text-sm">
            {t("verification.notReceived")}
          </Text>
          <Text className="text-textDescription text-sm">{timeLeft}</Text>
        </View>
      );
    }

    return (
      <View>
        <Text className="text-textDescription text-sm">
          {t("verification.expired")}
        </Text>
        <LinkText onPress={handleResend}>{t("verification.resend")}</LinkText>
      </View>
    );
  };

  const footer = (
    <FooterLayout
      icon={<Send strokeWidth={1} width={20} height={20} color="black" />}
      content={
        <Text className="text-sm text-textDescription mx-3">
          {renderTimerContent()}
        </Text>
      }
      onPress={handleNavigateButton}
      disabled={code.length !== 6 || isExpired}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t("verification.title")}</Heading>
          <HeadingDescription>
            {t("verification.titleDescription", { phoneNumber })}
          </HeadingDescription>
          <Label>{t("verification.label")}</Label>
          <OTPInput value={code} onChange={setCode} length={6} />
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
