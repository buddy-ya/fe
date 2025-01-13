import * as Font from 'expo-font';
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { logError, getAccessToken } from '@/utils';

const FONTS = {
  'Pretendard-Thin': require('@assets/fonts/Pretendard-Thin.otf'),
  'Pretendard-ExtraLight': require('@assets/fonts/Pretendard-ExtraLight.otf'),
  'Pretendard-Light': require('@assets/fonts/Pretendard-Light.otf'),
  'Pretendard-Regular': require('@assets/fonts/Pretendard-Regular.otf'),
  'Pretendard-Medium': require('@assets/fonts/Pretendard-Medium.otf'),
  'Pretendard-SemiBold': require('@assets/fonts/Pretendard-SemiBold.otf'),
  'Pretendard-Bold': require('@assets/fonts/Pretendard-Bold.otf'),
  'Pretendard-ExtraBold': require('@assets/fonts/Pretendard-ExtraBold.otf'),
  'Pretendard-Black': require('@assets/fonts/Pretendard-Black.otf'),
};

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    initializeApp();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync(FONTS);
  };

  const handleNavigation = async () => {
    const accessToken = await getAccessToken();
    navigation.navigate(accessToken ? 'Tab' : 'Onboarding');
  };

  const initializeApp = async () => {
    try {
      await loadFonts();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await handleNavigation();
    } catch (error) {
      logError(error);
      navigation.navigate('Onboarding');
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Image source={require('@assets/images/splash.png')} className="h-full w-full" />
    </View>
  );
}
