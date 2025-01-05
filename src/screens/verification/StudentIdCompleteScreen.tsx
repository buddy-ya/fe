import { Button, Heading, HeadingDescription, Layout } from '@/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function StudentIdCardCompleteScreen({ navigation }) {
  const { t } = useTranslation('');

  const handleNavigationButton = () => {
    navigation.reset('Home');
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <View className="flex-1 px-5">
        <Heading>{t('studentIdComplete.title')}</Heading>
        <HeadingDescription>
          {t('studentIdComplete.description1')}
          {t('studentIdComplete.description2')}
        </HeadingDescription>

        <View className="flex-1" />

        <Button onPress={handleNavigationButton}>{t('studentIdComplete.complete')}</Button>
      </View>
    </Layout>
  );
}
