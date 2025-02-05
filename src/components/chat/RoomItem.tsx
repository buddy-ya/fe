import { View, TouchableOpacity } from 'react-native';
import { Room } from '@/types';
import { getTimeAgo } from '@/utils';
import { MyText } from '../common';
import { ProfileImage } from './ProfileImage';
import { UnreadCountChip } from './UnreadCountChip';

interface RoomItemProps {
  room: Room;
  onPress?: (id: number) => void;
}

export default function RoomItem({ room, onPress }: RoomItemProps) {
  const { id, name, lastMessage, profileImageUrl, unreadCount, lastMessageDate } = room;

  const handleClick = () => {
    onPress?.(id);
  };

  const computedUnreadCount =
    unreadCount > 999 ? unreadCount.toString().slice(0, 3) + '+' : unreadCount.toString();

  return (
    <TouchableOpacity onPress={handleClick} activeOpacity={0.7}>
      <View className="mt-3 h-[60px] w-full flex-row flex-wrap items-center justify-between rounded-[13px]">
        <View className="h-full w-3/4 flex-row items-center">
          <ProfileImage imageUrl={profileImageUrl} />
          <View className="ml-3 flex h-[40px] w-3/4 justify-between">
            <MyText numberOfLines={1}>{name}</MyText>
            <MyText numberOfLines={1} size="text-sm">
              {lastMessage}
            </MyText>
          </View>
        </View>
        <View className="mr-3 flex h-[38px] w-1/5 items-end justify-between">
          <MyText size="text-sm">{getTimeAgo(lastMessageDate)}</MyText>
          {unreadCount > 0 && (
            <UnreadCountChip
              className="h-[24px] bg-textWarning py-0"
              label={computedUnreadCount}
              readOnly
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
