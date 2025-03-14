import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Linking } from 'react-native';
import { AuthRepository, UserRepository } from '@/api';
import { Layout, InnerLayout, MyText } from '@/components';
import i18n from '@/i18n';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import { PRIVACY_POLICY_URL } from '@/utils';

interface SettingItemProps {
  emoji: string; // 이모지를 따로 받음
  label: string; // 번역 텍스트
  onPress: () => void;
  borderBottom?: boolean;
}

const SettingItem = ({ emoji, label, onPress, borderBottom = true }: SettingItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center justify-between px-4 py-[16px] ${borderBottom ? 'border-b border-borderBottom' : ''}`}
  >
    <View className="flex-row items-center">
      <MyText className="mr-3 text-lg">{emoji}</MyText>
      <MyText className="font-medium">{label}</MyText>
    </View>
    <ChevronRight color="#636363" width={19} height={19} strokeWidth={1.6} />
  </TouchableOpacity>
);

type SettingScreenProps = NativeStackScreenProps<MyPageStackParamList, 'Settings'>;

export default function SettingScreen({ navigation }: SettingScreenProps) {
  const { t } = useTranslation('mypage');
  const update = useUserStore((state) => state.update);
  const init = useUserStore((state) => state.init);

  const handlePrivacyPolicyPress = () => {
    const url = i18n.language === 'ko' ? PRIVACY_POLICY_URL.ko : PRIVACY_POLICY_URL.en;
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  // 그룹1: 상단 박스 (문의하기, 이용약관, 개인정보처리방침)
  const group1 = [
    // {
    //   key: 'inquiry',
    //   emoji: '💬',
    //   label: t('menuItems.inquiry'),
    //   onPress: () => {
    //     console.log('문의하기 클릭');
    //   },
    // },
    // {
    //   key: 'terms',
    //   emoji: '📃',
    //   label: t('menuItems.terms'),
    //   onPress: () => {
    //     Linking.openURL(
    //       'https://thinkable-durian-178.notion.site/1b1badc2aadc80878bd2f2c08e026fa4?pvs=4'
    //     ).catch((err) => console.error('Error opening privacy:', err));
    //   },
    // },
    {
      key: 'privacy',
      emoji: '🔒',
      label: t('menuItems.privacy'),
      onPress: handlePrivacyPolicyPress,
    },
  ];

  // 그룹2: 하단 박스 (로그아웃, 회원탈퇴, 갱신)
  const group2 = [
    {
      key: 'logout',
      emoji: '🚪',
      label: t('menuItems.logout'),
      onPress: async () => {
        await TokenService.remove();
        update({ isAuthenticated: false });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      },
    },
    {
      key: 'delete',
      emoji: '👋',
      label: t('menuItems.delete'),
      onPress: async () => {
        await UserRepository.delete();
        await TokenService.remove();
        update({ isAuthenticated: false });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      },
    },
    // {
    //   key: 'refresh',
    //   emoji: '🔄',
    //   label: t('menuItems.refresh'),
    //   onPress: async () => {
    //     await AuthRepository.refreshStudentCertification();
    //     update({ isCertificated: false });
    //     update({ isStudentIdCardRequested: false });
    //   },
    // },
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
        <View className="mt-4">
          <View className="rounded-xl bg-white">
            {group1.map((item, index) => (
              <Fragment key={item.key}>
                <SettingItem
                  emoji={item.emoji}
                  label={item.label}
                  onPress={item.onPress}
                  borderBottom={index < group1.length - 1}
                />
              </Fragment>
            ))}
          </View>
          <View className="mt-6 rounded-xl bg-white">
            {group2.map((item, index) => (
              <Fragment key={item.key}>
                <SettingItem
                  emoji={item.emoji}
                  label={item.label}
                  onPress={item.onPress}
                  borderBottom={index < group2.length - 1}
                />
              </Fragment>
            ))}
          </View>
        </View>
      </InnerLayout>
    </Layout>
  );
}
