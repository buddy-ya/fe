import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { UserRepository } from '@/api';
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
import { MyPageStackParamList, OnboardingStackParamList } from '@/navigation/navigationRef';
import { useOnboardingStore, useUserStore } from '@/store';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { LANGUAGES, removeNullValues } from '@/utils';

const MAX_SELECT = 4;

interface Language {
  id: string;
}

type LanguageSelectScreenProps =
  | NativeStackScreenProps<OnboardingStackParamList, 'OnboardingLanguageSelect'>
  | NativeStackScreenProps<MyPageStackParamList, 'EditLanguage'>;

export default function LanguageSelectScreen({ navigation, route }: LanguageSelectScreenProps) {
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();
  const update = useUserStore((state) => state.update);

  const isEditMode =
    'params' in route && route.params && 'isEditMode' in route.params
      ? route.params.isEditMode
      : false;

  const initialLangs =
    'params' in route && route.params && 'initialLanguages' in route.params
      ? route.params.initialLanguages
      : [];

  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(
    initialLangs.map((id: string) => ({ id }))
  );

  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (language: Language) => {
    setSelectedLanguages((prev) => {
      if (prev.some((l) => l.id === language.id)) {
        return prev.filter((l) => l.id !== language.id);
      }
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, language];
    });
  };

  const filteredOptions = LANGUAGES.filter((option) =>
    t(`languages:languages.${option.id}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigateButton = async () => {
    const languages = selectedLanguages.map((lang) => lang.id);
    if (isEditMode) {
      const data = await UserRepository.update({ key: 'languages', values: languages });
      update(removeNullValues(data));
      const myPageNav = navigation as NativeStackNavigationProp<
        MyPageStackParamList,
        'EditLanguage'
      >;
      myPageNav.goBack();
    } else {
      updateOnboardingData({ languages });
      const onboardNav = navigation as NativeStackNavigationProp<
        OnboardingStackParamList,
        'OnboardingLanguageSelect'
      >;
      onboardNav.navigate('OnboardingMajorSelect');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Layout showHeader onBack={() => navigation.goBack()}>
        <InnerLayout>
          <Heading>{t('language.title')}</Heading>
          <HeadingDescription>{t('language.maxSelect', { count: MAX_SELECT })}</HeadingDescription>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('language.searchPlaceholder')}
          />
          <MultiSelectItem
            options={filteredOptions}
            selectedValues={selectedLanguages}
            onSelect={handleSelect}
            maxSelect={MAX_SELECT}
            multiple={true}
            nameSpace="languages"
            className="mb-12"
          />
          <Button
            type="box"
            onPress={handleNavigateButton}
            disabled={selectedLanguages.length === 0}
            className="flex-row items-center justify-center"
          >
            <View>
              <MyText size="text-base" color="text-white" className="font-semibold">
                {t('common.selected')}
              </MyText>
            </View>
            <View className="ml-1">
              <MyText size="text-base" color="text-white" className="font-semibold">
                {selectedLanguages.length}/{MAX_SELECT}
              </MyText>
            </View>
          </Button>
        </InnerLayout>
      </Layout>
    </TouchableWithoutFeedback>
  );
}
