import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import {
  Button,
  Heading,
  HeadingDescription,
  InnerLayout,
  Layout,
  MultiSelectItem,
  MyText,
  SearchInput,
} from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { useOnboardingStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COUNTRIES } from '@/utils';

type CountryID = (typeof COUNTRIES)[number]['id'];

interface Country {
  id: CountryID;
  icon: string;
  // name: string;
}

type CountrySelectScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingCountrySelect'
>;

export default function CountrySelectScreen({ navigation }: CountrySelectScreenProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const handleSelect = (value: { id: string; icon?: string }) => {
    const country = COUNTRIES.find((c) => c.id === value.id);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const filteredOptions = COUNTRIES.filter((option) =>
    t(`countries:countries.${option.id}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigateButton = () => {
    if (selectedCountry) {
      updateOnboardingData({
        country: selectedCountry.id,
        isKorean: selectedCountry.id === 'ko',
      });
      navigation.navigate('OnboardingLanguageSelect');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Layout showHeader onBack={() => navigation.goBack()}>
        <InnerLayout>
          <Heading>{t('country.title')}</Heading>
          <HeadingDescription>{t('country.description')}</HeadingDescription>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('country.searchPlaceholder')}
          />
          <MultiSelectItem
            options={filteredOptions}
            selectedValues={selectedCountry ? [selectedCountry] : []}
            onSelect={handleSelect}
            multiple={false}
            nameSpace="countries"
            className="mb-12"
          />
          <Button
            type="box"
            onPress={handleNavigateButton}
            disabled={!selectedCountry}
            className="flex-row items-center justify-center"
          >
            <MyText size="text-base" color="text-white" className="font-semibold">
              {t('common.next')}
            </MyText>
          </Button>
        </InnerLayout>
      </Layout>
    </TouchableWithoutFeedback>
  );
}
