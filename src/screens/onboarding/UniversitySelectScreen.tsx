import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import SelectItem from "@/components/onboarding/SelectItem";
import SejongLogo from "@assets/icons/universities/sejong.svg";

export default function UniversitySelectScreen({ navigation }) {
  const [selected, setSelected] = useState(true);
  const { t } = useTranslation("onboarding");

  const handleNavigate = () => {
    navigation.navigate("OnboardingStudentTypeSelect");
  };

  return (
    <Layout>
      <InnerLayout>
        <Heading className="mt-[82px]">{t("universitySelect.title")}</Heading>
        <View className="mt-12">
          <SelectItem selected={selected} disabled={true} onPress={() => {}}>
            <View className="flex-row items-center">
              <SejongLogo width={24} height={24} />
              <Text className="ml-4">
                {t("universitySelect.universities.sejong")}
              </Text>
            </View>
          </SelectItem>
        </View>
        <Button
          className="absolute bottom-14 right-8"
          type="circle"
          onPress={handleNavigate}
        />
      </InnerLayout>
    </Layout>
  );
}
