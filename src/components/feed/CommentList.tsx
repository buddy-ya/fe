import { CommentType } from '@/screens/home/types';
import { MoreVertical } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { getCountryFlag } from '@/utils/constants/countries';
import { getTimeAgo } from '@/utils/service/date';
import MyText from '../common/MyText';

interface CommentLabelProps {
  isFeedOwner: boolean;
  isCommentOwner: boolean;
}

const CommentLabel = ({ isFeedOwner, isCommentOwner }: CommentLabelProps) => {
  const { t } = useTranslation('feed');
  if (isFeedOwner) {
    return (
      <View className="ml-2 rounded-full bg-primary/10 px-[6px] py-[1px]">
        <MyText size="text-[11px]" color="text-primary">
          {t('writer')}
        </MyText>
      </View>
    );
  }
  if (isCommentOwner) {
    return (
      <View className="ml-2 rounded-full bg-[#F6F6F6] px-[6px] py-[1px]">
        <MyText size="text-[11px]" color="text-textDescription">
          {t('me')}
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

export default function CommentList({ comments, onCommentOptions }: CommentListProps) {
  const { t } = useTranslation('feed');
  return (
    <View className="mb-4 overflow-hidden rounded-[20px] pt-1">
      {comments?.map((item) => (
        <View key={item.id} className="mb-0 bg-white px-4 py-3">
          <View className="mb-[14px] flex-row items-start justify-between">
            <View className="flex-row">
              <View className="mr-3">
                <Image
                  className="h-10 w-10 rounded-[12px]"
                  source={{ uri: item.profileImageUrl }}
                />
              </View>
              <View className="">
                <View className="flex-row items-center">
                  <MyText size="text-sm" className="font-semibold text-[#474747]">
                    {t(`profile.university.${item.university}`)}
                  </MyText>
                  <MyText size="text-sm" color="text-textDescription" className="mx-[5px]">
                    {'·'}
                  </MyText>
                  <MyText
                    size="text-sm"
                    color="text-textDescription"
                    className="-ml-[2px] tracking-tighter"
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
              <TouchableOpacity
                onPress={() => onCommentOptions(item)}
                hitSlop={{ top: 10, bottom: 10, left: 20, right: 10 }}
              >
                <MoreVertical size={20} color="#797977" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
