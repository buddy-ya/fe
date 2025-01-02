import { Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { sendEmail, verifyEmailCode } from '@/api/certification/certification';
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

export default function EmailVerificationScreen({ navigation, route }) {
  const { t } = useTranslation('certification');
  const [code, setCode] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const email = route.params?.email;
  const univName = route.params?.univName;
  const [isSubmiting, setisSubmiting] = useState(false);

  const handleResend = async () => {
    await sendEmail({ email, univName });
    setCode('');
    setVerificationError(false);
  };

  const handleNavigateButton = async () => {
    if (isSubmiting) return;

    setisSubmiting(true);
    const { success } = await verifyEmailCode({
      email,
      univName,
      code,
    });
    if (success) {
      setVerificationError(false);
      navigation.navigate('EmailComplete');
    } else {
      setVerificationError(true);
      setCode('');
    }
  };

  const renderFooterContent = () => {
    return (
      <View>
        <MyText size="text-sm" color="text-textDescription">
          {t('verification.checkSpam')}
        </MyText>
        <LinkText onPress={handleResend}>{t('verification.resend')}</LinkText>
      </View>
    );
  };

  const footer = (
    <FooterLayout
      icon={<Send strokeWidth={1} size={23} color="#797979" />}
      content={<View className="mx-3">{renderFooterContent()}</View>}
      onPress={handleNavigateButton}
      disabled={code.length !== 4 || isSubmiting}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t('verification.title')}</Heading>
          <HeadingDescription>{t('verification.titleDescription', { email })}</HeadingDescription>
          <Label>{t('verification.label')}</Label>
          <OTPInput value={code} onChange={setCode} length={4} />
          {verificationError && (
            <ErrorMessage className="mt-2">{t('verification.warning')}</ErrorMessage>
          )}
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
