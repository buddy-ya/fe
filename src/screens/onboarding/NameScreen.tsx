import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { IdCard } from "lucide-react-native";
import HeadingDescription from "@/components/onboarding/HeadingDescription";

export default function NameScreen({ navigation }) {
  const [name, setName] = useState("");
  const { t, i18n } = useTranslation("onboarding");
  const currentLang = i18n.language.startsWith("ko") ? "ko" : "en";

  const handleNavigation = () => {
    if (currentLang == "en") {
      return navigation.navigate("OnboardingCountrySelect");
    }
    navigation.navigate("OnboardingLanguageSelect");
  };

  const isValidName = /^[a-zA-Z]*$/.test(name) && name.trim().length > 0;

  const footer = (
    <View className="w-full absolute flex-row items-center justify-between px-4 bottom-4">
      <View className="flex-1 flex-row items-center mr-4">
        <IdCard strokeWidth={1} color={"black"} />
        <Text className="text-sm mx-4">{t("name.footer")}</Text>
      </View>
      <Button
        type="circle"
        onPress={handleNavigation}
        disabled={!isValidName}
      />
    </View>
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading className="mt-8">{t("name.title")}</Heading>
          <HeadingDescription>{t("name.description")}</HeadingDescription>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t("name.placeholder")}
            className="mt-12 px-4 py-3 w-[60%] text-xl tracking-wide border border-inputBorder rounded-xl"
            placeholderTextColor="placeholderPrimary"
            autoFocus
          />
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
