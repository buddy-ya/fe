import React, { useState } from "react";
import { View } from "react-native";
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
import MyText from "@/components/common/MyText";
import { formatPhone } from "@/utils/service/phone";
import {
  PhoneVerifyResponse,
  postPhoneVerification,
  postPhoneVerifyCode,
} from "@/api/auth/phone";
import { saveTokens } from "@/utils/service/auth";
import ErrorMessage from "@/components/onboarding/ErrorMessage";
import { logError } from "@/utils/service/error";

const VERIFICATION_EXPIRE_SECONDS = 10;

export default function PhoneVerificationScreen({ navigation, route }) {
  const { t } = useTranslation("onboarding");
  const { updateOnboardingData } = useOnboardingStore();
  const [code, setCode] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const phone = route.params?.phone;
  const plainPhoneNumber = formatPhone.removeHyphen(phone);

  const { timeLeft, isExpired, restart } = useTimer({
    seconds: VERIFICATION_EXPIRE_SECONDS,
    onExpire: () => {},
  });

  const resetVerification = () => {
    setCode("");
    restart();
    setVerificationError(false);
  };

  const { mutate: resendVerification } = useMutation({
    mutationFn: postPhoneVerification,
    onSuccess: resetVerification,
    onError: logError,
  });

  const { mutate: verifyCode } = useMutation({
    mutationFn: postPhoneVerifyCode,
    onSuccess: async (response: PhoneVerifyResponse) => {
      setVerificationError(false);
      updateOnboardingData({ phoneNumber: plainPhoneNumber });
      if (response.status === "EXISTING_MEMBER") {
        await saveTokens(response.accessToken, response.refreshToken);
      }
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "OnboardingNotification",
            params: {
              isExistingMember: response.status === "EXISTING_MEMBER",
            },
          },
        ],
      });
    },
    onError: (error) => {
      logError(error);
      setVerificationError(true);
      setCode("");
    },
  });

  const handleResend = () => {
    resendVerification({ phoneNumber: plainPhoneNumber });
  };

  const handleNavigateButton = () => {
    verifyCode({
      phoneNumber: plainPhoneNumber,
      code,
    });
  };

  const renderTimerContent = () => {
    if (!isExpired) {
      return (
        <View>
          <MyText size="text-sm" color="text-textDescription">
            {t("verification.notReceived")}
          </MyText>
          <MyText size="text-sm" color="text-textDescription">
            {timeLeft}
          </MyText>
        </View>
      );
    }

    return (
      <View>
        <MyText size="text-sm" color="text-textDescription">
          {t("verification.expired")}
        </MyText>
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
            {t("verification.titleDescription", { phoneNumber: phone })}
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
