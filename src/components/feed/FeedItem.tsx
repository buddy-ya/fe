import React, { useState } from "react";
import { View, TouchableOpacity, Image, Image as RNImage } from "react-native";
import { Bookmark, ThumbsUp, MessageSquare } from "lucide-react-native";
import MyText from "@/components/common/MyText";
import { Feed } from "@/screens/home/types";
import { getCountryFlag } from "@/utils/constants/countries";
import { getTimeAgo } from "@/utils/service/date";
import { useTranslation } from "react-i18next";
import ThumbsUpActive from "@assets/icons/feed/like-active.svg";

const IMAGE_CONFIG = {
  single: {
    aspectRatio: 1 / 1,
    containerClass: "w-full aspect-[1/1]",
    maxHeight: 150,
  },
  multiple: {
    aspectRatio: 1 / 1,
    containerClass: "w-[49%] aspect-[1/1]",
    maxHeight: 150,
  },
  detail: {
    aspectRatio: 3 / 4,
    containerClass: "w-full aspect-[3/4]",
    maxHeight: 1200,
  },
};

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
    <View className="mt-[4px] mb-4 p-4 pb-5 border-[0.3px] border-b-[0px] bg-white border-borderFeed rounded-[20px]">
      <View className="flex-row justify-between">
        <View className="flex-row items-center">
          <View className="mr-3">
            <Image
              className="w-12 h-12 rounded-[12px]"
              source={{ uri: profileImageUrl }}
            />
          </View>
          <View>
            <MyText size="text-sm" className="font-semibold text-[#474747]">
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
        <MyText
          color="text-textDescription"
          size="text-sm"
          className="tracking-tighter mr-1 mt-0.5"
        >
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
          className="font-semibold mt-2"
          numberOfLines={showAllContent ? undefined : 2}
        >
          {content}
        </MyText>
      </View>
      {imageUrls.length > 0 && (
        <View className="">
          <View className="flex-row flex-wrap justify-between mt-5">
            {(showAllContent ? imageUrls : imageUrls.slice(0, 2)).map(
              (url, index) => {
                const config = showAllContent
                  ? IMAGE_CONFIG.detail
                  : imageUrls.length === 1
                  ? IMAGE_CONFIG.single
                  : IMAGE_CONFIG.multiple;

                const getBorderRadiusClass = () => {
                  if (imageUrls.length === 2 && !showAllContent) {
                    return index === 0
                      ? "rounded-l-[12px] rounded-r-none"
                      : "rounded-r-[12px] rounded-l-none";
                  }
                  return "rounded-[12px]";
                };

                return (
                  <View
                    key={index}
                    className={`
              ${config.containerClass} 
              ${getBorderRadiusClass()} 
              ${showAllContent ? "mb-2" : "mb-0"}
              overflow-hidden 
              border 
              border-borderFeed
            `}
                    style={{
                      maxHeight: config.maxHeight,
                    }}
                  >
                    <Image
                      source={{ uri: url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                );
              }
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

      <View
        className={`flex-row items-center justify-between px-[12px] mt-[20px]`}
      >
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
              onPress={() => onPress?.()}
              className="flex-row items-center"
            >
              {isActive && ActiveIcon ? (
                <ActiveIcon />
              ) : (
                <Icon
                  size={20}
                  color={isActive ? "#00A176" : "#797979"}
                  fill={isActive ? "#00A176" : "transparent"}
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
