import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { Chip } from "@/components/common/Chip";
import { INTEREST_CATEGORIES } from "@/utils/constants/interests";
import type { InterestID } from "@/utils/constants/interests";

interface Interest {
  id: InterestID;
  icon: string;
}

export default function InterestSelectScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const { t } = useTranslation(["onboarding", "interests"]);
  const MAX_SELECT = 5;

  const handleToggleSelect = (interest: Interest) => {
    setSelectedInterests((prev) => {
      if (prev.some((i) => i.id === interest.id)) {
        return prev.filter((i) => i.id !== interest.id);
      }
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, interest];
    });
  };

  const handleNavigateButton = () => {
    navigation.navigate("#");
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-12"
        >
          <Heading>{t("onboarding:interest.title")}</Heading>
          {/* <HeadingDescription>
            {t("onboarding:interest.description")}
          </HeadingDescription> */}
          <Text className="text-textDescription mt-3">
            {t("onboarding:interest.maxSelect", { count: MAX_SELECT })}
          </Text>

          {INTEREST_CATEGORIES.map((category) => (
            <View key={category.id} className="mt-8">
              <Text className="text-[14px] text-text font-semibold mb-4">
                {t(`interests:categories.${category.id}`)}
              </Text>
              <View className="flex-row flex-wrap">
                {category.interests.map((interest) => (
                  <Chip
                    key={interest.id}
                    icon={interest.icon}
                    label={t(`interests:interests.${interest.id}`)}
                    selected={selectedInterests.some(
                      (i) => i.id === interest.id
                    )}
                    onPress={() => handleToggleSelect(interest)}
                    className="mr-2 mb-2"
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        <Button
          type="box"
          onPress={handleNavigateButton}
          disabled={selectedInterests.length === 0}
          className="flex-row items-center justify-center"
        >
          <View>
            <Text className="text-white text-base font-semibold">
              {t("onboarding:interest.submit")}
            </Text>
          </View>
          <View className="ml-1">
            <Text className="text-white text-base font-semibold">
              {selectedInterests.length}/{MAX_SELECT}
            </Text>
          </View>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
