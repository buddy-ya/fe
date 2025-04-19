import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Text } from 'react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '@/store';
import { User } from '@/types';
import { useMatchStore } from '@/store/useMatchStore';
import MatchRepository from '@/api/MatchRepository';
import { isAndroid } from '@/utils';
import { InnerLayout, MyText } from '../common';
import ProfileView from '../my/ProfileView';

export default function SuccessView({ navigation }: any) {
  const updateMatchData = useMatchStore((state) => state.updateMatchData);
  const matchData = useMatchStore((state) => state.matchData);
  const showToast = useToastStore((state) => state.showToast);

  const { t } = useTranslation('match');

  const handlePressCancel = async () => {
    try {
      await MatchRepository.deleteMatchRequest();
      updateMatchData({ matchStatus: 'not_requested' });
    } catch (error) {}
  };

  const handlePressChat = async () => {
    try {
      await MatchRepository.deleteMatchRequest();
      updateMatchData({ matchStatus: 'not_requested' });
      if (matchData?.isExited) {
        showToast(<MyText>💬</MyText>, t('common:toast.error.chatRoom'), 2000);
        return;
      }
      navigation.getParent()?.navigate('Chat', {
        screen: 'ChatRoom',
        params: { id: matchData?.chatRoomId },
      });
    } catch (error) {}
  };

  const insets = useSafeAreaInsets();
  const tabBarHeight = isAndroid ? 65 : 80;
  const BottomButtonPosition = tabBarHeight - insets.bottom - 8;

  return (
    <View className="relative flex-1">
      <InnerLayout>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          className="pt-4"
        >
          {matchData && (
            <View className="rounded-xl bg-white">
              <View className="my-7 items-center">
                <MyText size="text-xl" className="font-semibold">
                  {t('match.success.title')}
                </MyText>
                <MyText size="text-lg" className="mt-3 text-center">
                  {t('match.success.description')}
                </MyText>
              </View>
              <ProfileView
                user={matchData as User}
                isMyProfile={false}
                showMatchingProfile={true}
              />
              <View className={`mb-8 flex-row items-center justify-between gap-8 bg-white px-4`}>
                <TouchableOpacity
                  onPress={handlePressCancel}
                  className="flex-1 items-center justify-center rounded-xl bg-[#E8E9EB] py-[12px]"
                >
                  <MyText size="text-lg" color="text-white" className="font-semibold">
                    {t('match.success.cancel')}
                  </MyText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePressChat}
                  className="flex-1 items-center justify-center rounded-xl bg-primary py-[12px]"
                >
                  <MyText size="text-lg" color="text-white" className="font-semibold">
                    {t('match.success.button')}
                  </MyText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </InnerLayout>
    </View>
  );
}
