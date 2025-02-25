import React, { useMemo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Message } from '@/model';
import { Room } from '@/types';
import { CountryID, getCountryFlag } from '@/utils';
import { MyText } from '../common';

interface MessageProps {
  message: Message;
  roomData: Room;
  isCurrentUser: boolean;
  shouldShowProfile: boolean;
  isFirstMessage: boolean;
  showTimeLabel: boolean; // 기존 timeChanged 대신 사용
  isLastMessageOfUser: boolean;
}

const MessageItem: React.FC<MessageProps> = ({
  message,
  roomData,
  isCurrentUser,
  shouldShowProfile,
  isFirstMessage,
  showTimeLabel,
  isLastMessageOfUser,
}) => {
  const { profileImageUrl, country, name } = roomData;

  const bubbleStyle = useMemo(() => {
    if (isCurrentUser) {
      return isFirstMessage
        ? 'rounded-tl-xl rounded-bl-xl rounded-tr-sm rounded-br-xl'
        : 'rounded-xl';
    } else {
      return isFirstMessage ? 'rounded-tr-xl rounded-br-xl rounded-bl-xl' : 'rounded-xl';
    }
  }, [isCurrentUser, isFirstMessage]);

  const maxBubbleWidth = 'max-w-[70%]';

  // 서버에서 받은 createdDate를 기준으로 시간 라벨 포맷팅
  const formattedTime = useMemo(() => {
    const date = new Date(message.createdDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [message.createdDate]);

  return (
    <View className="mt-[5px]">
      {shouldShowProfile && isFirstMessage && (
        <View className="mb-[-16px] mt-3 flex-row items-start">
          <TouchableOpacity>
            <Image source={{ uri: profileImageUrl }} className="h-11 w-11 rounded-[14px]" />
          </TouchableOpacity>
          <View className="ml-2 flex-row items-center">
            <MyText size="text-sm" className="font-bold">
              {name}
            </MyText>
            <MyText size="text-sm" className="ml-1 font-medium">
              {getCountryFlag(country as CountryID)}
            </MyText>
          </View>
        </View>
      )}
      <View className={`${isCurrentUser ? 'flex-row-reverse' : 'flex-row pl-[45px]'} items-end`}>
        <View
          className={`px-3 py-2.5 ${bubbleStyle} ${maxBubbleWidth} ${
            isCurrentUser ? `bg-primary ${isFirstMessage && 'mt-3'}` : 'bg-[#F4F4F4]'
          } `}
        >
          <MyText
            size="text-[14px]"
            className={`${isCurrentUser ? 'text-white' : 'text-black'} font-medium`}
          >
            {message.content}
          </MyText>
        </View>
        <MyText className="mx-2 self-end text-xs text-gray-500">{formattedTime}</MyText>
      </View>
    </View>
  );
};

export default React.memo(MessageItem);
