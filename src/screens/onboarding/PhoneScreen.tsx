import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View, Platform } from 'react-native';
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
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Application from 'expo-application';
import { Lock } from 'lucide-react-native';
import { formatPhone } from '@/utils';

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

const PhoneInput = ({ value, onChange, inputRef }: any) => (
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

type OnboardingPhoneScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingPhone'
>;

export default function PhoneScreen({ navigation }: OnboardingPhoneScreenProps) {
  const { t } = useTranslation('onboarding');
  const inputRef = useRef<TextInput>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestAccount, setIsTestAccount] = useState(false);

  const isPhoneValid = formatPhone.validate(phoneNumber);
  const isPrefixError = formatPhone.checkPrefix(phoneNumber);

  useEffect(() => {
    const checkTestAccount = async () => {
      if (phoneNumber.length === MAX_PHONE_LENGTH && !phoneNumber.startsWith('010')) {
        try {
          const response = await AuthRepository.checkTestAccount({ phoneNumber });
          setIsTestAccount(response.isTestAccount);
        } catch (error) {
          console.error('Test account check failed:', error);
          setIsTestAccount(false);
        }
      } else {
        setIsTestAccount(false);
      }
    };

    checkTestAccount();
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
      let deviceId: string | null = null;
      if (Platform.OS === 'android') {
        deviceId = Application.getAndroidId();
      } else {
        deviceId = await Application.getIosIdForVendorAsync();
      }
      await AuthRepository.sendCodeByPhone({ phoneNumber, udId: deviceId });
      navigation.navigate('OnboardingPhoneVerification', {
        phone: formatPhone.addHyphen(phoneNumber),
      });
    } catch (error) {
      console.error('Phone verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = phoneNumber.startsWith('010')
    ? isPhoneValid
    : phoneNumber.length === MAX_PHONE_LENGTH && isTestAccount;
  const isButtonDisabled = isLoading || !isValid;

  const footer = (
    <FooterLayout
      icon={<Lock strokeWidth={1} size={23} color="#797979" />}
      content={
        <MyText size="text-sm" color="text-textDescription" className="mx-3">
          {t('phone.footer')}
        </MyText>
      }
      onPress={handleVerificationRequest}
      disabled={isButtonDisabled}
      loading={isLoading}
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
