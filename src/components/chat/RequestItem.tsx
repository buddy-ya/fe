import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { ChatRequest } from '@/types';
import { COUNTRY_FLAGS } from '@/utils';
import { MyText } from '../common';
import { ProfileImage } from './ProfileImage';

interface RequestItemProps {
  request: ChatRequest;
  onProfilePress?: (id: number) => void;
  onAccept?: (receiverId: number) => void;
  onDecline?: (chatRequestId: number) => void;
}

export default function RequestItem({
  request,
  onProfilePress,
  onAccept,
  onDecline,
}: RequestItemProps) {
  const { id, senderId, university, name, country, profileImageUrl, createdDate } = request;

  const { t } = useTranslation('chat');

  const handleProfilePress = () => {
    onProfilePress?.(senderId);
  };

  const handleAccept = () => {
    onAccept?.(senderId);
  };

  const handleDecline = () => {
    onDecline?.(id);
  };

  return (
    <View className="mt-3 h-[60px] w-full flex-row flex-wrap items-center justify-between rounded-[13px] bg-white p-2">
      <View className="h-full flex-1 flex-row items-center">
        <ProfileImage imageUrl={profileImageUrl} onPress={handleProfilePress} />
        <View className="ml-3 flex h-[40px] flex-1 justify-between">
          <MyText numberOfLines={1} color="text-[#474747]" className="font-semibold">
            {university}
          </MyText>
          <MyText numberOfLines={1} color="text-[#474747]">
            {name} {COUNTRY_FLAGS[country]}
          </MyText>
        </View>
      </View>
      <View className="ml-4 h-[38px] w-[110px] flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex h-[30px] w-[52px] items-center justify-center rounded-lg bg-[#DFDFDF]"
          onPress={handleDecline}
        >
          <MyText className="font-semibold text-white">{t('requests.decline')}</MyText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex h-[30px] w-[52px] items-center justify-center rounded-lg bg-[#00A176]"
          onPress={handleAccept}
        >
          <MyText className="font-semibold text-white">{t('requests.accept')}</MyText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
