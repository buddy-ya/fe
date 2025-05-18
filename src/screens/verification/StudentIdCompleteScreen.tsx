import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import Characters from '@assets/images/verification/characters.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type EmailVerificationScreenProps = NativeStackScreenProps<FeedStackParamList, 'StudentIdComplete'>;

export default function StudentIdCardCompleteScreen({ navigation }: EmailVerificationScreenProps) {
  const { t } = useTranslation('certification');

  const handleNavigationButton = () => {
    navigation.navigate('Tab', {
      screen: 'FeedTab',
      params: {
        screen: 'FeedHome',
      },
    } as any);
  };

  const CHARACTERS_RATIO = 306 / 229;

  return (
    <Layout preserveHeader>
      <InnerLayout>
        <View className="flex-1">
          <View className="flex-1">
            <Heading>{t('studentIdComplete.title')}</Heading>
            <HeadingDescription>{t('studentIdComplete.description')}</HeadingDescription>
          </View>
          <View className="flex-1 items-center">
            <View className="mt-6" style={{ width: '90%', aspectRatio: CHARACTERS_RATIO }}>
              <Characters width="100%" height="100%" />
            </View>
          </View>
        </View>
        <Button onPress={handleNavigationButton}>
          <MyText size="text-lg" className="font-semibold" color="text-white">
            {t('studentIdComplete.complete')}
          </MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
