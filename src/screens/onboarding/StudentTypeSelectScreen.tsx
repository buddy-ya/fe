import { ChevronRight } from 'lucide-react-native';

import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

import Button from '@/components/common/Button';
import InnerLayout from '@/components/common/layout/InnerLayout';
import Layout from '@/components/common/layout/Layout';
import Heading from '@/components/onboarding/Heading';
import SelectItem from '@/components/onboarding/SelectItem';

type StudentType = 'korean' | 'foreign' | null;

export default function StudentTypeScreen({ navigation }) {
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
          <Text className="text-white text-lg font-semibold">{t('common.next')}</Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
