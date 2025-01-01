import SejongLogo from '@assets/icons/universities/sejong.svg';
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

export default function UniversitySelectScreen({ navigation }) {
  const [selected, setSelected] = useState(true);
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const handleNavigateButton = () => {
    updateOnboardingData({ university: 'sju' });
    navigation.navigate('OnboardingGenderSelect');
  };

  return (
    <Layout preserveHeader>
      <InnerLayout>
        <View className="flex-1">
          <Heading>{t('universitySelect.title')}</Heading>
          <HeadingDescription>{t('universitySelect.title')}</HeadingDescription>
          <Label>{t('universitySelect.label')}</Label>
          <SelectItem selected={selected} disabled={true} onPress={() => {}}>
            <View className="flex-row items-center">
              <SejongLogo width={24} height={24} />
              <MyText size="text-base" color="text-active" className="ml-3">
                {t('universitySelect.universities.sejong')}
              </MyText>
            </View>
          </SelectItem>
        </View>
        <Button onPress={handleNavigateButton}>
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t('common.next')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
