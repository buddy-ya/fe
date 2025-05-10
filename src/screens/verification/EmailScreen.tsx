import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TextInput } from 'react-native';
import { ScrollView } from 'react-native';
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
  MyText,
} from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Mail } from 'lucide-react-native';
import { EMAIL_REGEX, UNIVERSITY_EMAIL_DOMAINS, UniversityID } from '@/utils';

type EmailScreenProps = NativeStackScreenProps<FeedStackParamList, 'EmailVerification'>;

export default function EmailScreen({ navigation }: EmailScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation('certification');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setErrorMessage('');
  };

  const university = useUserStore((state) => state.university);
  const isValidEmail = email.length > 0 && EMAIL_REGEX.test(email);
  const fullEmail = email + '@' + UNIVERSITY_EMAIL_DOMAINS[university as UniversityID];

  const handleNavigation = async () => {
    try {
      setLoading(true);
      await AuthRepository.sendCodeByMail({ email: fullEmail });
      navigation.navigate('EmailVerificationCode', { email: fullEmail });
    } catch (error: any) {
      const errorCode = error.response?.data?.code;
      if (errorCode === 1002) {
        setErrorMessage(t('error.registered'));
      } else if (errorCode === 1004) {
        setErrorMessage(t('error.sendFail'));
      }
    } finally {
      setLoading(false);
    }
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
      disabled={!isValidEmail || loading}
      loading={loading}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <View className="flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    maxLength={50}
                    autoFocus
                  />
                  <View className="border-inputBorder ml-2 h-[50px] flex-row items-center justify-center rounded-xl border px-4 py-3">
                    <MyText size="text-lg" color="text-textDescription" className="mr-1">
                      {'@'}
                    </MyText>
                    <MyText size="text-lg" color="text-textDescription">
                      {UNIVERSITY_EMAIL_DOMAINS[university as UniversityID]}
                    </MyText>
                  </View>
                </View>
                {email.length > 0 && !isValidEmail && (
                  <ErrorMessage>{t('email.warning')}</ErrorMessage>
                )}
                {errorMessage !== '' && <ErrorMessage>{errorMessage}</ErrorMessage>}
              </View>
            </ScrollView>
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
