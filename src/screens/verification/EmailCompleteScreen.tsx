import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useModalStore } from '@/store';
import Characters from '@assets/images/verification/characters.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type EmailCompleteScreenProps = NativeStackScreenProps<FeedStackParamList, 'EmailComplete'>;

export default function EmailCompleteScreen({ navigation, route }: EmailCompleteScreenProps) {
  const { t } = useTranslation('certification');
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const { pointChange, currentPoint } = route.params;

  useEffect(() => {
    if (pointChange !== 0) {
      const timer = setTimeout(() => {
        handleModalOpen('point', {
          usedPoint: pointChange,
          currentPoint: currentPoint,
          action: 'INCREASE',
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pointChange, currentPoint]);

  const handleNavigateButton = () => {
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
            <Heading>{t('verificationComplete.title')}</Heading>
            <HeadingDescription>{t('verificationComplete.description')}</HeadingDescription>
          </View>
          <View className="flex-1 items-center">
            <View className="mt-6" style={{ width: '90%', aspectRatio: CHARACTERS_RATIO }}>
              <Characters width="100%" height="100%" />
            </View>
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
