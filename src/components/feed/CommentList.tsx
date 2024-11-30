import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import MyText from "../common/MyText";
import { getCountryFlag } from "@/utils/constants/countries";
import { getTimeAgo } from "@/utils/service/date";
import { CommentType } from "@/screens/home/types";
import { MoreVertical } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface CommentLabelProps {
  isFeedOwner: boolean;
  isCommentOwner: boolean;
}

const CommentLabel = ({ isFeedOwner, isCommentOwner }: CommentLabelProps) => {
  const { t } = useTranslation("feed");
  if (isFeedOwner) {
    return (
      <View className="ml-2 px-[6px] py-[1px] bg-primary/10 rounded-full">
        <MyText size="text-[11px]" color="text-primary">
          {t("writer")}
        </MyText>
      </View>
    );
  }
  if (isCommentOwner) {
    return (
      <View className="ml-2 px-[6px] py-[1px] bg-[#F6F6F6] rounded-full">
        <MyText size="text-[11px]" color="text-textDescription">
          {t("me")}
        </MyText>
      </View>
    );
  }
  return null;
};

interface CommentListProps {
  comments: CommentType[];
  onCommentOptions: (comment: CommentType) => void;
}

export default function CommentList({
  comments,
  onCommentOptions,
}: CommentListProps) {
  const { t } = useTranslation("feed");
  return (
    <View className="pt-1 mb-4 rounded-[20px] overflow-hidden">
      {comments?.map((item) => (
        <View key={item.id} className="mb-0 px-4 py-3 bg-white">
          <View className="flex-row justify-between items-start mb-[14px]">
            <View className="flex-row">
              <View className="mr-2">
                <Image
                  className="w-10 h-10 rounded-[12px]"
                  source={{ uri: item.profileImageUrl }}
                />
              </View>
              <View className="">
                <View className="flex-row items-center">
                  <MyText
                    size="text-sm"
                    className="font-semibold text-[#474747]"
                  >
                    {t(`profile.university.${item.university}`)}
                  </MyText>
                  <MyText
                    size="text-sm"
                    color="text-textDescription"
                    className="mx-[5px]"
                  >
                    {"·"}
                  </MyText>
                  <MyText
                    size="text-sm"
                    color="text-textDescription"
                    className="tracking-tighter -ml-[2px]"
                  >
                    {getTimeAgo(item.createdDate)}
                  </MyText>
                </View>
                <View className="flex-row items-center">
                  <MyText size="text-sm" color="text-[#474747]">
                    {item.name}
                  </MyText>
                  <MyText size="text-sm" className="ml-[3px]">
                    {getCountryFlag(item.country as any)}
                  </MyText>
                  <CommentLabel
                    isFeedOwner={item.isFeedOwner}
                    isCommentOwner={item.isCommentOwner}
                  />
                </View>
                <MyText className="mt-[10px]">{item.content}</MyText>
              </View>
            </View>
            <View className="flex-row items-center">
              {item.isCommentOwner && (
                <TouchableOpacity
                  onPress={() => onCommentOptions(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 20, right: 10 }}
                >
                  <MoreVertical size={20} color="#797977" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
