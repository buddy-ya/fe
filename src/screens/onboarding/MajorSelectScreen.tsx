import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useOnboardingStore } from '@/store/onboarding';

import { MAJORS } from '@/utils/constants/majors';
import type { MajorID } from '@/utils/constants/majors';

import Button from '@/components/common/Button';
import MyText from '@/components/common/MyText';
import SelectItem from '@/components/common/SelectItem';
import InnerLayout from '@/components/common/layout/InnerLayout';
import Layout from '@/components/common/layout/Layout';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';

interface Major {
  id: MajorID;
  icon: string;
}

export default function MajorSelectScreen({ navigation }) {
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const { t } = useTranslation(['onboarding', 'majors']);
  const { updateOnboardingData } = useOnboardingStore();
  const MAX_SELECT = 2;

  const handleSelect = (major: Major) => {
    setSelectedMajors((prev) => {
      if (prev.some((m) => m.id === major.id)) {
        return prev.filter((m) => m.id !== major.id);
      }
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, major];
    });
  };

  const handleNavigateButton = () => {
    updateOnboardingData({
      majors: selectedMajors.map((major) => major.id),
    });
    navigation.navigate('OnboardingInterestSelect');
  };
  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading>{t('onboarding:major.title')}</Heading>
        {/* <HeadingDescription /> */}
        {/* <Text className="text-textDescription mt-2"></Text> */}
        <MyText size="text-base" color="text-textDescription" className="mt-3">
          {t('language.maxSelect', { count: MAX_SELECT })}
        </MyText>
        <SelectItem
          options={MAJORS}
          selectedValues={selectedMajors}
          onSelect={handleSelect}
          maxSelect={MAX_SELECT}
          multiple={true}
          nameSpace="majors"
          className="mt-5"
        />

        <Button
          type="box"
          onPress={handleNavigateButton}
          disabled={selectedMajors.length === 0}
          className="flex-row items-center justify-center mt-5"
        >
          <View>
            <MyText size="text-base" color="text-white" className="font-semibold">
              {t('onboarding:common.selected')}
            </MyText>
          </View>
          <View className="ml-1">
            <MyText size="text-base" color="text-white" className="font-semibold">
              {selectedMajors.length}/{MAX_SELECT}
            </MyText>
          </View>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
