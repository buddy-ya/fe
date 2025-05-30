import { useTranslation } from 'react-i18next';
import { Text, View, Image } from 'react-native';
import { Heading, HeadingDescription, InnerLayout, Layout, Button } from '@/components';
import { OnboardingStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StudentInfoScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardingStudentInfo'
>;

export default function StudentInfoScreen({ navigation, route }: StudentInfoScreenProps) {
  const { t } = useTranslation('onboarding');
  const handleNavigate = () => {
    navigation.replace('OnboardingUniversitySelect');
  };
  return (
    <Layout>
      <InnerLayout>
        <Heading>{t('studentInfo.title')}</Heading>
        <HeadingDescription>{t('studentInfo.description')}</HeadingDescription>
        <View className="flex-1">
          {/* <Image className="w-[385px] h-[290px]" source={require('@assets/images/onboarding/id-card.png')} /> */}
        </View>
        <Button onPress={handleNavigate}>
          <Text className="font-semibold text-lg text-white">{t('common.next')}</Text>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
