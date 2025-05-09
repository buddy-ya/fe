import { useTranslation, Trans } from 'react-i18next';
import { View, Linking, Text } from 'react-native';
import '@/../global.css';
import { Button, InnerLayout, Layout, MyText } from '@/components';
import { useBackButton } from '@/hooks';
import i18n from '@/i18n';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import Charactrers from '@assets/images/onboarding/characters.svg';
import WelcomeTextBackground from '@assets/images/onboarding/welcomeBg.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PRIVACY_POLICY_URL } from '@/utils';

type OnboardingWelcomeScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingWelcome'
>;

export default function WelcomeScreen({ navigation }: OnboardingWelcomeScreenProps) {
  const { t } = useTranslation('onboarding');

  const handleNavigateButton = () => {
    navigation.navigate('OnboardingPhone');
  };

  const handlePrivacyPolicyPress = () => {
    const url = i18n.language === 'ko' ? PRIVACY_POLICY_URL.ko : PRIVACY_POLICY_URL.en;
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const CHARACTERS_RATIO = 275 / 184;
  useBackButton();

  return (
    <Layout showHeader={false}>
      <InnerLayout>
        <View className="flex-1">
          <View className="relative mt-12">
            <WelcomeTextBackground />
            <View className="absolute left-2 top-0">
              <MyText size="text-5xl" className="font-extralight leading-[1.27]">
                {t('intro.title', {
                  flower: '🌸',
                  eye: '👀',
                })}
              </MyText>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <View className="mt-6" style={{ width: '85%', aspectRatio: CHARACTERS_RATIO }}>
              <Charactrers width="100%" height="100%" />
            </View>
          </View>
          <View className="mb-12">
            <MyText size="text-sm" color="text-[#636363]" className="text-center">
              <Trans
                i18nKey="onboarding:intro.privacy"
                parent={Text}
                components={{
                  privacyLink: (
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        textDecorationColor: 'rgba(0, 0, 0, 0.3)',
                      }}
                      onPress={handlePrivacyPolicyPress}
                    />
                  ),
                }}
              />
            </MyText>
          </View>
          <Button onPress={handleNavigateButton}>
            <MyText size="text-lg" color="text-white" className="text-center font-semibold">
              {t('intro.button')}
            </MyText>
          </Button>
        </View>
      </InnerLayout>
    </Layout>
  );
}
