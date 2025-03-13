import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { API, ChatSocketRepository, NotificationRepository } from '@/api';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { TokenService } from '@/service';
import { useOnboardingStore } from '@/store';
import AlertIcon from '@assets/icons/alert.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getExpoToken } from '@/hooks/useNotification';
import { logError } from '@/utils';

type OnboardingNotificationScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingNotification'
>;

export default function NotificationScreen({
  navigation,
  route,
}: OnboardingNotificationScreenProps) {
  const { t } = useTranslation('onboarding');
  const isExistingMember = route.params?.isExistingMember;
  const updateOnboardingData = useOnboardingStore((state) => state.updateOnboardingData);

  const handshake = async () => {
    try {
      const accessToken = await TokenService.getAccessToken();
      if (accessToken) {
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await ChatSocketRepository.initialize();
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };

  const handleNavigate = async () => {
    if (isExistingMember) {
      const response = await handshake();
      if (response) {
        navigation.reset({ index: 0, routes: [{ name: 'Tab' }] });
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'OnboardingUniversitySelect' }],
      });
    }
  };

  const handleButtonPress = async () => {
    try {
      const token = await getExpoToken();
      if (token) {
        if (isExistingMember) {
          await NotificationRepository.registerToken({ token });
        } else {
          updateOnboardingData({ expoToken: token, isNotificationEnabled: true });
        }
      }
      await handleNavigate();
    } catch (error) {
      logError(error);
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
