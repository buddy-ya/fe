import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Feed } from '@/types/FeedDTO';
import ThumbsUpActive from '@assets/icons/feed/like-active.svg';
import { useNavigation } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { Bookmark, MessageSquare, ThumbsUp, Eye } from 'lucide-react-native';
import { getCountryFlag, getTimeAgo } from '@/utils';
import { MyText } from '../common';
import { FullScreenImage } from '../common/FullImage';

interface FeedItemProps {
  feed: Feed;
  onLike?: (id: number) => void;
  onBookmark?: (id: number) => void;
  onPress?: (id: number) => void;
  navigation: any;
  showAllContent?: boolean;
}

export default function FeedItem({
  feed,
  onLike,
  onBookmark,
  onPress,
  navigation,
  showAllContent = false,
}: FeedItemProps) {
  const { t } = useTranslation(['feed', 'universities']);
  const {
    id,
    name,
    university,
    country,
    title,
    content,
    imageUrls,
    profileImageUrl,
    likeCount,
    commentCount,
    viewCount,
    isLiked,
    isBookmarked,
    createdDate,
  } = feed;

  const [fullScreenImages, setFullScreenImages] = useState<{
    visible: boolean;
    imageUrls: string[];
    initialIndex: number;
  } | null>(null);

  // 좋아요와 북마크 연타 방지를 위한 상태 추가
  const [isLikeDisabled, setLikeDisabled] = useState(false);
  const [isBookmarkDisabled, setBookmarkDisabled] = useState(false);

  const handleLike = () => {
    if (isLikeDisabled) return;
    setLikeDisabled(true);
    onLike?.(id);
    setTimeout(() => {
      setLikeDisabled(false);
    }, 300);
  };

  const handleBookmark = () => {
    if (isBookmarkDisabled) return;
    setBookmarkDisabled(true);
    onBookmark?.(id);
    setTimeout(() => {
      setBookmarkDisabled(false);
    }, 300);
  };

  const handleComment = (commentId: number) => {
    onPress?.(commentId);
  };

  const feedActions = [
    {
      icon: ThumbsUp,
      activeIcon: ThumbsUpActive,
      label: t('action.like'),
      count: likeCount,
      isActive: isLiked,
      onPress: handleLike,
    },
    {
      icon: MessageSquare,
      count: commentCount,
      onPress: () => handleComment(id),
    },
    {
      icon: Eye,
      count: viewCount,
      onPress: () => {},
    },
    {
      icon: Bookmark,
      isActive: isBookmarked,
      onPress: handleBookmark,
    },
  ];

  const handleProfilePress = () => {
    navigation.navigate('Profile', { id: feed.userId, showMatchingProfile: false });
  };

  const renderContent = () => {
    const hasImage = imageUrls.length > 0;
    return (
      <View
        className={`mb-4 mt-[4px] rounded-[20px] border-[0.3px] border-b-[0px] border-borderFeed bg-white p-4 pb-5 ${
          showAllContent && 'rounded-none'
        }`}
      >
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                if (showAllContent) {
                  handleProfilePress();
                } else {
                  onPress?.(id);
                }
              }}
            >
              <ExpoImage
                style={{ height: 44, width: 44, borderRadius: 12 }}
                source={{ uri: profileImageUrl }}
                contentFit="contain"
              />
              <View className="ml-3">
                <MyText size="text-sm" className="font-semibold" color="text-textProfile">
                  {t(`universities:universities.${university}`)}
                </MyText>
                <View className="flex-row items-center">
                  <MyText size="text-sm" color="text-textProfile font-medium">
                    {name}
                  </MyText>
                  <MyText className="ml-[3px]">{getCountryFlag(country as any)}</MyText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <MyText color="text-textDescription" size="text-sm" className="mr-1 tracking-tighter">
            {getTimeAgo(createdDate)}
          </MyText>
        </View>

        <View className="mt-4">
          <MyText
            size="text-[16px]"
            className="font-semibold"
            numberOfLines={!showAllContent ? 1 : undefined}
          >
            {title}
          </MyText>
          <View className="mt-3 flex flex-row justify-between">
            <MyText
              size="text-[15px]"
              color="text-textDescription"
              className={`${!showAllContent && hasImage ? 'flex-1' : ''}`}
              numberOfLines={showAllContent ? 0 : 4}
            >
              {content}
            </MyText>
            {hasImage && !showAllContent && (
              <View className="relative ml-4 h-[90px] w-[90px]">
                <ExpoImage
                  style={{ height: '100%', width: '100%', borderRadius: 8 }}
                  source={{ uri: imageUrls[0] }}
                  contentFit="cover"
                />
                {imageUrls.length > 1 && (
                  <MyText
                    size="text-sm"
                    className="absolute bottom-0 right-0 rounded-md bg-black/50 bg-opacity-10 p-1 px-[5px] text-white"
                  >
                    +{imageUrls.length - 1}
                  </MyText>
                )}
              </View>
            )}
          </View>

          {hasImage && showAllContent && (
            <View className="mt-5">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {imageUrls.map((url, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      setFullScreenImages({ visible: true, imageUrls, initialIndex: index })
                    }
                    activeOpacity={0.8}
                    className="mr-2 h-[255px] w-[255px]"
                  >
                    <ExpoImage
                      style={{ height: '100%', width: '100%', borderRadius: 12 }}
                      source={{ uri: url }}
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View className="mt-[20px] flex-row items-center justify-between px-[12px]">
          {feedActions.map(
            ({ icon: Icon, activeIcon: ActiveIcon, label, count, isActive, onPress }, index) => (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                className="flex-row items-center"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {isActive && ActiveIcon ? (
                  <ActiveIcon />
                ) : (
                  <Icon
                    size={20}
                    color={isActive ? '#00A176' : '#797979'}
                    fill={isActive ? '#00A176' : 'transparent'}
                    strokeWidth={1}
                  />
                )}
                <View className="ml-1 flex-row items-center">
                  <MyText
                    size="text-sm"
                    color="text-textDescription"
                    className={`ml-1 ${index !== feedActions.length - 1 ? 'min-w-[16px]' : ''}`}
                  >
                    {count && count > 0 ? count : ''}
                  </MyText>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (!showAllContent) {
            onPress?.(id);
          }
        }}
        activeOpacity={showAllContent ? 1 : 0.8}
      >
        {renderContent()}
      </TouchableOpacity>
      {fullScreenImages?.visible && (
        <FullScreenImage
          visible={fullScreenImages.visible}
          imageUrls={fullScreenImages.imageUrls}
          initialIndex={fullScreenImages.initialIndex}
          onClose={() => setFullScreenImages(null)}
        />
      )}
    </>
  );
}
