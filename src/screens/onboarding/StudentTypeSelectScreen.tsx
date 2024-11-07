import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import SelectItem from "@/components/onboarding/SelectItem";

type StudentType = "korean" | "foreign" | null;

export default function StudentTypeScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState<StudentType>(null);
  const { t } = useTranslation("onboarding");

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingGenderSelect");
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading className="mt-8">{t("studentType.title")}</Heading>
        <View className="mt-14">
          <SelectItem
            selected={selectedType === "korean"}
            onPress={() => setSelectedType("korean")}
          >
            <Text>{t("studentType.korean")}</Text>
          </SelectItem>

          <SelectItem
            selected={selectedType === "foreign"}
            onPress={() => setSelectedType("foreign")}
          >
            <Text>{t("studentType.foreign")}</Text>
          </SelectItem>
        </View>
        <Button
          className="absolute bottom-14 right-8"
          type="circle"
          onPress={handleNavigateButton}
          disabled={!selectedType}
        >
          <ChevronRight strokeWidth={2} size={32} color="white" />
        </Button>
      </InnerLayout>
    </Layout>
  );
}
