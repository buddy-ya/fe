import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Linking, Alert } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { Message } from '@/model';
import { Room } from '@/types';
import { Image as ExpoImage } from 'expo-image';
import { CountryID, getCountryFlag } from '@/utils';
import { MyText } from '../common';

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
  onRetry?: (message: Message) => void; // 재전송 기능을 위한 콜백
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
  onRetry,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false); // 모달 열림 상태
  const { profileImageUrl, country, name } = roomData;

  // 이미지 클릭 시 전체화면 모달 열기
  const handleImagePress = () => {
    if (message.type === 'IMAGE') {
      setIsFullScreen(true);
    }
  };

  const handleUrlPress = async (url: string) => {
    const link = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    } else {
      Alert.alert('Notice', 'This link cannot be opened.', [{ text: 'Confrim' }], {
        cancelable: true,
      });
    }
  };

  const bubbleStyle = useMemo(() => {
    if (message.type === 'IMAGE') {
      return 'rounded-xl';
    }
    if (isCurrentUser) {
      return isFirstMessage
        ? 'rounded-tl-xl rounded-bl-xl rounded-tr-sm rounded-br-xl'
        : 'rounded-xl';
    } else {
      return isFirstMessage ? 'rounded-tr-xl rounded-br-xl rounded-bl-xl' : 'rounded-xl';
    }
  }, [message.type, isCurrentUser, isFirstMessage]);

  // 이미지 메시지도 max-w-[70%]로 제한 (텍스트 메시지는 패딩과 배경색 포함)
  const containerClasses =
    message.type === 'IMAGE'
      ? `${bubbleStyle} ${'max-w-[70%]'}`
      : `px-4 py-2.5 ${bubbleStyle} ${'max-w-[70%]'} ${
          isCurrentUser ? (isFirstMessage ? 'mt-3 bg-primary' : 'bg-primary') : 'bg-[#F4F4F4]'
        }`;

  const formattedTime = useMemo(() => {
    const date = new Date(message.createdDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message.createdDate]);

  // 메시지 타입에 따라 컨텐츠 렌더링
  const renderContent = useMemo(() => {
    if (message.type === 'IMAGE') {
      return (
        <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
          <ExpoImage
            source={{ uri: message.content }}
            style={{ width: 180, height: 180, borderRadius: 10 }}
            contentFit="cover"
          />
        </TouchableOpacity>
      );
    }
    return (
      <MyText
        size="text-[14px]"
        className={`${isCurrentUser ? 'text-white' : 'text-black'} font-medium`}
      >
        <ParsedText
          parse={[
            {
              type: 'url',
              style: {
                color: isCurrentUser ? '#ffffff' : '#00A176',
                textDecorationLine: 'underline',
              },
              onPress: handleUrlPress,
            },
          ]}
          childrenProps={{ allowFontScaling: false }}
        >
          {message.content}
        </ParsedText>
      </MyText>
    );
  }, [message, isCurrentUser]);

  const handleLongPress = () => {
    if (message.type === 'TALK' && onLongPress) {
      onLongPress(message.content);
    }
  };

  // SYSTEM 메시지면 별도 UI 처리
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
              <ExpoImage
                source={{ uri: profileImageUrl }}
                style={{ width: 40, height: 40, borderRadius: 14 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2 flex-row items-center"
              onPress={() => onProfilePress && onProfilePress(message.sender)}
            >
              <MyText size="text-sm" className="font-semibold">
                {name}
              </MyText>
              <MyText size="text-sm" className="ml-1 font-medium">
                {getCountryFlag(country as CountryID)}
              </MyText>
            </TouchableOpacity>
          </View>
        )}
        <View
          className={`${isCurrentUser ? 'flex-row-reverse' : 'flex-row pl-[45px]'} mb-1 items-end`}
        >
          <TouchableOpacity
            onLongPress={handleLongPress}
            activeOpacity={1}
            className={containerClasses}
          >
            {renderContent}
          </TouchableOpacity>
          {(message.type === 'TALK' || message.type === 'IMAGE') && (
            <View className="flex-row items-center">
              <MyText size="text-xs" className="mx-[5px] self-end text-gray-500">
                {formattedTime}
              </MyText>
              {isCurrentUser && message.status && message.status !== 'sent' && (
                <>
                  {message.status === 'pending' ? (
                    <ActivityIndicator size="small" style={{ marginLeft: 5 }} />
                  ) : (
                    <TouchableOpacity className="ml-[5px]">
                      <MyText size="text-sm" className="mr-1">
                        ⚠️
                      </MyText>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default React.memo(MessageItem);
