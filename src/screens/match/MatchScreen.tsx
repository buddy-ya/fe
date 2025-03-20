import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, MyText } from '@/components';
import { MatchDTO } from '@/types';
import MatchRepository from '@/api/MatchRepository';

// 단일 스크린 예시
export default function MatchingScreen() {
  const { t } = useTranslation('match');
  const insets = useSafeAreaInsets();

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

  // “매칭하기” 버튼 클릭 시 로직 (예: MatchRepository.requestMatch())
  const handleMatchRequest = () => {
    // TODO: 매칭 요청 POST → 응답이 pending이면 pending UI로 전환
  };

  // (선택) “?” 버튼 클릭 시 도움말/안내 등
  const handleQuestionPress = () => {
    // TODO: 매칭 안내 모달 or 별도 화면
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  return (
    <Layout
      hasTabBar
      showHeader
      // 상단 헤더에 "매칭" 타이틀 (i18n)
      headerLeft={<MyText>{t('title')}</MyText>} // match.title (ko: "매칭", en: "Matching")
      // 우측에 물음표 아이콘이나 버튼을 두고 싶다면 headerRight로 처리
      headerRight={
        <TouchableOpacity onPress={handleQuestionPress} className="mr-3">
          <Text className="text-white">?</Text>
        </TouchableOpacity>
      }
    >
      {/* 상단 (사용자 정보 영역) */}
      <View className="bg-[#4AA366] px-4 pb-3 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            {/* 대학명, 닉네임, 국기 등은 하드코딩 예시 */}
            <Text className="font-semibold text-base text-white">세종대학교</Text>
            <Text className="text-base text-white">Sweet Peach 🇺🇸</Text>
          </View>
          {/* 포인트 표시 */}
          <Text className="font-semibold text-base text-white">100</Text>
        </View>
      </View>

      {/* 본문 (매칭 조건 카드) */}
      <View className="flex-1 px-4 pt-4" style={{ paddingBottom: insets.bottom }}>
        <View className="rounded-xl bg-white p-4">
          <Text className="mb-4 font-semibold text-lg">
            {t('not_requested.title') /* ko: "매칭 조건을 선택해주세요!" */}
          </Text>

          {/* 학교 옵션 */}
          <View className="mb-4">
            <Text className="mb-2 font-medium text-base">학교</Text>
            <View className="flex-row justify-between">
              {/* 같은 학교 */}
              <TouchableOpacity className="items-center">
                {/* 실제 아이콘이 있으면 넣어주세요 */}
                <View className="mb-1 h-12 w-12 rounded-full bg-gray-200" />
                <Text className="text-sm">같은 학교</Text>
              </TouchableOpacity>
              {/* 다른 학교 */}
              <TouchableOpacity className="items-center">
                <View className="mb-1 h-12 w-12 rounded-full bg-gray-200" />
                <Text className="text-sm">다른 학교</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 성별 옵션 */}
          <View className="mb-6">
            <Text className="mb-2 font-medium text-base">성별</Text>
            <View className="flex-row justify-between">
              {/* 모두 */}
              <TouchableOpacity className="items-center">
                <View className="mb-1 h-12 w-12 rounded-full bg-gray-200" />
                <Text className="text-sm">모두</Text>
              </TouchableOpacity>
              {/* 남성 */}
              <TouchableOpacity className="items-center">
                <View className="mb-1 h-12 w-12 rounded-full bg-gray-200" />
                <Text className="text-sm">남성</Text>
              </TouchableOpacity>
              {/* 여성 */}
              <TouchableOpacity className="items-center">
                <View className="mb-1 h-12 w-12 rounded-full bg-gray-200" />
                <Text className="text-sm">여성</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 매칭하기 버튼 */}
          <TouchableOpacity
            className="h-12 w-full items-center justify-center rounded-full bg-[#4AA366]"
            onPress={handleMatchRequest}
          >
            <Text className="font-semibold text-base text-white">
              {t('not_requested.button') /* ko: "매칭하기" */}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
