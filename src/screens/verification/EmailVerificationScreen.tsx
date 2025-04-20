import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
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
  LinkText,
  MyText,
  OTPInput,
} from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Send } from 'lucide-react-native';

type EmailVerificationScreenProps = NativeStackScreenProps<
  FeedStackParamList,
  'EmailVerificationCode'
>;

export default function EmailVerificationScreen({
  navigation,
  route,
}: EmailVerificationScreenProps) {
  const { t } = useTranslation('certification');
  const [code, setCode] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const email = route.params?.email;
  const update = useUserStore((state) => state.update);
  const [loading, setLoading] = useState(false);

  const handleCode = (code: string) => {
    setCode(code);
    setVerificationError(false);
  };

  const handleResend = async () => {
    await AuthRepository.sendCodeByMail({ email });
    setCode('');
    setVerificationError(false);
  };

  const handleNavigateButton = async () => {
    setLoading(true);
    try {
      const { success } = await AuthRepository.verifyCodeByMail({
        email,
        code,
      });
      if (success) {
        setVerificationError(false);
        update({ isCertificated: true });
        navigation.navigate('EmailComplete');
      } else {
        setVerificationError(true);
        setCode('');
      }
    } catch (e) {
      setVerificationError(true);
    } finally {
      setLoading(false);
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
      disabled={code.length < 4 || loading || verificationError}
      loading={loading}
    />
  );

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <View className="flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Heading>{t('verification.title')}</Heading>
              <HeadingDescription>
                {t('verification.titleDescription', { email })}
              </HeadingDescription>
              <MyText color="" className="mt-1 font-medium">
                {t('verification.spam')}
              </MyText>
              <Label>{t('verification.label')}</Label>
              <OTPInput value={code} onChange={handleCode} length={4} />
              {verificationError && (
                <ErrorMessage className="mt-2">{t('verification.warning')}</ErrorMessage>
              )}
            </ScrollView>
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
