import { useState } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { API, ChatSocketRepository, NotificationRepository, UserRepository } from '@/api';
import {
  Button,
  Chip,
  Heading,
  HeadingDescription,
  InnerLayout,
  Layout,
  MyText,
} from '@/components';
import { MyPageStackParamList, OnboardingStackParamList } from '@/navigation/navigationRef';
import { TokenService } from '@/service';
import { useOnboardingStore, useUserStore } from '@/store';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { InterestID } from '@/utils';
import { INTEREST_CATEGORIES, INTEREST_ICONS, logError, removeNullValues } from '@/utils';

interface Interest {
  id: InterestID;
  icon: string;
}

type InterestSelectProps =
  | NativeStackScreenProps<OnboardingStackParamList, 'OnboardingInterestSelect'>
  | NativeStackScreenProps<MyPageStackParamList, 'EditInterest'>;

const MAX_SELECT = 8;

function InterestSelectScreen({ navigation, route }: InterestSelectProps) {
  const { t } = useTranslation(['onboarding', 'interests']);
  const { updateOnboardingData, ...onboardingData } = useOnboardingStore();
  const token = useOnboardingStore((state) => state.expoToken);
  const update = useUserStore((state) => state.update);

  const isEditMode =
    'params' in route && route.params && 'isEditMode' in route.params
      ? route.params.isEditMode
      : false;

  const initInterests =
    'params' in route && route.params && 'initialInterests' in route.params
      ? route.params.initialInterests
      : [];

  const [selectedInterests, setSelectedInterests] = useState(
    initInterests.map((interestId) => ({
      id: interestId,
      icon: INTEREST_ICONS[interestId],
    }))
  );

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
      if (isEditMode) {
        const data = await UserRepository.update({ key: 'interests', values: interests });
        update(removeNullValues(data));
        const myPageNav = navigation as NativeStackNavigationProp<
          MyPageStackParamList,
          'EditInterest'
        >;
        myPageNav.goBack();
      } else {
        const { accessToken, refreshToken, ...rest } = await UserRepository.create({
          ...onboardingData,
          interests,
        });

        if (accessToken && refreshToken) {
          await TokenService.save(accessToken, refreshToken);
          update({ ...removeNullValues(rest), isAuthenticated: true });
          API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          await NotificationRepository.registerToken({ token });
          await ChatSocketRepository.initialize();
          const onboardNav = navigation as NativeStackNavigationProp<
            OnboardingStackParamList,
            'OnboardingInterestSelect'
          >;
          onboardNav.navigate('OnboardingUserGuide');
        }
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
          <HeadingDescription>{t('onboarding:interest.description')}</HeadingDescription>
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
              {t('onboarding:common.selected')}
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

export default memo(InterestSelectScreen);
