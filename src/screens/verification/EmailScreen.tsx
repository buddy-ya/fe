import { Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import { sendEmail } from '@/api/certification/certification';
import MyText from '@/components/common/MyText';
import FooterLayout from '@/components/common/layout/FooterLayout';
import InnerLayout from '@/components/common/layout/InnerLayout';
import KeyboardLayout from '@/components/common/layout/KeyboardLayout';
import Layout from '@/components/common/layout/Layout';
import ErrorMessage from '@/components/onboarding/ErrorMessage';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';
import Label from '@/components/onboarding/Label';

const EMAIL_REGEX = /^[A-Za-z0-9]+$/;

export default function EmailScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const { t } = useTranslation('certification');

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const isValidEmail = email.length > 0 && EMAIL_REGEX.test(email);

  const handleNavigation = async () => {
    const fullEmail = email + '@sju.ac.kr';
    const univName = '세종대학교';
    const requestBody = {
      email: fullEmail,
      univName,
    };
    await sendEmail(requestBody);
    navigation.navigate('EmailVerificationCode', {
      email: fullEmail,
      univName,
    });
  };

  const footer = (
    <FooterLayout
      icon={<Mail strokeWidth={1} size={24} color="#797979" />}
      content={
        <MyText size="text-sm" color="text-textDescription" className="mx-3">
          {t('email.footer')}
        </MyText>
      }
      onPress={handleNavigation}
      disabled={!isValidEmail}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t('email.title')}</Heading>
          <HeadingDescription>{t('email.description')}</HeadingDescription>
          <Label>{t('email.label')}</Label>
          <View>
            <View className="mb-4 flex-row items-center">
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                placeholder={t('email.placeholder')}
                className="border-inputBorder h-[50px] flex-1 rounded-xl border px-4 py-3 text-[18px] text-text"
                keyboardType="email-address"
                placeholderTextColor="#DFDFDF"
                autoFocus
              />
              <View className="border-inputBorder ml-2 h-[50px] justify-center rounded-xl border px-4 py-3">
                <MyText size="text-lg" color="text-textDescription">
                  {t(`email.domain.${'sju'}`)}
                </MyText>
              </View>
            </View>
            {email.length > 0 && !isValidEmail && <ErrorMessage>{t('email.warning')}</ErrorMessage>}
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
