import { useTranslation, Trans } from 'react-i18next';
import { View, Linking, Text } from 'react-native';
import '@/../global.css';
import { Button, InnerLayout, Layout, MyText } from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import Charactrers from '@assets/images/onboarding/characters.svg';
import WelcomeText from '@assets/images/onboarding/onboardingTexts.svg';
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
          <View className="mt-10">
            <WelcomeText />
          </View>
          <View className="flex-1 items-center justify-center">
            <View className="mt-10">
              <Charactrers />
            </View>
            <View className="mt-14">
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
