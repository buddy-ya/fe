import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import OTPInput from "@/components/common/OTPInput";
import LinkText from "@/components/common/LinkText";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import InnerLayout from "@/components/common/InnerLayout";

export default function PhoneVerificationScreen({ navigation, route }) {
  const { t } = useTranslation("onboarding");
  const [code, setCode] = useState("");
  const phoneNumber = route.params?.phone;

  const handleResend = () => {};

  const handleNavigateButton = () => {};

  const nextButton = (
    <Button
      type="circle"
      onPress={handleNavigateButton}
      disabled={code.length !== 6}
    >
      <Text className="text-white text-2xl">→</Text>
    </Button>
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout bottomButton={nextButton}>
        <InnerLayout>
          <Heading>{t("verification.title")}</Heading>
          <Text className="text-gray-500 ml-1 mb-8">{`+82 ${phoneNumber}`}</Text>
          <OTPInput value={code} onChange={setCode} length={6} />
          <View className="mt-8 items-center">
            <Text className="text-gray-500 mb-2">
              {t("verification.notReceived")}
            </Text>
            <LinkText onPress={handleResend}>
              {t("verification.resend")}
            </LinkText>
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
