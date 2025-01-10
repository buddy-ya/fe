import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useOnboardingStore } from '@/store/onboarding';
import { COUNTRIES } from '@/utils/constants/countries';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MultiSelectItem, MyText, SearchInput } from '@/components';


type CountryID = (typeof COUNTRIES)[number]['id'];

interface Country {
  id: CountryID;
  icon: string;
  name: string;
}

export default function CountrySelectScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
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
