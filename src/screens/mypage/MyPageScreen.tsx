import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Image } from 'react-native';
import { AuthRepository, UserRepository } from '@/api';
import { InnerLayout, Layout, MyText } from '@/components';
import { useBackButton } from '@/hooks';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import LogoIcon from '@assets/icons/logo.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, Bookmark, ChevronRight, NotebookPen, Settings } from 'lucide-react-native';
import { CountryID, getCountryFlag } from '@/utils';

interface SettingItemProps {
  label: string;
  onPress: () => void;
}

const SettingItem = ({ label, onPress }: SettingItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between bg-white px-4 py-4"
  >
    <MyText className="text-gray-900">{label}</MyText>
    <View className="h-2 w-2 rotate-45 border-r border-t border-gray-400" />
  </TouchableOpacity>
);

type MyPageScreenProps = NativeStackScreenProps<MyPageStackParamList, 'MyPageHome'>;

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const { t } = useTranslation('mypage');

  const profileImageUrl = useUserStore((state) => state.profileImageUrl);
  const name = useUserStore((state) => state.name);
  const country = useUserStore((state) => state.country);
  const university = useUserStore((store) => store.university);
  const update = useUserStore((state) => state.update);

  const quickMenuItems = [
    {
      key: 'bookmark',
      label: t('quickMenu.bookmark'),
      icon: Bookmark,
      onPress: () => navigation.navigate('Bookmark'),
    },
    {
      key: 'myPosts',
      label: t('quickMenu.myPosts'),
      icon: NotebookPen,
      onPress: () => navigation.navigate('MyPosts'),
    },
    {
      key: 'settings',
      label: t('quickMenu.settings'),
      icon: Settings,
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const settingsItems = [
    {
      key: 'delete',
      label: t('menuItems.delete'),
      onPress: async () => {
        await UserRepository.delete();
        await TokenService.remove();
        update({ isAuthenticated: false });
      },
    },
    {
      key: 'refresh',
      label: t('menuItems.refresh'),
      onPress: async () => {
        await AuthRepository.refreshStudentCertification();
        update({ isCertificated: false });
      },
    },
    { key: 'privacy', label: t('menuItems.privacy'), onPress: () => console.log('privacy') },
    { key: 'terms', label: t('menuItems.terms'), onPress: () => console.log('terms') },
    { key: 'version', label: t('menuItems.version'), onPress: () => console.log('version') },
  ];

  const handleNotification = () => {
    console.log('notification pressed!');
  };

  useBackButton();

  return (
    <Layout
      showHeader
      headerLeft={<LogoIcon />}
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleNotification}>
            <Bell strokeWidth={2} size={24} color="#797977" />
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
                {t(`profile.university.${university}`)}
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

        <View className="mt-3 flex-row justify-around rounded-[20px] bg-white py-5">
          {quickMenuItems.map(({ key, label, icon: Icon, onPress }) => (
            <TouchableOpacity key={key} className="items-center" onPress={onPress}>
              <View className="mb-1">
                <Icon size={24} color="#282828" />
              </View>
              <MyText>{label}</MyText>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-4 bg-white">
          {settingsItems.map((item) => (
            <Fragment key={item.key}>
              <SettingItem label={item.label} onPress={item.onPress} />
            </Fragment>
          ))}
        </View>
      </InnerLayout>
    </Layout>
  );
}
