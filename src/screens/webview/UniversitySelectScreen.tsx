import { useOnboardingStore } from '@/store';
import { useRef } from 'react';
import WebView from 'react-native-webview';
import { WEBVIEW_URL } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/navigationRef';

type UniversitySelectScreenWVProps = NativeStackScreenProps<OnboardingStackParamList, 'UniversitySelect'>;

export default function UniversitySelectScreenWV({ navigation }: UniversitySelectScreenWVProps) {
  const webViewRef = useRef<WebView>(null);
  const { updateOnboardingData } = useOnboardingStore();

  const handleWebViewMessage = (event: any) => {
    const { data } = event.nativeEvent;
    try {
      const message = JSON.parse(data); // JSON 파싱
      if (message.action === 'goBack') {
        navigation.goBack();
      } else if (message.action === 'goNext') {
        if (message.payload) {
          updateOnboardingData({ university: message.payload.university });
          navigation.navigate('OnboardingGenderSelect');
        }
      }
    } catch (e) {
      console.error('Invalid message format:', data);
    }
  };

  const sendDataToWebView = () => {
    const data = { action: 'backButton' };
    const script = `window.dispatchEvent(new MessageEvent('message', {
      data: ${JSON.stringify(data)}
    }));`;

    webViewRef.current?.injectJavaScript(script);
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: WEBVIEW_URL }}
      onMessage={handleWebViewMessage}
      bounces={false} // iOS에서 바운스 비활성화
      overScrollMode="never" // Android에서 오버스크롤 방지
    />
  );
}
