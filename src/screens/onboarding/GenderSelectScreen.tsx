import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useOnboardingStore } from '@/store/onboarding';
import Button from '@/components/common/Button';
import MyText from '@/components/common/MyText';
import InnerLayout from '@/components/common/layout/InnerLayout';
import Layout from '@/components/common/layout/Layout';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';
import Label from '@/components/onboarding/Label';
import SelectItem from '@/components/onboarding/SelectItem';

type Gender = 'male' | 'female' | 'unknown' | null;

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const handleNavigate = () => {
    updateOnboardingData({
      gender: selectedGender,
    });
    navigation.navigate('OnboardingName');
  };

  const GENDER_OPTIONS = [
    { id: 'male', label: 'gender.male' },
    { id: 'female', label: 'gender.female' },
    { id: 'unknown', label: 'gender.preferNotToSay' },
  ] as const;

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <View className="flex-1">
          <Heading>{t('gender.title')}</Heading>
          <HeadingDescription>{t('gender.title')}</HeadingDescription>
          <Label>{t('gender.label')}</Label>
          {GENDER_OPTIONS.map((item) => (
            <SelectItem
              key={item.id}
              selected={selectedGender === item.id}
              onPress={() => setSelectedGender(item.id)}
              item={t(item.label)}
            />
          ))}
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
