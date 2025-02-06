import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AuthRepository } from '@/api';
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
      const data = await AuthRepository.verifyCodeByPhone({ phoneNumber, code: verificationCode });
      setShowError(false);
      updateOnboardingData({ phoneNumber });
      if (data.status === 'EXISTING_MEMBER') {
        await TokenService.save(data.accessToken, data.refreshToken);
      }
      navigation.replace('OnboardingNotification', {
        isExistingMember: data.status === 'EXISTING_MEMBER',
      });
    } catch (error) {
      logError(error);
      setShowError(true);
      setVerificationCode('');
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
            disabled={verificationCode.length !== 6 || isExpired}
          />
        }
      >
        <InnerLayout>
          <Heading>{t('verification.title')}</Heading>
          <HeadingDescription>
            {t('verification.titleDescription', { phoneNumber: formattedPhone })}
          </HeadingDescription>
          <Label>{t('verification.label')}</Label>
          <OTPInput value={verificationCode} onChange={setVerificationCode} length={6} />
          {showError && <ErrorMessage className="mt-2">{t('verification.warning')}</ErrorMessage>}
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
