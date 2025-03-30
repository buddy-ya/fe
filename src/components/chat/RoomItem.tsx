import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { ChatStackParamList } from '@/navigation/navigationRef';
import { Room } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CountryID, getCountryFlag, getTimeAgo } from '@/utils';
import { MyText } from '../common';
import { ProfileImage } from './ProfileImage';

interface RoomItemProps {
  room: Room;
  onPress?: (id: number) => void;
}

export default function RoomItem({ room, onPress }: RoomItemProps) {
  const {
    id,
    name,
    country,
    lastMessage,
    profileImageUrl,
    unreadCount,
    isBuddyExited,
    buddyId,
    lastMessageDate,
  } = room;
  const { t } = useTranslation('chat');

  const handleClick = () => {
    onPress?.(id);
  };

  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();

  const isNewMessage = unreadCount > 0;

  const renderMessage = () => {
    if (isBuddyExited) {
      return t('room.buddyExitedMessage');
    }
    return lastMessage === null ? t('room.startMessage') : lastMessage;
  };
  const handleProfilePress = () => {
    navigation.navigate('Profile', { id: buddyId });
  };

  return (
    <TouchableOpacity onPress={handleClick} activeOpacity={0.7}>
      <View className="mb-2 w-full flex-row flex-wrap items-center justify-between py-2">
        <View className="h-full w-3/4 flex-row items-center">
          <ProfileImage imageUrl={profileImageUrl} onPress={handleProfilePress} />
          <View className="ml-3 flex h-[40px] w-4/5 justify-between">
            <View className="flex-row items-center">
              <MyText className="mr-1 font-medium" numberOfLines={1}>
                {name}
              </MyText>
              <MyText>{getCountryFlag(country as CountryID)}</MyText>
            </View>
            <MyText
              numberOfLines={1}
              size="text-sm"
              color={isNewMessage ? '' : 'text-[#797979]'}
              className={isNewMessage ? 'font-medium' : ''}
            >
              {renderMessage()}
            </MyText>
          </View>
        </View>
        <View className="mr-2 flex h-[38px] items-end justify-between">
          <MyText size="text-[11px]" color="text-textDescription">
            {getTimeAgo(lastMessageDate)}
          </MyText>
          {isNewMessage && <View className="mb-1 mr-2 h-2 w-2 rounded-full bg-primary"></View>}
        </View>
      </View>
    </TouchableOpacity>
  );
}
