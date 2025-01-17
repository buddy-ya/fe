import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useOnboardingStore } from '@/store';
import { LANGUAGES } from '@/utils';
import { UserRepository } from '@/api';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MultiSelectItem, MyText, SearchInput } from '@/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/navigationRef';


interface Language {
  id: string;
}

type OnboardingLanguageSelectScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingLanguageSelect'
>;

export default function LanguageSelectScreen({ navigation, route }: OnboardingLanguageSelectScreenProps) {
  const { mode, initialLanguages, onComplete } = route.params || {};
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(
    initialLanguages?.map((id) => ({ id })) || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation('onboarding');
  const { updateOnboardingData } = useOnboardingStore();
  const MAX_SELECT = 4;

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
    if (mode === 'edit') {
      await UserRepository.updateLanguages(languages);
      navigation.goBack();
    } else {
      updateOnboardingData({ languages });
      navigation.navigate('OnboardingMajorSelect');
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
