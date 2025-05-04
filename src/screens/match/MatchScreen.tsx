import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, AppState, AppStateStatus, ScrollView } from 'react-native';
import { InnerLayout, Layout, MyText } from '@/components';
import { useBackButton } from '@/hooks';
import { MatchstackParamList } from '@/navigation/navigationRef';
import { navigationRef } from '@/navigation/router';
import { useModalStore, useUserStore } from '@/store';
import Point from '@assets/icons/point.svg';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatchStore } from '@/store/useMatchStore';
import MatchRepository from '@/api/MatchRepository';
import NotRequestedView from '@/components/match/NotRequestedView';
import PendingView from '@/components/match/PendingView';
import SuccessView from '@/components/match/SuccessView';

type MatchScreenProps = NativeStackScreenProps<MatchstackParamList, 'MatchHome'>;

export default function MatchScreen({ navigation }: MatchScreenProps) {
  const { t } = useTranslation('match');

  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);

  const matchData = useMatchStore((state) => state.matchData);
  const updateMatchData = useMatchStore((state) => state.updateMatchData);
  const appStateRef = useRef(AppState.currentState);
  const point = useUserStore((state) => state.point);
  const userUpdate = useUserStore((state) => state.update);

  const fetchMatchStatus = useCallback(async () => {
    try {
      const data = await MatchRepository.getStatus();
      updateMatchData(data);
    } catch (error) {
      console.error(error);
    }
  }, [updateMatchData]);

  useFocusEffect(
    useCallback(() => {
      fetchMatchStatus();
    }, [fetchMatchStatus])
  );

  const handleAppStateChange = useCallback(
    (nextState: AppStateStatus) => {
      if (appStateRef.current !== 'active' && nextState === 'active') {
        fetchMatchStatus();
      }
      appStateRef.current = nextState;
    },
    [fetchMatchStatus]
  );

  const handleMatchRequest = async ({
    nationalityType,
    universityType,
    genderType,
  }: {
    nationalityType: 'KOREAN' | 'GLOBAL';
    universityType: 'SAME' | 'DIFFERENT';
    genderType: 'MALE' | 'FEMALE' | 'ALL';
  }) => {
    const request = { nationalityType, universityType, genderType };
    try {
      const matchResponse = await MatchRepository.createMatchRequest(request);
      userUpdate({ point: matchResponse.point });
      handleModalOpen('point', {
        usedPoint: matchResponse.pointChange,
        currentPoint: matchResponse.point,
        action: 'DECREASE',
      });
      setTimeout(() => {
        updateMatchData(matchResponse);
      }, 1000);
    } catch (error: any) {
      const errorCode = error.response?.data?.code;
      if (errorCode === 6004) {
        navigation.navigate('MyProfile', { incompleteProfile: true });
      }
      // if (errorCode === 10002) {
      //   navigation.navigate('Point');
      // }
    }
  };

  const handlePointPress = () => {
    navigation.navigate('Point');
  };

  useBackButton();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  if (!matchData) return;

  const renderMatchContent = () => {
    switch (matchData?.matchStatus) {
      case 'pending':
        return <PendingView navigation={navigation} />;
      case 'success':
        return <SuccessView navigation={navigation} />;
      case 'not_requested':
      default:
        return <NotRequestedView handleMatchRequest={handleMatchRequest} navigation={navigation} />;
    }
  };

  return (
    <Layout
      hasTabBar
      showHeader
      headerLeft={
        <MyText size="text-2xl" className="font-semibold">
          {t('match.title')}
        </MyText>
      }
      headerRight={
        <TouchableOpacity onPress={handlePointPress} className="mr-3 flex-row items-center">
          <Point width={18} height={18} />
          <MyText size="text-lg" color="text-black" className="ml-2 font-semibold">
            {point}
          </MyText>
        </TouchableOpacity>
      }
    >
      {renderMatchContent()}
    </Layout>
  );
}
