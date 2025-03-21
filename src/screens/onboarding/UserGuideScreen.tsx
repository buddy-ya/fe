import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking, Text, View } from 'react-native';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { useBackButton } from '@/hooks';
import i18n from '@/i18n';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TERMS_URL } from '@/utils';

type OnboardingUserGuideProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingUserGuide'
>;

export default function UserGuideScreen({ navigation }: OnboardingUserGuideProps) {
  const { t } = useTranslation('onboarding');

  const handleAgree = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tab' }],
    });
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
          <View className="mt-12">
            {guidelines.map((item) => (
              <View
                key={item.key}
                className="mb-4 flex-row items-center rounded-xl border border-gray-300 bg-gray-100 p-4"
              >
                <Text className="mr-3 text-2xl">{item.emoji}</Text>
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

        <Button className="mt-8 w-full" type="box" onPress={handleAgree}>
          <MyText className="font-semibold text-lg text-white">{t('userGuide.button')}</MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
