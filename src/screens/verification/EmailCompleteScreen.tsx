import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import Characters from '@assets/images/verification/characters.svg';
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
      <InnerLayout>
        <View className="flex-1">
          <View className="flex-1">
            <Heading>{t('verificationComplete.title')}</Heading>
            <HeadingDescription>{t('verificationComplete.description')}</HeadingDescription>
          </View>
          <View className="flex-1">
            <Characters />
          </View>
        </View>
        <Button onPress={handleNavigateButton}>
          <MyText size="text-lg" className="font-semibold" color="text-white">
            {t('verificationComplete.start')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
