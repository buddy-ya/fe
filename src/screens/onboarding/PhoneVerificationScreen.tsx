import { Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useOnboardingStore } from '@/store/onboarding';
import { postPhoneVerification, postPhoneVerifyCode } from '@/api/auth/phone';
import useTimer from '@/hooks/useTimer';
import { saveTokens } from '@/utils/service/auth';
import { logError } from '@/utils/service/error';
import { formatPhone } from '@/utils/service/phone';
import LinkText from '@/components/common/LinkText';
import MyText from '@/components/common/MyText';
import OTPInput from '@/components/common/OTPInput';
import FooterLayout from '@/components/common/layout/FooterLayout';
import InnerLayout from '@/components/common/layout/InnerLayout';
import KeyboardLayout from '@/components/common/layout/KeyboardLayout';
import Layout from '@/components/common/layout/Layout';
import ErrorMessage from '@/components/onboarding/ErrorMessage';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';
import Label from '@/components/onboarding/Label';

const VERIFICATION_EXPIRE_SECONDS = 180;

export default function PhoneVerificationScreen({ navigation, route }) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const formattedPhone = route.params?.phone;
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
      await postPhoneVerification(phoneNumber);
      resetVerification();
    } catch (error) {
      logError(error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const { data } = await postPhoneVerifyCode(phoneNumber, verificationCode);
      setShowError(false);
      updateOnboardingData({ phoneNumber });
      if (data.status === 'EXISTING_MEMBER') {
        await saveTokens(data.accessToken, data.refreshToken);
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
