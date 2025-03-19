import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import { UserRepository } from '@/api';
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
import { useBackButton } from '@/hooks';
import { MyPageStackParamList, OnboardingStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { IdCard } from 'lucide-react-native';
import { useOnboardingStore } from '@/store/onboarding';
import { removeNullValues } from '@/utils';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 15;

type NameScreenProps =
  | NativeStackScreenProps<OnboardingStackParamList, 'OnboardingName'>
  | NativeStackScreenProps<MyPageStackParamList, 'EditName'>;

export default function NameScreen({ navigation, route }: NameScreenProps) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();
  const update = useUserStore((state) => state.update);

  const isEditMode =
    'params' in route && route.params && 'isEditMode' in route.params
      ? route.params.isEditMode
      : false;

  const initialName =
    'params' in route && route.params && 'initialName' in route.params
      ? route.params.initialName
      : '';

  const [name, setName] = useState(initialName);
  const [isNonEnglish, setIsNonEnglish] = useState(false);

  const handleNameChange = (text: string) => {
    setName(text);
    setIsNonEnglish(/[^\x00-\x7F\s]/.test(text));
  };

  const nameLength = name.trim().length;
  const isValidName =
    nameLength >= MIN_NAME_LENGTH && nameLength <= MAX_NAME_LENGTH && !isNonEnglish;
  const isInvalidLength =
    nameLength > 0 && (nameLength < MIN_NAME_LENGTH || nameLength > MAX_NAME_LENGTH);

  const handleNavigation = async () => {
    const trimmedName = name.trim();

    if (isEditMode) {
      const myPageNav = navigation as NativeStackNavigationProp<MyPageStackParamList, 'EditName'>;
      const response = await UserRepository.update({ key: 'name', values: [trimmedName] });
      update(removeNullValues(response));
      myPageNav.goBack();
    } else {
      updateOnboardingData({ name: trimmedName });
      const onboardNav = navigation as NativeStackNavigationProp<
        OnboardingStackParamList,
        'OnboardingName'
      >;
      onboardNav.navigate('OnboardingGenderSelect');
    }
  };

  const footer = (
    <FooterLayout
      icon={<IdCard strokeWidth={1} size={28} color="#797979" />}
      content={
        <MyText size="text-sm" color="text-textDescription" className="mx-3">
          {t('name.footer')}
        </MyText>
      }
      onPress={handleNavigation}
      disabled={!isValidName}
    />
  );

  const headerProps = isEditMode
    ? { showHeader: true, onBack: () => navigation.goBack() }
    : { preserveHeader: true };

  useBackButton();

  return (
    <Layout {...headerProps}>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <Heading>{t('name.title')}</Heading>
          <HeadingDescription>{t('name.description')}</HeadingDescription>
          <Label>{t('name.label')}</Label>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder={t('name.placeholder')}
            className={`border-inputBorder mb-4 h-[50px] w-[262px] rounded-xl border px-4 py-3 text-[18px] tracking-wide text-text`}
            keyboardType="ascii-capable"
            placeholderTextColor="placeholderPrimary"
            autoFocus
          />
          {isNonEnglish && <ErrorMessage>{t('name.warning')}</ErrorMessage>}
          {isInvalidLength && (
            <ErrorMessage>
              {t('name.warningLength', {
                min: MIN_NAME_LENGTH,
                max: MAX_NAME_LENGTH,
              })}
            </ErrorMessage>
          )}
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}
