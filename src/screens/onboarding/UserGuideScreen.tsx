import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking, Text, View, TouchableOpacity } from 'react-native';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { useBackButton } from '@/hooks';
import i18n from '@/i18n';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check } from 'lucide-react-native';
import { TERMS_URL } from '@/utils';

type OnboardingUserGuideProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingUserGuide'
>;

export default function UserGuideScreen({ navigation }: OnboardingUserGuideProps) {
  const { t } = useTranslation('onboarding');
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    if (isChecked) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tab' }],
      });
    }
  };

  const openTermsLink = () => {
    const url = i18n.language === 'ko' ? TERMS_URL.ko : TERMS_URL.en;
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  useBackButton();

  const guidelines = [
    { key: 'guideline1', emoji: '🚫' },
    { key: 'guideline2', emoji: '⚠️' },
    { key: 'guideline3', emoji: '💬' },
    { key: 'guideline4', emoji: '🎓' },
  ];

  return (
    <Layout preserveHeader>
      <InnerLayout>
        <View className="flex-1">
          <Heading>{t('userGuide.title')}</Heading>
          <HeadingDescription>{t('userGuide.description')}</HeadingDescription>
          <TouchableOpacity
            className={`mt-7 flex-row items-center rounded-xl border px-4 py-3 ${isChecked ? 'border-[#A6CFC4] bg-[#F6FFFD]' : 'border-gray-300 bg-[#F6F6F6]'}`}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View
              className={`mr-3 h-8 w-8 items-center justify-center rounded-full ${isChecked ? 'bg-primary' : 'bg-[#DFDFDF]'} `}
            >
              <Check size={20} color="white" />
            </View>
            <MyText size="text-lg" className="font-medium">
              {t('userGuide.checkboxText')}
            </MyText>
          </TouchableOpacity>
          <View className="mt-4">
            {guidelines.map((item) => (
              <View key={item.key} className="mt-6 flex-row items-center px-4">
                <Text className="mr-3 text-xl">{item.emoji}</Text>
                <MyText className="flex-1 font-medium">{t(`userGuide.${item.key}`)}</MyText>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-2 items-center">
          <MyText size="text-sm" color="text-[#636363]" className="text-center">
            <Trans
              i18nKey="onboarding:userGuide.terms"
              parent={Text}
              style={{
                textDecorationColor: 'rgba(0, 0, 0, 0.3)',
              }}
              components={{
                termsLink: <Text onPress={openTermsLink} className="underline" />,
              }}
            />
          </MyText>
        </View>

        <Button
          className={`mt-8 w-full ${isChecked ? 'bg-primar' : 'bg-gray-300'}`}
          type="box"
          onPress={handleAgree}
          disabled={!isChecked}
        >
          <MyText className="font-semibold text-lg text-white">{t('userGuide.button')}</MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
