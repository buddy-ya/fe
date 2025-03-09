import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { VerificationStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type VerificationScreenProps = NativeStackScreenProps<
  VerificationStackParamList,
  'VerificationSelect'
>;

export default function VerificationScreen({ navigation }: VerificationScreenProps) {
  const { t } = useTranslation('mypage');

  const handleEamilVerification = useCallback(() => {
    navigation.navigate('EmailVerification');
  }, []);

  const handleStudentIdVerification = useCallback(() => {
    navigation.navigate('StudentIdVerification');
  }, []);

  const isStudentIdCardRequested = useUserStore((state) => state.isStudentIdCardRequested);

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <MyText size="text-lg" className="font-semibold">
            {t('quickMenu.verification')}
          </MyText>
        </View>
      }
    >
      <InnerLayout>
        <HeadingDescription className="mt-2">{t('verification.description')}</HeadingDescription>
        <View className="mt-5 flex-col gap-4">
          <TouchableOpacity
            onPress={handleEamilVerification}
            disabled={isStudentIdCardRequested}
            className={`rounded-xl`}
          >
            <View className="flex justify-between rounded-xl bg-white p-4">
              <MyText
                size="text-xl"
                className={`font-semibold ${isStudentIdCardRequested ? 'text-[#CBCBCB]' : 'text-text'}`}
              >
                {t('verification.email.title')}
              </MyText>
              <MyText
                size="text-[13px]"
                className={`mt-2 ${isStudentIdCardRequested ? 'text-[#CBCBCB]' : 'text-textDescription'}`}
              >
                {t('verification.email.description')}
              </MyText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStudentIdVerification}>
            <View className="flex justify-between rounded-xl bg-white p-4">
              <MyText size="text-xl" className="font-semibold">
                {t('verification.students.title')}
              </MyText>
              <MyText size="text-[13px]" className="mt-2" color="text-[#797979]">
                {t('verification.students.description')}
              </MyText>
            </View>
          </TouchableOpacity>
        </View>
      </InnerLayout>
    </Layout>
  );
}
