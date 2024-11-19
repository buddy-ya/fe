import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
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
import { useMutation } from "@tanstack/react-query";

import {
  PhoneVerifyResponse,
  postPhoneVerification,
  postPhoneVerifyCode,
} from "@/api/auth/phone";
import { saveTokens } from "@/utils/service/auth";
import ErrorMessage from "@/components/onboarding/ErrorMessage";
import { logError } from "@/utils/service/error";

export default function PhoneVerificationScreen({ navigation, route }) {
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();
  const [code, setCode] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const phoneNumber = route.params?.phone;
  const VERIFICATION_EXPIRE_SECONDS = 5;

  const formattedPhone = phoneNumber.replace(/-/g, "");

  const { timeLeft, isExpired, restart } = useTimer({
    seconds: VERIFICATION_EXPIRE_SECONDS,
    onExpire: () => {},
  });

  const { mutate: resendVerification } = useMutation({
    mutationFn: postPhoneVerification,
    onSuccess: () => {
      setCode("");
      restart();
      setVerificationError(false);
    },
    onError: (error) => {
      console.error("Resend verification error:", error);
    },
  });

  const { mutate: verifyCode } = useMutation({
    mutationFn: postPhoneVerifyCode,
    onSuccess: async (response: PhoneVerifyResponse) => {
      setVerificationError(false);
      updateOnboardingData({ phoneNumber: formattedPhone });

      if (response.status === "EXISTING_MEMBER") {
        await saveTokens(response.accessToken, response.refreshToken);
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "OnboardingNotification" }],
        });
      }
    },
    onError: (error) => {
      logError(error);
      setVerificationError(true);
      setCode("");
    },
  });

  const handleResend = () => {
    resendVerification({ phoneNumber: formattedPhone });
    setCode("");
    restart();
  };

  const handleNavigateButton = () => {
    // verifyCode({
    //   phoneNumber: formattedPhone,
    //   code,
    // });
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
      icon={<Send strokeWidth={1} size={23} color="#797979" />}
      content={<View className="mx-3">{renderTimerContent()}</View>}
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
          {verificationError && (
            <ErrorMessage className="mt-2">
              {t("verification.warning")}
            </ErrorMessage>
          )}
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
