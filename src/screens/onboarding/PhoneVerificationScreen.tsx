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
import { ChevronRight, MoveRight, Send } from "lucide-react-native";
import HeadingDescription from "@/components/onboarding/HeadingDescription";

export default function PhoneVerificationScreen({ navigation, route }) {
  const { t } = useTranslation("onboarding");
  const [code, setCode] = useState("");
  const phoneNumber = route.params?.phone;

  const { timeLeft, isExpired, restart } = useTimer({
    seconds: 5,
    onExpire: () => {},
  });

  const handleResend = () => {
    restart();
    setCode("");
  };

  const handleNavigateButton = () => {
    navigation.navigate("#");
  };

  const renderTimerContent = () => {
    if (!isExpired) {
      return (
        <View>
          <Text className="text-gray-500 mb-1">
            {t("verification.notReceived")}
          </Text>
          <Text className="text-gray-500">{timeLeft}</Text>
        </View>
      );
    }

    return (
      <View>
        <Text className="text-gray-500 mb-1">{t("verification.expired")}</Text>
        <LinkText onPress={handleResend}>{t("verification.resend")}</LinkText>
      </View>
    );
  };

  const footer = (
    <View className="w-full absolute flex-row items-center justify-between px-4 bottom-4">
      <View className="flex-1 flex-row items-center mr-2">
        <Send strokeWidth={1} color={"black"} />
        <Text className="text-sm mx-4">{renderTimerContent()}</Text>
      </View>
      <Button
        type="circle"
        onPress={handleNavigateButton}
        disabled={code.length !== 6 || isExpired}
      >
        <ChevronRight strokeWidth={2} size={32} color={"white"} />
        {/* <MoveRight strokeWidth={3} size={24} color={"white"} /> */}
      </Button>
    </View>
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t("verification.title")}</Heading>
          <HeadingDescription className="mb-12">
            {`${phoneNumber}으로 전송된 코드를 입력하세요.`}
          </HeadingDescription>
          <OTPInput value={code} onChange={setCode} length={6} />
          {/* <View className="mt-12 items-center">{renderTimerContent()}</View> */}
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
