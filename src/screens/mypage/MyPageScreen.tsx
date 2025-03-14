import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Image } from 'react-native';
import { InnerLayout, Layout, MyText } from '@/components';
import { useBackButton } from '@/hooks';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import CircleCheck from '@assets/icons/circleCheck.svg';
import LogoIcon from '@assets/icons/logo.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bookmark, ChevronRight, NotebookPen, Settings, ShieldAlert } from 'lucide-react-native';
import { useToastStore } from '@/store/useToastStore';
import { CountryID, getCountryFlag } from '@/utils';
import ShieldCheck from './shieldCheck.svg';

type MyPageScreenProps = NativeStackScreenProps<MyPageStackParamList, 'MyPageHome'>;

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const { t } = useTranslation('mypage');

  const { showToast } = useToastStore();

  const profileImageUrl = useUserStore((state) => state.profileImageUrl);
  const name = useUserStore((state) => state.name);
  const country = useUserStore((state) => state.country);
  const university = useUserStore((store) => store.university);
  const update = useUserStore((state) => state.update);
  const isCertificated = useUserStore((state) => state.isCertificated);

  const quickMenuItems = [
    {
      key: 'bookmark',
      label: <MyText>{t('mypage:quickMenu.bookmark')}</MyText>,
      icon: <Bookmark size={24} color="#282828" strokeWidth={1.5} />,
      onPress: () => navigation.navigate('Bookmark'),
    },
    {
      key: 'myPosts',
      label: <MyText>{t('mypage:quickMenu.myPosts')}</MyText>,
      icon: <NotebookPen size={24} color="#282828" strokeWidth={1.5} />,
      onPress: () => navigation.navigate('MyPosts'),
    },
    {
      key: 'verification',
      label: (
        <MyText color={`${isCertificated && 'text-[#CBCBCB]'}`}>
          {t('mypage:quickMenu.verification')}
        </MyText>
      ),
      icon: isCertificated ? (
        <ShieldCheck />
      ) : (
        <ShieldAlert size={24} color="#282828" strokeWidth={1.5} />
      ),
      onPress: isCertificated
        ? () => {
            handleShowToast();
          }
        : () => navigation.navigate('Verification', { screen: 'Verification' } as any),
    },
  ];

  const handleShowToast = () => {
    showToast(<CircleCheck />, t('mypage:certification'));
  };

  const handleNotification = () => {
    navigation.navigate('Settings');
  };

  useBackButton();

  return (
    <Layout
      showHeader
      headerLeft={<LogoIcon />}
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleNotification}>
            <Settings strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
        </View>
      }
    >
      <InnerLayout>
        <TouchableOpacity
          className="mt-3 flex-row items-center rounded-[20px] bg-white p-5"
          onPress={() => navigation.navigate('MyProfile')}
        >
          <View className="flex-row items-center bg-white">
            <Image
              source={{ uri: profileImageUrl }}
              className="mr-3 h-[54] w-[54] rounded-[12px]"
            />
            <View className="flex-1">
              <MyText color="text-textProfile" className="font-semibold">
                {t(`universities:universities.${university}`)}
              </MyText>
              <View className="flex-row items-center">
                <MyText size="text-base" color="text-textProfile">
                  {name}
                </MyText>
                <MyText size="text-lg" className="ml-1">
                  {country && getCountryFlag(country as CountryID)}
                </MyText>
              </View>
            </View>
            <ChevronRight size={24} color="#CBCBCB" />
          </View>
        </TouchableOpacity>
        <View className="mt-4 flex-row justify-around rounded-[20px] bg-white py-5">
          {quickMenuItems.map(({ key, label, icon, onPress }) => (
            <TouchableOpacity key={key} className="items-center" onPress={onPress}>
              <View className="mb-1">{icon}</View>
              {label}
            </TouchableOpacity>
          ))}
        </View>
      </InnerLayout>
    </Layout>
  );
}
