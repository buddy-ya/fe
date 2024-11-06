import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import Button from "@/components/common/Button";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";

export default function PhoneScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const phoneRegex = /^[0-9]{11}$/;
    setIsValid(phoneRegex.test(phone));
  }, [phone]);

  const handlePhoneChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setPhone(numericValue);
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <View className="flex-1 px-5">
          <Heading>{t("phone.title")}</Heading>
          <View className="w-[80%] p-4 flex-row items-center border rounded-lg border-gray-200 ">
            <View className="w-[24px] h-[24px] border mr-4"></View>
            <TextInput
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="number-pad"
              maxLength={11}
              placeholder={t("phone.placeholder")}
              className="text-lg tracking-wide"
              placeholderTextColor="#999"
              autoFocus
            />
          </View>

          <Text className="text-gray-400 text-sm mt-2">
            {t("phone.description")}
          </Text>

          <Button
            type="circle"
            onPress={() =>
              navigation.navigate("OnboardingVerification", { phone })
            }
            disabled={!isValid}
            className="absolute bottom-5 right-5"
          >
            <Text className="text-white text-2xl">→</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}
