import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { ChatRequest } from '@/types';
import { COUNTRY_FLAGS } from '@/utils';
import { MyText } from '../common';
import { ProfileImage } from './ProfileImage';

interface RequestItemProps {
  request: ChatRequest;
  onProfilePress?: (id: number, showMatchingProfile: boolean) => void;
  onAccept?: (receiverId: number, chatRequestId: number) => Promise<void> | void;
  onDecline?: (chatRequestId: number) => Promise<void> | void;
}

export default function RequestItem({
  request,
  onProfilePress,
  onAccept,
  onDecline,
}: RequestItemProps) {
  const { id, senderId, university, name, country, profileImageUrl } = request;
  const { t } = useTranslation(['chat', 'mypage']);

  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  const handleProfilePress = () => {
    onProfilePress?.(senderId, false);
  };

  const handleAcceptPress = async () => {
    if (accepting) return;
    setAccepting(true);
    try {
      await onAccept?.(senderId, id);
    } finally {
      setTimeout(() => {
        setAccepting(false);
      }, 500);
    }
  };

  const handleDeclinePress = async () => {
    if (declining) return;
    setDeclining(true);
    try {
      await onDecline?.(id);
    } finally {
      setTimeout(() => {
        setDeclining(false);
      }, 500);
    }
  };

  return (
    <View className="mt-3 w-full flex-row items-center justify-between rounded-[13px] bg-white p-3">
      <View className="flex-1 flex-row items-center">
        <ProfileImage imageUrl={profileImageUrl} onPress={handleProfilePress} />
        <View className="ml-3 flex-1 justify-between">
          <MyText numberOfLines={1} color="text-[#474747]" className="font-semibold">
            {t(`universities:universities.${university}`)}
          </MyText>
          <MyText numberOfLines={1} color="text-[#474747]">
            {name} {COUNTRY_FLAGS[country]}
          </MyText>
        </View>
      </View>
      <View className="ml-4 flex-row items-center">
        {/* 거절 버튼: 클릭 중에는 disabled 처리만 */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="min-w-[56px] items-center justify-center rounded-lg bg-[#DFDFDF] p-2"
          onPress={handleDeclinePress}
          disabled={declining}
        >
          <MyText className="font-semibold text-white" numberOfLines={1}>
            {t('requests.decline')}
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="ml-2 min-w-[56px] items-center justify-center rounded-lg bg-[#00A176] p-2"
          onPress={handleAcceptPress}
          disabled={accepting}
        >
          <MyText className="font-semibold text-white" numberOfLines={1}>
            {t('requests.accept')}
          </MyText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
