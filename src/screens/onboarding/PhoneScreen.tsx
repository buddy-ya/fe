import { Lock } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import { postPhoneVerification } from '@/api/auth/phone';
import { formatPhone } from '@/utils/service/phone';
import MyText from '@/components/common/MyText';
import FooterLayout from '@/components/common/layout/FooterLayout';
import InnerLayout from '@/components/common/layout/InnerLayout';
import KeyboardLayout from '@/components/common/layout/KeyboardLayout';
import Layout from '@/components/common/layout/Layout';
import ErrorMessage from '@/components/onboarding/ErrorMessage';
import Heading from '@/components/onboarding/Heading';
import HeadingDescription from '@/components/onboarding/HeadingDescription';
import Label from '@/components/onboarding/Label';

const COUNTRY_CODE = '+82';
const MAX_PHONE_LENGTH = 11;
const PHONE_PLACEHOLDER = '010-1234-5678';

const CountryCodeBox = () => (
  <View className="mr-2 h-[52px] flex-row items-center rounded-xl border border-border px-[14px]">
    <MyText size="text-xl" color="text-textDescription">
      🇰🇷 {COUNTRY_CODE}
    </MyText>
  </View>
);

const PhoneInput = ({ value, onChange, inputRef }) => (
  <TextInput
    ref={inputRef}
    value={formatPhone.addHyphen(value)}
    onChangeText={onChange}
    keyboardType="number-pad"
    placeholder={PHONE_PLACEHOLDER}
    className="h-[52px] w-[172px] rounded-xl border border-border px-[14px] text-[18px]"
    placeholderTextColor="#DFDFDF"
    textAlignVertical="center"
    autoFocus
  />
);

export default function PhoneScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const inputRef = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPrefixError, setIsPrefixError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsPhoneValid(formatPhone.validate(phoneNumber));
    setIsPrefixError(formatPhone.checkPrefix(phoneNumber));
  }, [phoneNumber]);

  const handleBack = () => {
    inputRef.current?.blur();
    navigation.goBack();
  };

  const handlePhoneNumberInput = (text: string) => {
    const formattedNumber = formatPhone.removeHyphen(text);

    if (formattedNumber.length <= MAX_PHONE_LENGTH) {
      setPhoneNumber(formattedNumber);
    }
  };

  const handleVerificationRequest = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await postPhoneVerification(phoneNumber);
      navigation.navigate('OnboardingPhoneVerification', {
        phone: formatPhone.addHyphen(phoneNumber),
      });
    } catch (error) {
      console.error('Phone verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <FooterLayout
      icon={<Lock strokeWidth={1} size={23} color="#797979" />}
      content={
        <MyText size="text-sm" color="text-textDescription" className="mx-3">
          {t('phone.footer')}
        </MyText>
      }
      onPress={handleVerificationRequest}
      disabled={!isPhoneValid || isLoading}
    />
  );

  return (
    <Layout showHeader onBack={handleBack}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t('phone.title')}</Heading>
          <HeadingDescription>{t('phone.titleDescription')}</HeadingDescription>
          <Label>{t('phone.label')}</Label>

          <View>
            <View className="mb-4 flex-row items-center">
              <CountryCodeBox />
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneNumberInput}
                inputRef={inputRef}
              />
            </View>
            {isPrefixError && <ErrorMessage>{t('phone.warning')}</ErrorMessage>}
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
