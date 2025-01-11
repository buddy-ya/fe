import { resetToOnboarding } from '@/navigation/router';
import LogoIcon from '@assets/icons/logo.svg';
import { Bell, Bookmark, ChevronRight, NotebookPen, Settings } from 'lucide-react-native';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Image } from 'react-native';
import { useProfileStore } from '@/store';
import { getCountryFlag } from '@/utils';
import { InnerLayout, Layout, MyText } from '@/components';
import { AuthRepository, UserRepository } from '@/api';
import { TokenService } from '@/service';

const SettingItem = ({ label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between bg-white px-4 py-4"
  >
    <MyText className="text-gray-900">{label}</MyText>
    <View className="h-2 w-2 rotate-45 border-r border-t border-gray-400" />
  </TouchableOpacity>
);

export default function MyPageScreen({ navigation }) {
  const { t } = useTranslation('mypage');
  const { profile, setProfile } = useProfileStore();

  const fetchMyProfile = async () => {
    const profileData = await UserRepository.get();
    setProfile(profileData);
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMyProfile();
    });

    return unsubscribe;
  }, [navigation]);

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
        resetToOnboarding();
      }
    },
    {
      key: 'refresh',
      label: t('menuItems.refresh'),
      onPress: async () => {
        await AuthRepository.refreshStudentCertification();
      },
    },
    { key: 'privacy', label: t('menuItems.privacy'), onPress: () => console.log('privacy') },
    { key: 'terms', label: t('menuItems.terms'), onPress: () => console.log('terms') },
    { key: 'version', label: t('menuItems.version'), onPress: () => console.log('version') },
  ];

  const handleNotification = () => {
    navigation.navigate('Notifications');
  };

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
              source={{ uri: profile?.profileImageUrl }}
              className="mr-3 h-[54] w-[54] rounded-[12px]"
            />
            <View className="flex-1">
              <MyText color="text-textProfile" className="font-semibold">
                {t(`profile.university.${profile?.university}`)}
              </MyText>
              <View className="flex-row items-center">
                <MyText size="text-base" color="text-textProfile">
                  {profile?.name}
                </MyText>
                <MyText size="text-lg" className="ml-1">
                  {profile?.country && getCountryFlag(profile.country)}
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
          {settingsItems.map((item, index) => (
            <Fragment key={item.key}>
              <SettingItem label={item.label} onPress={item.onPress} />
            </Fragment>
          ))}
        </View>
      </InnerLayout>
    </Layout>
  );
}
