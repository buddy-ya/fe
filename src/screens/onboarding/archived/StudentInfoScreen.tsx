import React from 'react';

import { useTranslation } from 'react-i18next';
import { Text, View, Image } from 'react-native';

import Button from '@/components/common/Button';
import InnerLayout from '@/components/common/layout/InnerLayout';
import Layout from '@/components/common/layout/Layout';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';

export default function StudentInfoScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const handleNavigate = () => {
    navigation.replace('OnboardingUniversitySelect');
  };
  return (
    <Layout>
      <InnerLayout>
        <Heading>{t('studentInfo.title')}</Heading>
        <HeadingDescription>{t('studentInfo.description')}</HeadingDescription>
        <View className="flex-1">
          <Image className="w-[385px] h-[290px]" source={require('@assets/images/onboarding/id-card.png')} />
        </View>
        <Button onPress={handleNavigate}>
          <Text className="text-white text-lg font-semibold">{t('common.next')}</Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
