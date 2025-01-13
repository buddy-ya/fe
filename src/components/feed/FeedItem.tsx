import { Feed } from '@/screens/home/types';
import ThumbsUpActive from '@assets/icons/feed/like-active.svg';
import { Bookmark, MessageSquare, ThumbsUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { getCountryFlag, getTimeAgo } from '@/utils';
import { MyText } from '../common';

const IMAGE_CONFIG_DETAIL = {
  containerClass: 'w-full',
  maxHeight: 3000,
};

const IMAGE_CONFIG = {
  single: {
    containerClass: 'w-full',
    maxHeight: 150,
  },
  multiple: {
    containerClass: 'w-[50%] aspect-[1/1]',
    maxHeight: 150,
  },
};

interface ImageDimensions {
  width: number;
  height: number;
}

interface FeedItemProps {
  feed: Feed;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onPress?: (id: number) => void;
  showAllContent?: boolean;
  disablePress?: boolean;
}

export default function FeedItem({
  feed,
  onLike,
  onBookmark,
  onPress,
  showAllContent = false,
  disablePress = false,
}: FeedItemProps) {
  const [imageDimensions, setImageDimensions] = useState<Record<string, ImageDimensions>>({});
  const { t } = useTranslation('feed');

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
    isLiked,
    isBookmarked,
    createdDate,
  } = feed;

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (!showAllContent) return;

    let isComponentMounted = true;

    imageUrls.forEach((url) => {
      if (imageDimensions[url]) return;

      Image.getSize(
        url,
        (width, height) => {
          if (isComponentMounted) {
            setImageDimensions((prev) => ({
              ...prev,
              [url]: { width, height },
            }));
          }
        },
        (error) => {
          if (isComponentMounted) {
            console.error('Error getting image dimensions:', error);
          }
        }
      );
    });

    return () => {
      isComponentMounted = false;
    };
  }, [showAllContent, imageUrls]);

  const calculateImageHeight = (url: string) => {
    const dims = imageDimensions[url];
    if (!dims) return undefined;
    const paddingWidth = 32;
    const contentWidth = screenWidth - paddingWidth;
    const aspectRatio = dims.height / dims.width;
    return contentWidth * aspectRatio;
  };

  const renderLimitedImages = () => {
    const limitedUrls = imageUrls.slice(0, 2);

    return (
      <View className="mt-5 flex-row flex-wrap justify-between">
        {limitedUrls.map((url, index) => {
          const totalImages = imageUrls.length;
          const config = totalImages === 1 ? IMAGE_CONFIG.single : IMAGE_CONFIG.multiple;
          return (
            <View
              key={`${url}-${index}`}
              className={` ${config.containerClass} overflow-hidden rounded-[12px] border border-borderFeed`}
              style={{ height: config.maxHeight }}
            >
              <Image source={{ uri: url }} className="h-full w-full" resizeMode="cover" />
            </View>
          );
        })}

        {imageUrls.length > 2 && (
          <View className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1">
            <MyText color="text-white" size="text-sm">
              +{imageUrls.length - 2}
            </MyText>
          </View>
        )}
      </View>
    );
  };

  const renderAllImages = () => {
    return (
      <View className="mt-5">
        {imageUrls.map((url, index) => {
          const height = calculateImageHeight(url) || IMAGE_CONFIG_DETAIL.maxHeight;

          return (
            <View
              key={`${url}-${index}`}
              className={` ${IMAGE_CONFIG_DETAIL.containerClass} mb-2 overflow-hidden rounded-[12px] border border-borderFeed`}
              style={{ height }}
            >
              <Image source={{ uri: url }} className="h-full w-full" resizeMode="contain" />
            </View>
          );
        })}
      </View>
    );
  };

  const handleComment = (feedId: number) => {
    onPress?.(id);
  };

  const actions = [
    {
      icon: ThumbsUp,
      activeIcon: ThumbsUpActive,
      label: t('action.like'),
      count: likeCount,
      isActive: isLiked,
      onPress: () => onLike(id),
    },
    {
      icon: MessageSquare,
      label: t('action.comment'),
      count: commentCount,
      onPress: () => handleComment(id),
    },
    {
      icon: Bookmark,
      label: t('action.bookmark'),
      isActive: isBookmarked,
      onPress: () => onBookmark(id),
    },
  ];

  const renderContent = () => {
    return (
      <View className="mb-4 mt-[4px] rounded-[20px] border-[0.3px] border-b-[0px] border-borderFeed bg-white p-4 pb-5">
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <View className="mr-3">
              <Image className="h-12 w-12 rounded-[12px]" source={{ uri: profileImageUrl }} />
            </View>
            <View>
              <MyText size="text-sm" className="font-semibold" color="text-[#474747]">
                {t(`profile.university.${university}`)}
              </MyText>
              <View className="flex-row items-center">
                <MyText size="text-sm" color="text-[#474747]">
                  {name}
                </MyText>
                <MyText size="text-sm" className="ml-[3px]">
                  {getCountryFlag(country as any)}
                </MyText>
              </View>
            </View>
          </View>
          <MyText color="text-textDescription" size="text-sm" className="mr-1 tracking-tighter">
            {getTimeAgo(createdDate)}
          </MyText>
        </View>

        <View className="mt-4">
          <MyText size="text-[16px]" className="font-semibold">
            {title}
          </MyText>
          <MyText
            size="text-[14px]"
            color="text-textDescription"
            className="mt-2 font-semibold"
            numberOfLines={showAllContent ? 0 : 3}
          >
            {content}
          </MyText>
        </View>

        {imageUrls.length > 0 && (showAllContent ? renderAllImages() : renderLimitedImages())}

        <View className="mt-[20px] flex-row items-center justify-between px-[12px]">
          {actions.map(
            ({ icon: Icon, activeIcon: ActiveIcon, label, count, isActive, onPress }, index) => (
              <TouchableOpacity
                key={label}
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
                  <MyText size="text-sm" color="text-textDescription">
                    {label}
                  </MyText>
                  <MyText
                    size="text-sm"
                    color="text-textDescription"
                    className={`ml-1 ${index !== actions.length - 1 ? 'min-w-[16px]' : ''}`}
                  >
                    {count > 0 ? count : ''}
                  </MyText>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };

  if (disablePress) {
    return renderContent();
  }

  return (
    <TouchableOpacity onPress={() => onPress?.(id)} activeOpacity={0.8}>
      {renderContent()}
    </TouchableOpacity>
  );
}
