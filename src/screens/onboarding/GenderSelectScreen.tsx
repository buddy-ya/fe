import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import SelectItem from "@/components/onboarding/SelectItem";

type Gender = "male" | "female" | "preferNotToSay" | null;

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const { t } = useTranslation("onboarding");

  const handleNavigateButton = () => {
    navigation.navigate("OnboardingName");
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading className="mt-8">{t("gender.title")}</Heading>
        <View className="mt-12">
          <SelectItem
            selected={selectedGender === "male"}
            onPress={() => setSelectedGender("male")}
          >
            <Text>{t("gender.male")}</Text>
          </SelectItem>

          <SelectItem
            selected={selectedGender === "female"}
            onPress={() => setSelectedGender("female")}
          >
            <Text>{t("gender.female")}</Text>
          </SelectItem>

          <SelectItem
            selected={selectedGender === "preferNotToSay"}
            onPress={() => setSelectedGender("preferNotToSay")}
          >
            <Text>{t("gender.preferNotToSay")}</Text>
          </SelectItem>
        </View>

        <Button
          className="absolute bottom-12 right-8"
          type="circle"
          onPress={handleNavigateButton}
          disabled={!selectedGender}
        >
          <ChevronRight strokeWidth={2} size={32} color="white" />
        </Button>
      </InnerLayout>
    </Layout>
  );
}
