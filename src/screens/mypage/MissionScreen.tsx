import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InnerLayout, Layout, MyText } from '@/components';
import CalendarMission from '@assets/icons/calendar.svg';
import MissionKo from '@assets/icons/missionKo.svg';
import PointIcon from '@assets/icons/point.svg';
import SchoolMission from '@assets/icons/schoolVerificationMission.svg';
import * as Localization from 'expo-localization';

type Mission = {
  id: string;
  Icon: React.FC<any>;
  title: string;
  description: string;
  point: number;
  type: 'claim' | 'navigate';
  onPress: () => void;
};

export default function MissionScreen({ navigation }: any) {
  const { t } = useTranslation('mypage');
  const BANNER_RATIO = 375 / 200;
  const locale = Localization.locale;
  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + 50;

  const missions: Mission[] = [
    {
      id: 'attendance',
      Icon: CalendarMission,
      title: t('mission.attendance.title'),
      description: t('mission.attendance.description'),
      point: 10,
      type: 'claim',
      onPress: () => {
        // 포인트 즉시 지급 처리 로직 (api 콜이나 스토어 업데이트)
        console.log('출석 미션 포인트 지급!');
      },
    },
    {
      id: 'verification',
      Icon: SchoolMission,
      title: t('mission.verification.title'),
      description: t('mission.verification.description'),
      point: 100,
      type: 'navigate',
      onPress: () => navigation.navigate('Verification', { screen: 'VerificationSelect' }),
    },
  ];

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <MyText size="text-lg" className="font-semibold">
          {t('mission.mission')}
        </MyText>
      }
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={{ width: '100%', aspectRatio: BANNER_RATIO }}>
          <MissionKo width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        </View>

        <InnerLayout className="mt-7">
          {missions.map(({ id, Icon, title, description, point, type, onPress }) => (
            <View key={id} className="mb-3">
              <TouchableOpacity
                onPress={type === 'navigate' ? onPress : undefined}
                activeOpacity={type === 'navigate' ? 0.7 : 1}
                className={`flex-row items-center rounded-[12px] bg-white px-4 py-6`}
              >
                <Icon />
                <View className="ml-5 flex-1">
                  <MyText size="text-lg" className="font-semibold">
                    {title}
                  </MyText>
                  <MyText size="text-sm" className="mt-1">
                    {description}
                  </MyText>
                </View>
                <TouchableOpacity
                  onPress={type === 'claim' ? onPress : undefined}
                  activeOpacity={0.7}
                  className={`flex-row items-center rounded-[8px] px-[10px] py-[5px] ${
                    type === 'claim' ? 'bg-primary' : ''
                  }`}
                >
                  <PointIcon width={15} height={15} />
                  <MyText
                    color={type === 'claim' ? 'text-white' : ''}
                    className="ml-[5px] font-semibold"
                  >
                    {point}
                  </MyText>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))}
        </InnerLayout>
      </ScrollView>
      <View
        className="absolute bottom-0 w-full border-t border-[#F6F6F6] bg-[#F7FFFE] p-5 px-6"
        style={{ height: footerHeight }}
      >
        <View className="flex-row items-center justify-between">
          <MyText className="font-medium">{t('mission.summary')}</MyText>
          <View className="flex-row items-center">
            <PointIcon width={16} height={16} />
            <MyText size="text-lg" className="ml-[5px] font-semibold">
              {100}
            </MyText>
          </View>
        </View>
      </View>
    </Layout>
  );
}
