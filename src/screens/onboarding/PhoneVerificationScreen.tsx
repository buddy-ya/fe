import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, View } from 'react-native';
import { AuthRepository, ChatSocketRepository } from '@/api';
import {
  ErrorMessage,
  FooterLayout,
  Heading,
  HeadingDescription,
  InnerLayout,
  KeyboardLayout,
  Label,
  Layout,
  LinkText,
  MyText,
  OTPInput,
} from '@/components';
import { useTimer } from '@/hooks';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { TokenService } from '@/service';
import { useOnboardingStore, useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Application from 'expo-application';
import { Send } from 'lucide-react-native';
import { formatPhone, logError } from '@/utils';

const VERIFICATION_EXPIRE_SECONDS = 180;

type OnboardingPhoneVerificationScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingPhoneVerification'
>;

export default function PhoneVerificationScreen({
  navigation,
  route,
}: OnboardingPhoneVerificationScreenProps) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();
  const update = useUserStore((state) => state.update);

  const formattedPhone = route.params.phone;
  const phoneNumber = formatPhone.removeHyphen(formattedPhone);

  const [verificationCode, setVerificationCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { timeLeft, isExpired, restart } = useTimer({
    seconds: VERIFICATION_EXPIRE_SECONDS,
    onExpire: () => {},
  });

  const resetVerification = () => {
    setVerificationCode('');
    setShowError(false);
    restart();
  };

  const handleResendCode = async () => {
    try {
      await AuthRepository.sendCodeByPhone({ phoneNumber });
      resetVerification();
    } catch (error) {
      logError(error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      let deviceId: string | null = null;
      if (Platform.OS === 'android') {
        deviceId = Application.getAndroidId();
      } else {
        deviceId = await Application.getIosIdForVendorAsync();
      }

      const data = await AuthRepository.verifyCodeByPhone({
        phoneNumber,
        code: verificationCode,
        udId: deviceId,
      });
      setShowError(false);
      updateOnboardingData({ phoneNumber });

      if (data.status === 'EXISTING_MEMBER') {
        await TokenService.save(data.accessToken, data.refreshToken);
        update({ ...data, isAuthenticated: true });
      }
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'OnboardingNotification',
            params: {
              isExistingMember: data.status === 'EXISTING_MEMBER',
            },
          },
        ],
      });
    } catch (error: any) {
      const errorCode = error.response?.data?.code;
      setVerificationCode('');
      if (errorCode === 1000) {
        setShowError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTimer = () => {
    if (!isExpired) {
      return (
        <View>
          <MyText size="text-sm" color="text-textDescription">
            {t('verification.notReceived')}
          </MyText>
          <MyText size="text-sm" color="text-textDescription">
            {timeLeft}
          </MyText>
        </View>
      );
    }

    return (
      <View>
        <MyText size="text-sm" color="text-textDescription">
          {t('verification.expired')}
        </MyText>
        <LinkText onPress={handleResendCode}>{t('verification.resend')}</LinkText>
      </View>
    );
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout
        footer={
          <FooterLayout
            icon={<Send strokeWidth={1} size={23} color="#797979" />}
            content={<View className="mx-3">{renderTimer()}</View>}
            onPress={handleVerifyCode}
            disabled={verificationCode.length !== 6 || isExpired || loading}
            loading={loading}
          />
        }
      >
        <InnerLayout>
          <View className="flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Heading>{t('verification.title')}</Heading>
              <HeadingDescription>
                {t('verification.titleDescription', { phoneNumber: formattedPhone })}
              </HeadingDescription>
              <Label>{t('verification.label')}</Label>
              <OTPInput value={verificationCode} onChange={setVerificationCode} length={6} />
              {showError && (
                <ErrorMessage className="mt-2">{t('verification.warning')}</ErrorMessage>
              )}
            </ScrollView>
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
