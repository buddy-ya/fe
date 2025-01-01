import '@/../global.css';

import React from 'react';

import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

import Button from '@/components/common/Button';
import MyText from '@/components/common/MyText';
import InnerLayout from '@/components/common/layout/InnerLayout';
import Layout from '@/components/common/layout/Layout';

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation('onboarding');

  const handleNavigateButton = () => {
    navigation.navigate('OnboardingPhone');
  };

  return (
    <Layout showHeader={false}>
      <InnerLayout>
        <View className="mt-14 items-center">
          <Image
            source={require('@assets/images/onboarding/logo.png')}
            className="h-[65px] w-[225px]"
          />
        </View>
        <View className="mt-5">
          <MyText size="text-2xl" className="text-center">
            <MyText size="text-2xl" color="text-primary" className="font-bold">
              {t('intro.title-primary')}
            </MyText>
            {t('intro.title')}
          </MyText>
          <MyText size="text-2xl" className="mt-2 text-center">
            {t('intro.subTitle')}
            <MyText size="text-2xl" color="text-primary" className="font-bold">
              {t('intro.subTitle-primary')}
            </MyText>
          </MyText>
        </View>
        <View className="mt-14 flex-1">
          <Image
            source={require('@assets/images/onboarding/han-gang.png')}
            className="h-[344px] w-full"
          />
        </View>
        <Button onPress={handleNavigateButton}>
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t('intro.button')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
