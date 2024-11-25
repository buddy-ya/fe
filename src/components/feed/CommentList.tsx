import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import MyText from "../common/MyText";
import { getCountryFlag } from "@/utils/constants/countries";
import { getTimeAgo } from "@/utils/service/date";
import { CommentType } from "@/screens/home/types";
import { MoreVertical } from "lucide-react-native";

interface CommentLabelProps {
  isFeedOwner: boolean;
  isCommentOwner: boolean;
}

const CommentLabel = ({ isFeedOwner, isCommentOwner }: CommentLabelProps) => {
  if (isFeedOwner) {
    return (
      <View className="ml-2 px-2 py-1 bg-primary/10 rounded">
        <MyText size="text-xs" color="text-primary">
          작성자
        </MyText>
      </View>
    );
  }
  if (isCommentOwner) {
    return (
      <View className="ml-2 px-2 py-1 bg-gray-100 rounded">
        <MyText size="text-xs" color="text-textDescription">
          나
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
  return (
    <View className="mt-1">
      {comments.map((item) => (
        <View
          key={item.id}
          className="mb-0 px-4 py-3 border-b border-borderBottom"
        >
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row">
              <View className="w-10 h-10 bg-gray-200 rounded-[8] mr-2">
                <Image className="w-10 h-10 rounded-[12px]" />
              </View>
              <View>
                <View className="flex-row items-center">
                  <MyText
                    size="text-sm"
                    className="font-semibold text-textDescription"
                  >
                    {item.university}
                  </MyText>
                  <MyText
                    size="text-sm"
                    color="text-textLight"
                    className="ml-3 tracking-tight"
                  >
                    {getTimeAgo(item.createdDate)}
                  </MyText>
                </View>
                <View className="flex-row items-center">
                  <MyText size="text-sm" color="text-textDescription">
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
                <MyText className="mt-2">{item.content}</MyText>
              </View>
            </View>
            <View className="flex-row items-center">
              {item.isCommentOwner && (
                <TouchableOpacity onPress={() => onCommentOptions(item)}>
                  <MoreVertical size={16} color="#797977" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
