import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { API, ChatSocketRepository, UserRepository } from '@/api';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { TokenService } from '@/service';
import { useOnboardingStore, useUserStore } from '@/store';
import AlertIcon from '@assets/icons/alert.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { jwtDecode, JwtPayload } from 'jwt-decode';

type OnboardingNotificationScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingNotification'
>;

interface CustomJwtPayload extends JwtPayload {
  studentId: number;
}

export default function NotificationScreen({
  navigation,
  route,
}: OnboardingNotificationScreenProps) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();
  const update = useUserStore((state) => state.update);

  const isExistingMember = route.params?.isExistingMember;

  const getUser = async () => {
    try {
      const accessToken = await TokenService.getAccessToken();
      if (accessToken) {
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const token: CustomJwtPayload = jwtDecode(accessToken);
        const userId = token.studentId;
        const user = await UserRepository.get({ id: userId });
        update({ ...user, isAuthenticated: true });
        await ChatSocketRepository.initialize();
        return true;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNavigate = async () => {
    if (isExistingMember) {
      const response = await getUser();
      if (response) {
        navigation.reset({ index: 0, routes: [{ name: 'Tab' }] });
      }
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
