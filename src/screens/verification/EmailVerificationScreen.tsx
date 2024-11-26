import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import OTPInput from "@/components/common/OTPInput";
import LinkText from "@/components/common/LinkText";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import InnerLayout from "@/components/common/InnerLayout";
import { Send } from "lucide-react-native";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import FooterLayout from "@/components/common/FooterLayout";
import Label from "@/components/onboarding/Label";
import MyText from "@/components/common/MyText";
import ErrorMessage from "@/components/onboarding/ErrorMessage";
import { logError } from "@/utils/service/error";
import { verifyEmailCode, sendEmail } from "@/api/certification/certification";

export default function EmailVerificationScreen({ navigation, route }) {
  const { t } = useTranslation("certification");
  const [code, setCode] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const email = route.params?.email;
  const univName = route.params?.univName;

  const handleResend = async () => {
    try {
      await sendEmail({ email, univName });
      setCode("");
      setVerificationError(false);
    } catch (error) {
      logError(error);
    }
  };

  const handleNavigateButton = async () => {
    try {
      const { success } = await verifyEmailCode({
        email,
        univName,
        code,
      });
      if (success) {
        setVerificationError(false);
        navigation.navigate("EmailComplete");
      } else {
        setVerificationError(true);
        setCode("");
      }
    } catch (error) {
      logError(error);
      setVerificationError(true);
      setCode("");
    }
  };

  const renderFooterContent = () => {
    return (
      <View>
        <MyText size="text-sm" color="text-textDescription">
          {t("verification.checkSpam")}
        </MyText>
        <LinkText onPress={handleResend}>{t("verification.resend")}</LinkText>
      </View>
    );
  };

  const footer = (
    <FooterLayout
      icon={<Send strokeWidth={1} size={23} color="#797979" />}
      content={<View className="mx-3">{renderFooterContent()}</View>}
      onPress={handleNavigateButton}
      disabled={code.length !== 4}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t("verification.title")}</Heading>
          <HeadingDescription>
            {t("verification.titleDescription", { email })}
          </HeadingDescription>
          <Label>{t("verification.label")}</Label>
          <OTPInput value={code} onChange={setCode} length={4} />
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
