import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native';
import { Layout } from '@/components';
import { Image } from 'expo-image';

const screenWidth = Dimensions.get('window').width;

export default function GlobalBuddyPage({ navigation }: any) {
  return (
    <Layout showHeader isBackgroundWhite onBack={() => navigation.goBack()}>
      <ScrollView>
        <Image
          source={require('@assets/images/GlobalBuddyDetail.png')}
          style={{
            width: screenWidth,
            aspectRatio: 375 / 2224,
          }}
          contentFit="contain"
        />
      </ScrollView>
    </Layout>
  );
}
