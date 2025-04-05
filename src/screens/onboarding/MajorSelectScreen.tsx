import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Heading, InnerLayout, Layout, MultiSelectItem, MyText } from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { useOnboardingStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MajorID } from '@/utils';
import { MAJORS } from '@/utils';

interface Major {
  id: MajorID;
  icon: string;
}

type OnboardingMajorSelectScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingMajorSelect'
>;

export default function MajorSelectScreen({ navigation }: OnboardingMajorSelectScreenProps) {
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
        <MyText size="text-base" color="text-textDescription" className="mt-3">
          {t('onboarding:major.maxSelect', { count: MAX_SELECT })}
        </MyText>
        <MultiSelectItem
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
          className="mt-5 flex-row items-center justify-center"
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
