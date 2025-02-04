import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { Feed } from '@/types/FeedDTO';
import ThumbsUpActive from '@assets/icons/feed/like-active.svg';
import { Bookmark, MessageSquare, ThumbsUp, Eye } from 'lucide-react-native';
import { getCountryFlag, getTimeAgo } from '@/utils';
import { MyText } from '../common';

interface FeedItemProps {
  feed: Feed;
  onLike?: (id: number) => void;
  onBookmark?: (id: number) => void;
  onView?: (id: number) => void;
  onPress?: (id: number) => void;
  showAllContent?: boolean;
}

export default function FeedItem({
  feed,
  onLike,
  onBookmark,
  onView,
  onPress,
  showAllContent = false,
}: FeedItemProps) {
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
    viewCount,
    isFeedOwner,
    isLiked,
    isBookmarked,
    isProfileImageUpload,
    createdDate,
  } = feed;

  const feedActions = [
    {
      icon: ThumbsUp,
      activeIcon: ThumbsUpActive,
      label: t('action.like'),
      count: likeCount,
      isActive: isLiked,
      onPress: () => onLike?.(id),
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
      onPress: () => onBookmark?.(id),
    },
  ];

  const handleComment = (commentId: number) => {
    onPress?.(commentId);
  };

  const renderContent = () => {
    return (
      <View className="mb-4 mt-[4px] rounded-[20px] border-[0.3px] border-b-[0px] border-borderFeed bg-white p-4 pb-5">
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <View className="mr-3">
              <Image className="h-12 w-12 rounded-[12px]" source={{ uri: profileImageUrl }} />
            </View>
            <View>
              <MyText size="text-sm" className="font-semibold" color="text-textProfile">
                {t(`profile.university.${university}`)}
              </MyText>
              <View className="flex-row items-center">
                <MyText size="text-sm" color="text-textProfile">
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
            numberOfLines={showAllContent ? 0 : 4}
          >
            {content}
          </MyText>
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

  if (!onPress) {
    return renderContent();
  }

  return (
    <TouchableOpacity onPress={() => onPress?.(id)} activeOpacity={0.8}>
      {renderContent()}
    </TouchableOpacity>
  );
}
