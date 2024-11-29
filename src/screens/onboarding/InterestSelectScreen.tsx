import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import Heading from "@/components/onboarding/Heading";
import { Chip } from "@/components/common/Chip";
import {
  INTEREST_CATEGORIES,
  INTEREST_ICONS,
} from "@/utils/constants/interests";
import type { InterestID } from "@/utils/constants/interests";
import { useOnboardingStore } from "@/store/onboarding";
import { postOnboardingInfo } from "@/api/onboarding/join";
import { logError } from "@/utils/service/error";
import MyText from "@/components/common/MyText";
import { saveTokens } from "@/utils/service/auth";

interface Interest {
  id: InterestID;
  icon: string;
}

export default function InterestSelectScreen({ navigation, route }) {
  const { mode, initialInterests, onComplete } = route.params || {};
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(
    initialInterests?.map((id) => ({
      id,
      icon: INTEREST_ICONS[id],
    })) || []
  );
  const { t } = useTranslation(["onboarding", "interests"]);
  const { updateOnboardingData, ...onboardingData } = useOnboardingStore();
  const MAX_SELECT = 8;

  const handleToggleSelect = (interest: Interest) => {
    setSelectedInterests((prev) => {
      if (prev.some((i) => i.id === interest.id)) {
        return prev.filter((i) => i.id !== interest.id);
      }
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, interest];
    });
  };

  const handleNavigateButton = async () => {
    try {
      const interests = selectedInterests.map((interest) => interest.id);
      updateOnboardingData({ interests });

      const { data } = await postOnboardingInfo({
        ...onboardingData,
        interests,
      });
      await saveTokens(data.accessToken, data.refreshToken);
      navigation.reset({
        index: 0,
        routes: [{ name: "Tab" }],
      });
    } catch (error) {
      logError(error);
    }
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Heading>{t("onboarding:interest.title")}</Heading>
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
