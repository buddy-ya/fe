import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { Chip } from "@/components/common/Chip";
import { INTEREST_CATEGORIES } from "@/utils/constants/interests";
import type { InterestID } from "@/utils/constants/interests";
import { useOnboardingStore } from "@/store/onboarding";
import { useMutation } from "@tanstack/react-query";
import { postOnboardingInfo } from "@/api/onboarding/join";
import { logError } from "@/utils/service/error";
import MyText from "@/components/common/MyText";

interface Interest {
  id: InterestID;
  icon: string;
}

export default function InterestSelectScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const { t } = useTranslation(["onboarding", "interests"]);
  const { updateOnboardingData, ...onboardingData } = useOnboardingStore();
  const MAX_SELECT = 8;

  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: postOnboardingInfo,
    onSuccess: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "OnboardingInterestSelect" }],
      });
    },
    onError: logError,
  });

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
    const interests = selectedInterests.map((interest) => interest.id);
    updateOnboardingData({ interests });
    const onboardingMockData = {
      name: "John",
      major: "humanities",
      country: "us",
      isKorean: false,
      isNotificationEnabled: true,
      phoneNumber: "01012345678",
      gender: "male" as const,
      university: "sju",
      languages: ["ko", "en"],
      interests: ["kpop", "movie"],
    };
    submitOnboarding({
      ...onboardingMockData,
    });
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Heading>{t("onboarding:interest.title")}</Heading>
          {/* <HeadingDescription>
            {t("onboarding:interest.description")}
          </HeadingDescription> */}
          <MyText
            size="text-base"
            color="text-textDescription"
            className="mt-3"
          >
            {t("onboarding:interest.maxSelect", { count: MAX_SELECT })}
          </MyText>

          {INTEREST_CATEGORIES.map((category) => (
            <View key={category.id} className="mt-8">
              <MyText size="text-[14px]" className="font-semibold mb-4">
                {t(`interests:categories.${category.id}`)}
              </MyText>
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
            <MyText
              size="text-base"
              color="text-white"
              className="font-semibold"
            >
              {t("onboarding:interest.submit")}
            </MyText>
          </View>
          <View className="ml-1">
            <MyText
              size="text-base"
              color="text-white"
              className="font-semibold"
            >
              {`${selectedInterests.length}/${MAX_SELECT}`}
            </MyText>
          </View>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
