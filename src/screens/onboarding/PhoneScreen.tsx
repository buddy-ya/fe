import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "@/components/common/Button";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import InnerLayout from "@/components/common/InnerLayout";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { ChevronRight, Lock } from "lucide-react-native";
import KoreaLogo from "@assets/icons/korea.svg";

export default function PhoneScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const phoneRegex = /^010\d{8}$/;
    setIsValid(phoneRegex.test(phone));
  }, [phone]);

  const handlePhoneChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setPhone(numericValue);
  };

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingPhoneVerification", { phone });
  };

  const footer = (
    <View className="w-full absolute flex-row items-center justify-between px-4 bottom-4">
      <View className="flex-1 flex-row items-center mr-4">
        <Lock strokeWidth={1} color={"black"} />
        <Text className="text-sm mx-4">{t("phone.footer")}</Text>
      </View>
      <Button type="circle" onPress={handleNavigateButton} disabled={!isValid}>
        <ChevronRight strokeWidth={2} size={32} color={"white"} />
      </Button>
    </View>
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading className="mt-8">{t("phone.title")}</Heading>
          <HeadingDescription>{t("phone.titleDescription")}</HeadingDescription>
          <View className="mt-12 flex-row items-center">
            <View className="flex-row items-center mr-4 px-3 py-3 border rounded-lg border-gray-500">
              <KoreaLogo />
              <Text className="ml-2 text-xl">+82</Text>
            </View>
            <TextInput
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="number-pad"
              maxLength={11}
              placeholder={t("phone.placeholder")}
              className="px-4 py-3 w-[60%] text-xl tracking-wide border border-gray-500 rounded-xl"
              placeholderTextColor="#999"
              autoFocus
            />
          </View>
          <Text className="text-gray-400 text-[14px] ml-2 mt-4">
            {t("phone.description")}
          </Text>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
