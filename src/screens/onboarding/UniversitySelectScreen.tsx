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
import { useBackButton } from '@/hooks';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUniversities() {
      setLoading(true);
      try {
        const data = await UserRepository.getUniversities();
        console.log(data);
        setUniversities(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch universities', err);
        setError(t('universitySelect.fetchError'));
      } finally {
        setLoading(false);
      }
    }
    fetchUniversities();
  }, [t]);

  useBackButton();

  const options: OptionItem[] = universities.map((item) => {
    const IconComponent = UNIVERSITY_ICONS[item.university as UniversityID];
    return {
      id: item.university,
      icon: IconComponent ? <IconComponent /> : null,
    };
  });

  const handleSelect = (id: string) => {
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
          <View className="mt-2">
            {!loading &&
              options.map((option) => (
                <SelectItem
                  key={option.id}
                  selected={selected === option.id}
                  onPress={() => handleSelect(option.id)}
                  item={t(`universities:universities.${option.id}`)}
                >
                  {option.icon}
                </SelectItem>
              ))}
          </View>
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
