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
  SelectItem,
} from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { useOnboardingStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UniversityID } from '@/utils';

type OnboardingUniversitySelectScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingUniversitySelect'
>;

export default function UniversitySelectScreen({
  navigation,
}: OnboardingUniversitySelectScreenProps) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const [universities, setUniversities] = useState<UniversityID[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const data = await UserRepository.getUniversities();
        console.log(data);
        setUniversities(data);
      } catch (error) {
        console.error('Failed to fetch universities', error);
      }
    }
    fetchUniversities();
  }, []);

  const handleSelectUniversity = (id: string) => {
    setSelected(id);
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
        <View className="flex-1">
          <Heading>{t('universitySelect.title')}</Heading>
          <HeadingDescription>{t('universitySelect.description')}</HeadingDescription>
          <Label>{t('universitySelect.label')}</Label>
          {universities.map((univ) => (
            <SelectItem
              key={univ}
              selected={selected === univ}
              onPress={() => handleSelectUniversity(univ)}
            >
              <View className="flex-row items-center">
                {/*
                  여기에 각 대학교의 로고를 렌더링하고 싶다면, 
                  univ.id에 따른 로고 컴포넌트를 미리 매핑해두거나 조건부 렌더링할 수 있습니다.
                */}
                <MyText size="text-base" color="text-active" className="ml-3">
                  {t(`universities:universities.${univ}`)}
                </MyText>
              </View>
            </SelectItem>
          ))}
        </View>
        <Button onPress={handleNavigateButton} disabled={!selected}>
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t('common.next')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
