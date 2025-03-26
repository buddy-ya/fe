import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Text } from 'react-native';
import { ScrollView } from 'react-native';
import { useToastStore } from '@/store';
import { User } from '@/types';
import { useMatchStore } from '@/store/useMatchStore';
import MatchRepository from '@/api/MatchRepository';
import { InnerLayout, MyText } from '../common';
import ProfileView from '../my/ProfileView';

export default function SuccessView({ navigation }: any) {
  const updateMatchData = useMatchStore((state) => state.updateMatchData);
  const matchData = useMatchStore((state) => state.matchData);
  const showToast = useToastStore((state) => state.showToast);

  const { t } = useTranslation('match');

  const handlePressCancel = async () => {
    try {
      const deleteMatchResponse = await MatchRepository.deleteMatchRequest();
      updateMatchData({ matchStatus: 'not_requested' });
    } catch (error) {}
  };

  const handlePressChat = async () => {
    try {
      // await MatchRepository.deleteMatchRequest();
      // updateMatchData({ matchStatus: 'not_requested' });
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

  return (
    <View className="flex-1">
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
                <MyText size="text-xl" className="font-semibold">
                  {t('match.success.description')}
                </MyText>
              </View>
              <ProfileView user={matchData as User} isMyProfile={false} />
            </View>
          )}
        </ScrollView>
      </InnerLayout>

      <View
        className={`absolute bottom-12 w-full flex-row items-center justify-between gap-8 border-t-[0.8px] border-[#DFDFDF] bg-white px-5 py-3`}
      >
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
  );
}
