import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { UserRepository } from '@/api';
import {
  Button,
  Heading,
  HeadingDescription,
  InnerLayout,
  Layout,
  MyText,
  MultiSelectItem,
} from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { useOnboardingStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UNIVERSITY_ICONS, UniversityID } from '@/utils';

type UniversityItem = { university: string };
type OptionItem = { id: string; icon?: React.ReactNode };
type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingUniversitySelect'>;

export default function UniversitySelectScreen({ navigation }: Props) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const data = await UserRepository.getUniversities();
        setUniversities(data);
      } catch (err) {
        console.error('Failed to fetch universities', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUniversities();
  }, [t]);

  const options: OptionItem[] = universities.map((item) => {
    const IconComponent = UNIVERSITY_ICONS[item.university as UniversityID];
    return {
      id: item.university,
      icon: IconComponent ? (
        <View pointerEvents="none" className="overflow-hidden">
          <IconComponent />
        </View>
      ) : null,
    };
  });

  const handleSelect = (opt: OptionItem) => setSelectedOption(opt);
  const handleNavigate = () => {
    if (!selectedOption) return;
    updateOnboardingData({ university: selectedOption.id });
    navigation.navigate('OnboardingCountrySelect');
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading>{t('universitySelect.title')}</Heading>
        <HeadingDescription>{t('universitySelect.description')}</HeadingDescription>

        <MyText size="text-base" className="mt-6 font-semibold">
          {t('universitySelect.label')}
        </MyText>

        <View className="relative flex-1">
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="large" color="#4AA366" />
            </View>
          )}
          {!isLoading && (
            <MultiSelectItem
              options={options}
              selectedValues={selectedOption ? [selectedOption] : []}
              onSelect={handleSelect}
              multiple={false}
              nameSpace="universities:universities"
            />
          )}
        </View>

        <Button onPress={handleNavigate} disabled={isLoading || !selectedOption} className="mt-6">
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t('common.next')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
