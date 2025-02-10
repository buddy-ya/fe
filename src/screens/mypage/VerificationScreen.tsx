import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type VerificationScreenProps = NativeStackScreenProps<MyPageStackParamList, 'Verification'>;

export default function VerificationScreen({ navigation }: VerificationScreenProps) {
  const { t } = useTranslation('mypage');

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <MyText size="text-lg" className="font-bold">
            {t('quickMenu.verification')}
          </MyText>
        </View>
      }
    >
      <InnerLayout>
        <HeadingDescription>{t('verification.description')}</HeadingDescription>
        <View className="mt-3 flex-col gap-[10px]">
          <View className="flex h-[62px] justify-between rounded-xl bg-white p-[10px]">
            <MyText className="font-semibold text-lg">{t('verification.email.title')}</MyText>
            <MyText className="text-sm" color="text-[#797979]">
              {t('verification.email.description')}
            </MyText>
          </View>
          <View className="flex h-[82px] justify-between rounded-xl bg-white p-[10px]">
            <MyText className="font-semibold text-lg">{t('verification.students.title')}</MyText>
            <MyText className="text-sm" color="text-[#797979]">
              {t('verification.students.description')}
            </MyText>
          </View>
        </View>
      </InnerLayout>
    </Layout>
  );
}
