import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { INTEREST_CATEGORIES } from "@/utils/constants/interests";
import { Chip } from "@/components/common/Chip";

interface Interest {
  id: string;
  icon: string;
  en: string;
  ko: string;
}

export default function InterestSelectScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const { t, i18n } = useTranslation("onboarding");
  const currentLang = i18n.language.startsWith("ko") ? "ko" : "en";
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="py-6">
            <Heading>{t("interest.title")}</Heading>
            <HeadingDescription>{t("interest.description")}</HeadingDescription>
            <Text className="text-textDescription mt-2">
              {t("interest.maxSelect", { count: MAX_SELECT })}
            </Text>

            {INTEREST_CATEGORIES.map((category) => (
              <View key={category.id} className="mt-8">
                <Text className="text-lg font-semibold mb-4">
                  {category[currentLang]}
                </Text>
                <View className="flex-row flex-wrap">
                  {category.interests.map((interest) => (
                    <Chip
                      key={interest.id}
                      icon={interest.icon}
                      label={interest[currentLang]}
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
          </View>
        </ScrollView>

        <Button
          type="box"
          onPress={handleNavigateButton}
          disabled={selectedInterests.length === 0}
          className="flex-row items-center justify-center mt-5 mb-4"
        >
          <View>
            <Text className="text-white text-base font-semibold">
              {t("interest.submit")}
            </Text>
          </View>
          <View className="ml-1">
            <Text className="text-white text-base font-semibold">
              {selectedInterests.length + "/" + MAX_SELECT}
            </Text>
          </View>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
