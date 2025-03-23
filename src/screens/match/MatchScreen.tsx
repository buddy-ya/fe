import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { InnerLayout, Layout, MyText } from '@/components';
import { MatchDTO } from '@/types';
import MatchRepository from '@/api/MatchRepository';
import NotRequestedView from '@/components/match/NotRequestedView';
import PendingView from '@/components/match/PendingView';
import SuccessView from '@/components/match/SuccessView';

export default function MatchingScreen() {
  const { t } = useTranslation('match');
  const [matchData, setMatchData] = useState<MatchDTO | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const fetchMatchStatus = useCallback(async () => {
    try {
      const data = await MatchRepository.getStatus();
      setMatchData(data);
      console.log('Match status:', data.matchStatus);
    } catch (error) {
      console.error(error);
    }
  }, []);

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

  const handleMatchRequest = async (request) => {
    const data = await MatchRepository.createMatchRequest(request);
    setMatchData(data);
  };

  const handlePointPress = () => {};

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  const renderMatchContent = () => {
    switch (matchData?.matchStatus) {
      case 'pending':
        return <PendingView />;
      case 'success':
        return <SuccessView />;
      case 'not_requested':
      default:
        return <NotRequestedView handleMatchRequest={handleMatchRequest} />;
    }
  };

  return (
    <Layout
      hasTabBar
      showHeader
      headerLeft={
        <MyText size="text-2xl" color="text-black" className="font-semibold">
          매칭
        </MyText>
      }
      headerRight={
        <TouchableOpacity onPress={handlePointPress} className="mr-3">
          <MyText size="text-xl" color="text-black" className="font-semibold">
            100
          </MyText>
        </TouchableOpacity>
      }
    >
      <InnerLayout>{renderMatchContent()}</InnerLayout>
    </Layout>
  );
}
