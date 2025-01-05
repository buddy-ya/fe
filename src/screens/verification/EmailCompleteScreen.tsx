import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import Button from '@/components/common/Button';
import MyText from '@/components/common/MyText';
import Layout from '@/components/common/layout/Layout';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';

export default function EmailCompleteScreen({ navigation }) {
  const { t } = useTranslation('certification');

  const handleNavigateButton = () => {
    navigation.navigate('FeedHome');
  };

  return (
    <Layout preserveHeader>
      <View className="flex-1 px-5">
        <View>
          <Heading>{t('verificationComplete.title')}</Heading>
          <HeadingDescription>
            {t('verificationComplete.description1')}
            {'\n'}
            {t('verificationComplete.description2')}
          </HeadingDescription>
        </View>

        <View className="flex-1 justify-center">
          <Image
            source={require('@assets/images/onboarding/student-id.png')}
            className="h-[200px] w-full"
            resizeMode="contain"
          />
        </View>

        <Button onPress={handleNavigateButton}>
          <MyText size="text-lg" className="font-semibold" color="text-white">
            {t('verificationComplete.start')}
          </MyText>
        </Button>
      </View>
    </Layout>
  );
}
