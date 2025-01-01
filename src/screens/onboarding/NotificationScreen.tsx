import AlertIcon from '@assets/icons/alert.svg';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useOnboardingStore } from '@/store/onboarding';
import Button from '@/components/common/Button';
import MyText from '@/components/common/MyText';
import InnerLayout from '@/components/common/layout/InnerLayout';
import Layout from '@/components/common/layout/Layout';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';

export default function NotificationScreen({ navigation, route }) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();
  const isExistingMember = route.params?.isExistingMember;

  const handleNavigate = () => {
    if (isExistingMember) {
      navigation.reset({ index: 0, routes: [{ name: 'Tab' }] });
    } else {
      navigation.replace('OnboardingUniversitySelect');
    }
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') {
      return true;
    }

    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  };

  const handleButtonPress = async () => {
    try {
      const isGranted = await requestNotificationPermission();
      updateOnboardingData({ isNotificationEnabled: isGranted });
      handleNavigate();
    } catch (error) {
      console.error('Notification permission error:', error);
      handleNavigate();
    }
  };

  return (
    <Layout preserveHeader>
      <InnerLayout>
        <Heading>{t('notification.title')}</Heading>
        <HeadingDescription>{t('notification.description')}</HeadingDescription>
        <View className="flex-1 items-center justify-center">
          <View className="mb-10">
            <AlertIcon />
          </View>
        </View>
        <Button className="w-full" type="box" onPress={handleButtonPress}>
          <MyText size="text-lg" color="text-white" className="font-semibold">
            {t('notification.allow')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
