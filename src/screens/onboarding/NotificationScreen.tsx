import AlertIcon from '@assets/icons/alert.svg';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useOnboardingStore } from '@/store';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingNotificationScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingNotification'
>;

export default function NotificationScreen({ navigation, route }: OnboardingNotificationScreenProps) {
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
    const isGranted = await requestNotificationPermission();
    updateOnboardingData({ isNotificationEnabled: isGranted });
    handleNavigate();
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
