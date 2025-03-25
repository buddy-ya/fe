import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, AppState, AppStateStatus, ScrollView } from 'react-native';
import { InnerLayout, Layout, MyText } from '@/components';
import { MatchstackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatchStore } from '@/store/useMatchStore';
import MatchRepository from '@/api/MatchRepository';
import { logError } from '@/utils';
import NotRequestedView from '@/components/match/NotRequestedView';
import PendingView from '@/components/match/PendingView';
import SuccessView from '@/components/match/SuccessView';

type MatchScreenProps = NativeStackScreenProps<MatchstackParamList, 'MatchHome'>;

export default function MatchScreen({ navigation }: MatchScreenProps) {
  const { t } = useTranslation('match');

  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const matchStatus = useMatchStore((state) => state.matchStatus);
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

  useEffect(() => {
    fetchMatchStatus();
  }, [fetchMatchStatus]);

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
    universityType,
    genderType,
  }: {
    universityType: 'SAME' | 'DIFFERENT';
    genderType: 'MALE' | 'FEMALE' | 'ALL';
  }) => {
    const request = { universityType, genderType };
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
      }, 2000);
    } catch (error) {
      logError(error);
    }
  };

  const handlePointPress = () => {};

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  const renderMatchContent = () => {
    switch (matchStatus) {
      case 'pending':
        return <PendingView navigation={navigation} />;
      case 'success':
        return <SuccessView />;
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
        <MyText size="text-2xl" color="text-black" className="font-semibold">
          {t('match.title')}
        </MyText>
      }
      headerRight={
        <TouchableOpacity onPress={handlePointPress} className="mr-3">
          <MyText size="text-xl" color="text-black" className="font-semibold">
            {point}
          </MyText>
        </TouchableOpacity>
      }
    >
      <InnerLayout>{renderMatchContent()}</InnerLayout>
    </Layout>
  );
}
