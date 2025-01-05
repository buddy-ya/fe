import { IdCard } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import { useOnboardingStore } from '@/store/onboarding';
import { UserRepository } from '@/api';
import { ErrorMessage, FooterLayout, Heading, HeadingDescription, InnerLayout, KeyboardLayout, Label, Layout, MyText } from '@/components';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 15;

export default function NameScreen({ navigation, route }) {
  const { mode, onComplete } = route.params || {};
  const [name, setName] = useState('');
  const [isNonEnglish, setIsNonEnglish] = useState(false);
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

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

    if (mode === 'edit') {
      await UserRepository.updateName(trimmedName);
      navigation.goBack();
    } else {
      updateOnboardingData({ name: trimmedName });
      navigation.navigate('OnboardingCountrySelect');
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

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
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
