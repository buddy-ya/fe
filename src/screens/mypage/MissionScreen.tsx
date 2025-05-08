import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InnerLayout, Layout, MyText } from '@/components';
import { useModalStore } from '@/store';
import { MissionStatusResponseDTO } from '@/types/MissionDTO';
import CalendarMission from '@assets/icons/calendar.svg';
import MissionEn from '@assets/icons/missionEn.svg';
import MissionKo from '@assets/icons/missionKo.svg';
import PointIcon from '@assets/icons/point.svg';
import SchoolMission from '@assets/icons/schoolVerificationMission.svg';
import * as Localization from 'expo-localization';
import MissionRepository from '@/api/MissionRepository';

type Mission = {
  id: 'attendance' | 'verification';
  Icon: React.FC<any>;
  title: string;
  description: string;
  point: number;
  type: 'claim' | 'navigate';
  disabled: boolean;
  onPress: () => void;
};

export default function MissionScreen({ navigation }: any) {
  const { t } = useTranslation('mypage');
  const locale = Localization.locale;
  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + 54;
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const [isAttending, setIsAttending] = useState(false);
  const [missionStatus, setMissionStatus] = useState<MissionStatusResponseDTO>({
    hasCertificated: false,
    todayAttended: false,
    totalMissionPoint: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await MissionRepository.get();
        setMissionStatus(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  const missions: Mission[] = [
    {
      id: 'attendance',
      Icon: CalendarMission,
      title: t('mission.attendance.title'),
      description: t('mission.attendance.description'),
      point: 10,
      type: 'claim',
      disabled: missionStatus.todayAttended,
      onPress: async () => {
        if (isAttending) return;
        try {
          setIsAttending(true);
          const data = await MissionRepository.attend();
          setMissionStatus((prev) => ({
            ...prev,
            todayAttended: data.todayAttended,
            totalMissionPoint: data.totalMissionPoint,
          }));
          handleModalOpen('point', {
            usedPoint: data.pointChange,
            currentPoint: data.point,
            action: 'INCREASE',
          });
        } catch (error) {
        } finally {
          setIsAttending(false);
        }
      },
    },
    {
      id: 'verification',
      Icon: SchoolMission,
      title: t('mission.verification.title'),
      description: t('mission.verification.description'),
      point: 100,
      type: 'navigate',
      disabled: missionStatus.hasCertificated,
      onPress: () =>
        navigation.navigate('Verification', {
          screen: 'VerificationSelect',
        }),
    },
  ];

  return (
    <Layout
      showHeader
      isBackgroundWhite
      onBack={() => navigation.goBack()}
      headerCenter={
        <MyText size="text-lg" className="font-semibold">
          {t('mission.mission')}
        </MyText>
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
          backgroundColor: '#F6F6F6',
        }}
      >
        <View style={{ width: '100%', aspectRatio: 375 / 200 }}>
          {locale.startsWith('ko') ? (
            <MissionKo width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
          ) : (
            <MissionEn width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
          )}
        </View>

        <InnerLayout className="mt-7 bg-mainBackground">
          {missions.map(({ id, Icon, title, description, point, type, disabled, onPress }) => (
            <View key={id} className="mb-3">
              <TouchableOpacity
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
                className={`flex-row items-center rounded-[12px] bg-white px-4 py-6 ${type === 'navigate' && disabled && 'opacity-60'}`}
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

                {/* 포인트 or 완료 표시 */}
                {type === 'claim' ? (
                  <TouchableOpacity
                    onPress={!disabled ? onPress : undefined}
                    activeOpacity={!disabled ? 0.7 : 1}
                    className={`min-w-[54px] flex-row items-center justify-center rounded-[8px] px-[10px] py-[5px] ${
                      disabled ? 'bg-[#E8E9EB]' : 'bg-primary'
                    }`}
                  >
                    {disabled ? null : <PointIcon width={15} height={15} />}
                    <MyText
                      size=""
                      className={`font-semibold text-white ${!disabled && 'ml-[5px]'}`}
                    >
                      {disabled ? t('mission.completed') : point}
                    </MyText>
                  </TouchableOpacity>
                ) : (
                  <View
                    className={`ml-auto flex-row items-center rounded-[8px] px-[10px] py-[5px]`}
                  >
                    <PointIcon width={15} height={15} />
                    <MyText size="" className="ml-[5px] font-semibold">
                      {point}
                    </MyText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </InnerLayout>
      </ScrollView>

      <View
        className="absolute bottom-0 w-full border-t border-[#F6F6F6] bg-[#F7FFFE] p-5 px-7"
        style={{ height: footerHeight }}
      >
        <View className="flex-row items-center justify-between">
          <MyText className="font-medium">{t('mission.summary')}</MyText>
          <View className="flex-row items-center">
            <PointIcon width={16} height={16} />
            <MyText size="text-lg" className="ml-[5px] font-semibold">
              {missionStatus.totalMissionPoint}
            </MyText>
          </View>
        </View>
      </View>
    </Layout>
  );
}
