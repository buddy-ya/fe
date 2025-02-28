import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Button, Heading, HeadingDescription, Layout, MyText } from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type EmailCompleteScreenProps = NativeStackScreenProps<FeedStackParamList, 'EmailComplete'>;

export default function EmailCompleteScreen({ navigation }: EmailCompleteScreenProps) {
  const { t } = useTranslation('certification');

  const handleNavigateButton = () => {
    navigation.navigate('Tab', {
      screen: 'FeedTab',
      params: {
        screen: 'FeedHome',
      },
    } as any);
  };

  return (
    <Layout preserveHeader>
      <View className="flex-1 px-5">
        <View>
          <Heading>{t('verificationComplete.title')}</Heading>
          <HeadingDescription>
            {t('verificationComplete.description1')}
            {'\n'}
            {t('verificationComplete.description2')}
          </HeadingDescription>
        </View>

        <View className="flex-1 justify-center">
          <Image
            source={require('@assets/images/onboarding/student-id.png')}
            className="h-[200px] w-full"
            resizeMode="contain"
          />
        </View>

        <Button onPress={handleNavigateButton}>
          <MyText size="text-lg" className="font-semibold" color="text-white">
            {t('verificationComplete.start')}
          </MyText>
        </Button>
      </View>
    </Layout>
  );
}
