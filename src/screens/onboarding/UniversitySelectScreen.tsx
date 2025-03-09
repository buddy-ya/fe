import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { UserRepository } from '@/api';
import {
  Button,
  Heading,
  HeadingDescription,
  InnerLayout,
  Label,
  Layout,
  MyText,
  MultiSelectItem,
} from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { useOnboardingStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UNIVERSITY_ICONS, UniversityID } from '@/utils';

type UniversityItem = {
  university: string;
};

type OptionItem = {
  id: string;
  icon?: React.ReactNode;
};

type OnboardingUniversitySelectScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingUniversitySelect'
>;

export default function UniversitySelectScreen({
  navigation,
}: OnboardingUniversitySelectScreenProps) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const data = await UserRepository.getUniversities();
        setUniversities(data);
      } catch (error) {
        console.error('Failed to fetch universities', error);
      }
    }
    fetchUniversities();
  }, []);

  const options: OptionItem[] = universities.map((item) => {
    const IconComponent = UNIVERSITY_ICONS[item.university as UniversityID];
    return {
      id: item.university,
      icon: IconComponent ? <IconComponent /> : null,
    };
  });

  const handleSelect = (value: { id: string }) => {
    setSelected(value.id);
  };

  const handleNavigateButton = () => {
    if (selected) {
      updateOnboardingData({ university: selected });
      navigation.navigate('OnboardingGenderSelect');
    }
  };

  return (
    <Layout preserveHeader>
      <InnerLayout>
        <Heading>{t('universitySelect.title')}</Heading>
        <HeadingDescription>{t('universitySelect.description')}</HeadingDescription>
        <Label>{t('universitySelect.label')}</Label>
        <MultiSelectItem
          options={options}
          selectedValues={selected ? [{ id: selected }] : []}
          onSelect={handleSelect}
          multiple={false}
          nameSpace="universities"
        />
        <Button onPress={handleNavigateButton} disabled={!selected}>
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t('common.next')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
