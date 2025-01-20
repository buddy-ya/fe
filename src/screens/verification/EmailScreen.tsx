import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TextInput } from 'react-native';
import { AuthRepository } from '@/api';
import { ErrorMessage, FooterLayout, Heading, HeadingDescription, InnerLayout, KeyboardLayout, Label, Layout, MyText } from '@/components';
import { EMAIL_REGEX } from '@/utils';

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
    const { success } = await AuthRepository.sendCodeByMail(requestBody);
    if (success) {
      navigation.navigate('EmailVerificationCode', {
        email: fullEmail,
        univName,
      })
    };
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
