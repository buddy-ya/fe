import { useTranslation, Trans } from 'react-i18next';
import { View, Linking, Text } from 'react-native';
import '@/../global.css';
import { Button, InnerLayout, Layout, MyText } from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import Charactrers from '@assets/images/onboarding/characters.svg';
import WelcomeTextBackground from '@assets/images/onboarding/welcomeBg.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
    Linking.openURL(
      'https://thinkable-durian-178.notion.site/1b1badc2aadc80559650dd4dbde70532?pvs=74'
    ).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <Layout showHeader={false}>
      <InnerLayout>
        <View className="flex-1">
          <View className="relative mt-12">
            <WelcomeTextBackground />
            <View className="absolute left-2 top-0">
              <MyText size="text-[45px]" className="font-light leading-[1.27]">
                {t('intro.title', {
                  flower: '🌸',
                  eye: '👀',
                })}
              </MyText>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <View className="mt-8">
              <Charactrers />
            </View>
            <View className="mt-16">
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
          </View>
          <Button onPress={handleNavigateButton}>
            <MyText size="text-lg" color="text-white" className="font-semibold">
              {t('intro.button')}
            </MyText>
          </Button>
        </View>
      </InnerLayout>
    </Layout>
  );
}
