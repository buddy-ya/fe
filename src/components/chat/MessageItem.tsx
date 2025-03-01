import React, { useMemo, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Message } from '@/model';
import { Room } from '@/types';
import { CountryID, getCountryFlag } from '@/utils';
import { MyText } from '../common';
import { FullScreenImage } from '../common/FullImage';

// 위에서 만든 컴포넌트 임포트

interface MessageProps {
  message: Message;
  roomData: Room;
  isCurrentUser: boolean;
  shouldShowProfile: boolean;
  isFirstMessage: boolean;
  showTimeLabel: boolean;
  isLastMessageOfUser: boolean;
  onLongPress?: (content: string) => void;
  onProfilePress?: (senderId: string) => void;
}

const MessageItem: React.FC<MessageProps> = ({
  message,
  roomData,
  isCurrentUser,
  shouldShowProfile,
  isFirstMessage,
  showTimeLabel,
  isLastMessageOfUser,
  onLongPress,
  onProfilePress,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false); // 모달 열림 상태
  const { profileImageUrl, country, name } = roomData;

  // 이미지 클릭 시 전체화면 모달 열기
  const handleImagePress = () => {
    if (message.type === 'IMAGE') {
      setIsFullScreen(true);
    }
  };

  const bubbleStyle = useMemo(() => {
    if (message.type === 'IMAGE') {
      return 'rounded-xl mb-3';
    }
    if (isCurrentUser) {
      return isFirstMessage
        ? 'rounded-tl-xl rounded-bl-xl rounded-tr-sm rounded-br-xl'
        : 'rounded-xl';
    } else {
      return isFirstMessage ? 'rounded-tr-xl rounded-br-xl rounded-bl-xl' : 'rounded-xl';
    }
  }, [message.type, isCurrentUser, isFirstMessage]);

  // (현재) 이미지 메시지도 max-w-[70%]로 제한
  const maxBubbleWidth = 'max-w-[70%]';

  const formattedTime = useMemo(() => {
    const date = new Date(message.createdDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message.createdDate]);

  // 메시지 타입에 따라 컨텐츠를 렌더링
  const renderContent = useMemo(() => {
    if (message.type === 'IMAGE') {
      return (
        <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
          <View className="h-[180px] w-[180px] overflow-hidden rounded-xl">
            <Image source={{ uri: message.content }} resizeMode="cover" className="h-full w-full" />
          </View>
        </TouchableOpacity>
      );
    }
    // TALK, SYSTEM 등
    return (
      <MyText
        size="text-[14px]"
        className={`${isCurrentUser ? 'text-white' : 'text-black'} font-medium`}
      >
        {message.content}
      </MyText>
    );
  }, [message, isCurrentUser]);

  // TALK 타입만 longPress 허용
  const handleLongPress = () => {
    if (message.type === 'TALK' && onLongPress) {
      onLongPress(message.content);
    }
  };

  // SYSTEM 메시지면 별도 UI
  if (message.type === 'SYSTEM') {
    return (
      <View className="my-7 items-center justify-center">
        <View className="rounded-lg bg-[#F4F4F4] px-3 py-2">
          <MyText size="text-xs" className="text-[#999999]">
            {message.content}
          </MyText>
        </View>
      </View>
    );
  }

  return (
    <>
      <View className="mt-[5px]">
        {shouldShowProfile && isFirstMessage && (
          <View className="mb-[-16px] mt-3 flex-row items-start">
            <TouchableOpacity onPress={() => onProfilePress && onProfilePress(message.sender)}>
              <Image source={{ uri: profileImageUrl }} className="h-11 w-11 rounded-[14px]" />
            </TouchableOpacity>
            <View className="ml-2 flex-row items-center">
              <MyText size="text-sm" className="font-semibold">
                {name}
              </MyText>
              <MyText size="text-sm" className="ml-1 font-medium">
                {getCountryFlag(country as CountryID)}
              </MyText>
            </View>
          </View>
        )}
        <View className={`${isCurrentUser ? 'flex-row-reverse' : 'flex-row pl-[45px]'} items-end`}>
          <TouchableOpacity
            onLongPress={handleLongPress}
            activeOpacity={1}
            className={`${message.type === 'TALK' ? 'px-4 py-2.5' : ''} ${bubbleStyle} ${maxBubbleWidth} ${
              isCurrentUser ? (isFirstMessage ? 'mt-3 bg-primary' : 'bg-primary') : 'bg-[#F4F4F4]'
            }`}
          >
            {renderContent}
          </TouchableOpacity>
          {message.type === 'TALK' && (
            <MyText className="mx-[5px] self-end text-xs text-gray-500">{formattedTime}</MyText>
          )}
        </View>
      </View>

      {/* 전체화면 이미지 모달: X버튼으로만 닫힘 */}
      <FullScreenImage
        visible={isFullScreen}
        imageUri={message.content}
        onClose={() => setIsFullScreen(false)}
      />
    </>
  );
};

export default React.memo(MessageItem);
