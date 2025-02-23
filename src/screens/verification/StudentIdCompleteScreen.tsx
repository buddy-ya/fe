import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Heading, HeadingDescription, Layout, MyText } from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
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

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <View className="flex-1 px-5">
        <Heading>{t('studentIdComplete.title')}</Heading>
        <HeadingDescription>{t('studentIdComplete.description')}</HeadingDescription>
        <View className="flex-1" />
        <Button onPress={handleNavigationButton}>
          <MyText size="text-lg" className="font-semibold" color="text-white">
            {t('studentIdComplete.complete')}
          </MyText>
        </Button>
      </View>
    </Layout>
  );
}
