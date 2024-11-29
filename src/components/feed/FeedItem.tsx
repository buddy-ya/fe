import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import {
  Heart,
  MessageCircle,
  Bookmark,
  ThumbsUp,
  MessageSquare,
} from "lucide-react-native";
import MyText from "@/components/common/MyText";
import { Feed } from "@/screens/home/types";
import { getCountryFlag } from "@/utils/constants/countries";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import * as Localization from "expo-localization";
import { getTimeAgo } from "@/utils/service/date";
import { useTranslation } from "react-i18next";
import ThumbsUpActive from "@assets/icons/feed/like-active.svg";

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

  const handleComment = (id: number) => {};
  const { t } = useTranslation("feed");

  const actions = [
    {
      icon: ThumbsUp,
      activeIcon: ThumbsUpActive,
      label: t("action.like"),
      count: likeCount,
      isActive: isLiked,
      onPress: () => onLike(id),
    },
    {
      icon: MessageSquare,
      label: t("action.comment"),
      count: commentCount,
      onPress: () => handleComment(id),
    },
    {
      icon: Bookmark,
      label: t("action.bookmark"),
      isActive: isBookmarked,
      onPress: () => onBookmark(id),
    },
  ];

  const renderContent = () => (
    <View className="mb-5 p-4 border-[0.3px] bg-white border-borderFeed rounded-[12px]">
      <View className="flex-row justify-between items-cente">
        <View className="flex-row items-center">
          <View className=" mr-3">
            <Image
              className="w-[40px] h-[40px] rounded-[12px]"
              source={{ uri: profileImageUrl }}
            />
          </View>
          <View>
            <MyText
              size="text-sm"
              className="font-semibold text-textDescription"
            >
              {t(`profile.university.${university}`)}
            </MyText>
            <View className="flex-row items-center">
              <MyText size="text-sm" color="text-textDescription">
                {name}
              </MyText>
              <MyText size="text-sm" className="ml-[3px]">
                {getCountryFlag(country as any)}
              </MyText>
            </View>
          </View>
        </View>
        <MyText color="text-textLight" size="text-sm">
          {getTimeAgo(createdDate)}
        </MyText>
      </View>

      {/* Content */}
      <View className="mt-4">
        <MyText size="text-lg" className="font-semibold mb-3">
          {title}
        </MyText>
        <MyText
          color="text-textDescription"
          className="font-semibold"
          numberOfLines={showAllContent ? undefined : 3}
        >
          {content}
        </MyText>
      </View>

      {imageUrls.length > 0 && (
        <View className="mt-4">
          <View className="flex-row flex-wrap">
            {(showAllContent ? imageUrls : imageUrls.slice(0, 2)).map(
              (url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  className={`
                  rounded-[12px] border
                  ${
                    showAllContent
                      ? "w-full h-[250] mb-2"
                      : imageUrls.length === 1
                      ? "w-full h-[150]"
                      : "w-[49%] h-[150] " + (index === 0 ? "mr-[2%]" : "")
                  }
                `}
                  resizeMode="cover"
                />
              )
            )}
          </View>
          {!showAllContent && imageUrls.length > 2 && (
            <View className="absolute right-2 top-2 bg-black/60 px-2 py-1 rounded">
              <MyText color="text-white" size="text-sm">
                +{imageUrls.length - 2}
              </MyText>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between px-[12px] mt-5">
        {actions.map(
          ({
            icon: Icon,
            activeIcon: ActiveIcon,
            label,
            count,
            isActive,
            onPress,
          }) => (
            <TouchableOpacity
              key={label}
              onPress={onPress}
              className="flex-row items-center"
            >
              {isActive && ActiveIcon ? (
                <ActiveIcon />
              ) : (
                <Icon
                  size={20}
                  color={isActive ? "#00A176" : "#797979"}
                  fill={isActive ? "#E3FFF7" : "transparent"}
                  strokeWidth={1}
                />
              )}

              <MyText
                size="text-sm"
                color="text-textDescription"
                className="ml-1 w-10"
              >
                {label} {count > 0 && count}
              </MyText>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );

  if (disablePress) {
    return renderContent();
  }

  return (
    <TouchableOpacity onPress={() => onPress?.(id)} activeOpacity={0.8}>
      {renderContent()}
    </TouchableOpacity>
  );
}
