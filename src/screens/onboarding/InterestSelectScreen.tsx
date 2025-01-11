import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useOnboardingStore } from '@/store';
import type { InterestID } from '@/utils';
import { INTEREST_CATEGORIES, INTEREST_ICONS, logError } from '@/utils';
import { OnboardingRepository, UserRepository } from '@/api';
import { Button, Chip, Heading, InnerLayout, Layout, MyText } from '@/components';
import { TokenService } from '@/service';


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
  const { t } = useTranslation(['onboarding', 'interests']);
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
      if (mode === 'edit') {
        await UserRepository.updateInterests(interests);
        navigation.goBack();
      } else {
        updateOnboardingData({ interests });
        const { accessToken, refreshToken } = await OnboardingRepository.create({
          ...onboardingData,
          interests,
        });
        await TokenService.save(accessToken, refreshToken);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tab' }],
        });
      }
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
          <Heading>{t('onboarding:interest.title')}</Heading>
          <MyText size="text-base" color="text-textDescription" className="mt-3">
            {t('onboarding:interest.maxSelect', { count: MAX_SELECT })}
          </MyText>

          {INTEREST_CATEGORIES.map((category) => (
            <View key={category.id} className="mt-8">
              <MyText size="text-[14px]" className="mb-4 font-semibold">
                {t(`interests:categories.${category.id}`)}
              </MyText>
              <View className="flex-row flex-wrap">
                {category.interests.map((interest) => (
                  <Chip
                    key={interest.id}
                    icon={interest.icon}
                    label={t(`interests:interests.${interest.id}`)}
                    selected={selectedInterests.some((i) => i.id === interest.id)}
                    onPress={() => handleToggleSelect(interest)}
                    className="mb-2 mr-2"
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
            <MyText size="text-base" color="text-white" className="font-semibold">
              {t('onboarding:interest.submit')}
            </MyText>
          </View>
          <View className="ml-1">
            <MyText size="text-base" color="text-white" className="font-semibold">
              {`${selectedInterests.length}/${MAX_SELECT}`}
            </MyText>
          </View>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
