import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InnerLayout, Layout, MyText } from '@/components';
import { useModalStore } from '@/store';
import { MissionStatusResponseDTO } from '@/types/MissionDTO';
// SVGs
import CalendarMission from '@assets/icons/calendar.svg';
import MissionEn from '@assets/icons/missionEn.svg';
import MissionKo from '@assets/icons/missionKo.svg';
import PointIcon from '@assets/icons/point.svg';
import SchoolMission from '@assets/icons/schoolVerificationMission.svg';
import * as Localization from 'expo-localization';
import MissionRepository from '@/api/MissionRepository';

type Mission = {
  id: string;
  Icon: React.FC<any>;
  title: string;
  description: string;
  point: number;
  variant: 'claim' | 'navigate';
  disabled: boolean;
  onPress: () => void;
};

export default function MissionScreen({ navigation }: any) {
  const { t } = useTranslation('mypage');
  const locale = Localization.locale;
  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + 54;
  const openModal = useModalStore((s) => s.handleOpen);

  const [missionStatus, setMissionStatus] = useState<MissionStatusResponseDTO>({
    hasCertificated: false,
    todayAttended: false,
    totalMissionPoint: 0,
  });
  const [loading, setLoading] = useState(false);

  // 초기 데이터 fetch
  useEffect(() => {
    MissionRepository.get().then(setMissionStatus).catch(console.error);
  }, []);

  const handleAttend = useCallback(async () => {
    if (loading || missionStatus.todayAttended) return;
    setLoading(true);
    try {
      const data = await MissionRepository.attend();
      setMissionStatus((prev) => ({
        ...prev,
        todayAttended: data.todayAttended,
        totalMissionPoint: data.totalMissionPoint,
      }));
      openModal('point', {
        usedPoint: data.pointChange,
        currentPoint: data.point,
        action: 'INCREASE',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [loading, missionStatus.todayAttended, openModal]);

  const missions: Mission[] = useMemo(
    () => [
      {
        id: 'attendance',
        Icon: CalendarMission,
        title: t('mission.attendance.title'),
        description: t('mission.attendance.description'),
        point: 10,
        variant: 'claim',
        disabled: missionStatus.todayAttended,
        onPress: handleAttend,
      },
      {
        id: 'verification',
        Icon: SchoolMission,
        title: t('mission.verification.title'),
        description: t('mission.verification.description'),
        point: 100,
        variant: 'navigate',
        disabled: missionStatus.hasCertificated,
        onPress: () => navigation.navigate('Verification', { screen: 'VerificationSelect' }),
      },
    ],
    [t, missionStatus.todayAttended, missionStatus.hasCertificated, handleAttend, navigation]
  );

  function MissionBanner({ locale }: { locale: string }) {
    return (
      <View style={{ width: '100%', aspectRatio: 375 / 200 }}>
        {locale.startsWith('ko') ? (
          <MissionKo width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <MissionEn width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        )}
      </View>
    );
  }

  // 리스트 컴포넌트
  function MissionList({ missions }: { missions: Mission[] }) {
    return (
      <>
        {missions.map((m) => (
          <View key={m.id} className="mb-3">
            <MissionItem mission={m} />
          </View>
        ))}
      </>
    );
  }

  function MissionItem({ mission }: { mission: Mission }) {
    const { Icon, title, description, point, variant, disabled, onPress } = mission;

    const containerStyle = [
      'flex-row items-center rounded-[12px] bg-white px-4 py-6',
      variant === 'navigate' && disabled ? 'opacity-60' : '',
    ].join(' ');

    const badge =
      variant === 'claim' ? (
        <TouchableOpacity
          onPress={disabled ? undefined : onPress}
          activeOpacity={disabled ? 1 : 0.7}
          className={[
            'min-w-[54px] flex-row items-center justify-center rounded-[8px] px-[10px] py-[5px]',
            disabled ? 'bg-[#E8E9EB]' : 'bg-primary',
          ].join(' ')}
        >
          {!disabled && <PointIcon width={15} height={15} />}
          <MyText className={`font-semibold text-white ${!disabled ? 'ml-[5px]' : ''}`}>
            {disabled ? t('mission.completed') : point}
          </MyText>
        </TouchableOpacity>
      ) : (
        <View className="ml-auto flex-row items-center rounded-[8px] px-[10px] py-[5px]">
          <PointIcon width={15} height={15} />
          <MyText className="ml-[5px] font-semibold">{point}</MyText>
        </View>
      );

    return (
      <TouchableOpacity
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        className={containerStyle}
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
        {badge}
      </TouchableOpacity>
    );
  }

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
          paddingBottom: 60,
          backgroundColor: '#F6F6F6',
        }}
      >
        <MissionBanner locale={locale} />
        <InnerLayout className="mt-7 bg-mainBackground">
          <MissionList missions={missions} />
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
