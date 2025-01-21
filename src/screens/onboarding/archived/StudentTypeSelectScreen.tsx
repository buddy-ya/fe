import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Heading, InnerLayout, Layout, SelectItem, Button } from '@/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/navigationRef';


type StudentType = 'korean' | 'foreign' | null;

type StudentTypeScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStudentTypeSelect'>;

export default function StudentTypeScreen({ navigation }: StudentTypeScreenProps) {
  const [selectedType, setSelectedType] = useState<StudentType>(null);
  const { t } = useTranslation('onboarding');

  const handleNavigateButton = () => {
    navigation.navigate('OnboardingGenderSelect');
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading className="mt-8">{t('studentType.title')}</Heading>
        <View className="mt-14">
          <SelectItem
            selected={selectedType === 'korean'}
            onPress={() => setSelectedType('korean')}
            item={t('studentType.korean')}
          />
          <SelectItem
            selected={selectedType === 'foreign'}
            onPress={() => setSelectedType('foreign')}
            item={t('studentType.foreign')}
          />
        </View>
        <Button onPress={handleNavigateButton}>
          <Text className="font-semibold text-lg text-white">{t('common.next')}</Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
