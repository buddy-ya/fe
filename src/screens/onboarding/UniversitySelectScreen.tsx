import SejongLogo from '@assets/icons/universities/sejong.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useOnboardingStore } from '@/store';
import { Button, Heading, HeadingDescription, InnerLayout, Label, Layout, MyText, SelectItem } from '@/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/navigationRef';

type OnboardingUniversitySelectScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingUniversitySelect'
>;

export default function UniversitySelectScreen({ navigation }: OnboardingUniversitySelectScreenProps) {
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
          <SelectItem selected={selected} disabled={true} onPress={() => { }}>
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
