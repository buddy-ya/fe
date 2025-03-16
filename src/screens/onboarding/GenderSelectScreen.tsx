import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Button,
  Heading,
  HeadingDescription,
  InnerLayout,
  Label,
  Layout,
  MyText,
  SelectItem,
} from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { useOnboardingStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Gender = 'male' | 'female' | null;

export type OnboardingGenderSelectScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingGenderSelect'
>;

export default function GenderScreen({ navigation }: OnboardingGenderSelectScreenProps) {
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const handleNavigate = () => {
    updateOnboardingData({
      gender: selectedGender,
    });
    navigation.navigate('OnboardingUniversitySelect');
  };

  const GENDER_OPTIONS = [
    { id: 'male', label: 'gender.male' },
    { id: 'female', label: 'gender.female' },
  ] as const;

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <View className="flex-1">
          <Heading>{t('gender.title')}</Heading>
          <HeadingDescription>{t('gender.title')}</HeadingDescription>
          <Label>{t('gender.label')}</Label>
          <View className="mt-2">
            {GENDER_OPTIONS.map((item) => (
              <SelectItem
                key={item.id}
                selected={selectedGender === item.id}
                onPress={() => setSelectedGender(item.id)}
                item={t(item.label)}
              />
            ))}
          </View>
        </View>
        <Button onPress={handleNavigate} disabled={!selectedGender}>
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t('common.next')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
