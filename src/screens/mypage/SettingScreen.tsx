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
import { Bookmark, ChevronRight, NotebookPen, Settings, ShieldAlert } from 'lucide-react-native';
import { CountryID, getCountryFlag } from '@/utils';
import ShieldCheck from './shieldCheck.svg';

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

type SettingScreenProps = NativeStackScreenProps<MyPageStackParamList, 'Settings'>;

export default function SettingScreen({ navigation }: SettingScreenProps) {
  const { t } = useTranslation('mypage');

  const profileImageUrl = useUserStore((state) => state.profileImageUrl);
  const name = useUserStore((state) => state.name);
  const country = useUserStore((state) => state.country);
  const university = useUserStore((store) => store.university);
  const update = useUserStore((state) => state.update);
  const isCertificated = useUserStore((state) => state.isCertificated);

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
        update({ isStudentIdCardRequested: false });
      },
    },
    { key: 'privacy', label: t('menuItems.privacy'), onPress: () => console.log('privacy') },
    { key: 'terms', label: t('menuItems.terms'), onPress: () => console.log('terms') },
    { key: 'version', label: t('menuItems.version'), onPress: () => console.log('version') },
  ];

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <MyText size="text-lg" className="font-semibold">
            {t('setting')}
          </MyText>
        </View>
      }
    >
      <InnerLayout>
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
