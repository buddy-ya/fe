import { Lock } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import { formatPhone } from '@/utils/service/phone';
import { ErrorMessage, FooterLayout, Heading, HeadingDescription, InnerLayout, KeyboardLayout, Label, Layout, MyText } from '@/components';
import { AuthRepository } from '@/api';

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
    className="h-[52px] w-[172px] rounded-xl border border-border px-[14px] text-[18px] text-text"
    placeholderTextColor="#DFDFDF"
    textAlignVertical="center"
    autoFocus
  />
);

export default function PhoneScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const inputRef = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isPhoneValid = formatPhone.validate(phoneNumber);
  const isPrefixError = formatPhone.checkPrefix(phoneNumber);

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
      await AuthRepository.sendCodeByPhone({ phoneNumber });
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
