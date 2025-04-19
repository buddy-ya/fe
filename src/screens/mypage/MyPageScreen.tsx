import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { InnerLayout, KeyboardLayout, Layout, MyText } from '@/components';
import { useBackButton } from '@/hooks';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import CircleCheck from '@assets/icons/circleCheck.svg';
import EventBannerEn from '@assets/icons/eventBannerEn.svg';
import EventBannerKo from '@assets/icons/eventBannerKo.svg';
import LogoIcon from '@assets/icons/logo.svg';
import Point from '@assets/icons/point.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Localization from 'expo-localization';
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
  const point = useUserStore((state) => state.point);
  const update = useUserStore((state) => state.update);
  const isCertificated = useUserStore((state) => state.isCertificated);
  const BANNER_RATIO = 344 / 155;

  const handlePointPress = () => {
    navigation.navigate('Point');
  };

  const handleInvitationEventPress = () => {
    navigation.navigate('InvitationEvent');
  };

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

  const locale = Localization.locale;

  return (
    <Layout
      showHeader
      headerLeft={
        <MyText size="text-2xl" className="font-semibold">
          {t('title')}
        </MyText>
      }
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
          className="mt-3 flex-row items-center rounded-[12px] bg-white p-5"
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
                <MyText size="text-base" color="text-textProfile" className="font-medium">
                  {name}
                </MyText>
                <MyText size="text-lg" className="ml-1">
                  {country && getCountryFlag(country as CountryID)}
                </MyText>
              </View>
            </View>
            <ChevronRight size={24} color="#636363" strokeWidth={1.3} />
          </View>
        </TouchableOpacity>
        <View className="mt-4 flex-row rounded-t-[12px] bg-white pb-5 pt-5">
          {quickMenuItems.map(({ key, label, icon, onPress }) => (
            <TouchableOpacity
              key={key}
              className="flex-1 items-center"
              onPress={onPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View className="mb-1">{icon}</View>
              {label}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          className="flex-row items-center justify-between rounded-b-[12px] border-t border-[#f6f6f6] bg-white p-5"
          onPress={handlePointPress}
        >
          <View>
            <MyText className="font-medium">{t('point.point')}</MyText>
          </View>
          <View className="flex-row items-center">
            <View className="mr-4 flex-row items-center gap-2">
              <Point />
              <MyText className="ml-1 font-medium">{point}</MyText>
            </View>
            <View>
              <ChevronRight size={19} color="#636363" strokeWidth={1.3} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="mt-7 items-center" onPress={handleInvitationEventPress}>
          <View style={{ width: '100%', aspectRatio: BANNER_RATIO }}>
            {locale.startsWith('ko') ? (
              <EventBannerKo width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
            ) : (
              <EventBannerEn width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
            )}
          </View>
        </TouchableOpacity>
      </InnerLayout>
    </Layout>
  );
}
