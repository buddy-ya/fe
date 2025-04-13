import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useToastStore } from '@/store';
import { Comment } from '@/types';
import * as Clipboard from 'expo-clipboard';
import { ThumbsUp, MessageSquare, MoreVertical, Copy } from 'lucide-react-native';
import { getCountryFlag, getTimeAgo, isAndroid } from '@/utils';
import { MyText } from '../common';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onLike: (commentId: number) => void;
  onReply: (commentId: number) => void;
  onOptions: (comment: Comment) => void;
}

interface CommentLabelProps {
  isFeedOwner: boolean;
  isCommentOwner: boolean;
}

const CommentLabel = ({ isFeedOwner, isCommentOwner }: CommentLabelProps) => {
  const { t } = useTranslation('feed');
  if (isFeedOwner) {
    return (
      <View className="ml-2 rounded-lg bg-primary/10 px-[6px] py-[1px]">
        <MyText size="text-[11px]" color="text-primary">
          {t('writer')}
        </MyText>
      </View>
    );
  }
  if (isCommentOwner) {
    return (
      <View className="ml-2 rounded-lg bg-[#F6F6F6] px-[6px] py-[1px]">
        <MyText size="text-[11px]" color="text-textDescription">
          {t('me')}
        </MyText>
      </View>
    );
  }
  return null;
};

const CommentItem = ({
  comment,
  isReply = false,
  onLike,
  onReply,
  onOptions,
}: CommentItemProps) => {
  const { t } = useTranslation('feed');
  const showToast = useToastStore((state) => state.showToast);
  const handleCopy = async () => {
    if (!isAndroid) {
      showToast(<MyText>📋</MyText>, t('toast.feed.copySuccess'), 1200);
    }
    await Clipboard.setStringAsync(comment.content);
  };
  const commentActions = (comment: Comment) => [
    {
      icon: ThumbsUp,
      isActive: comment.isLiked,
      count: comment.likeCount,
      onPress: () => onLike(comment.id),
    },
    {
      icon: MessageSquare,
      onPress: () => onReply(comment.id),
    },
    {
      icon: Copy,
      onPress: () => handleCopy(),
    },
  ];

  const renderCommentText = (comment: Comment) => {
    if (comment.isDeleted) {
      return (
        <MyText size="text-[14px]" color={'text-[#797979]'}>
          {t('comment.deleted')}
        </MyText>
      );
    } else if (comment.isBlocked) {
      return (
        <MyText size="text-[14px]" color={'text-[#797979]'}>
          {t('comment.blocked')}
        </MyText>
      );
    }
    return <MyText size="text-[14px]">{comment.content}</MyText>;
  };
  return (
    <View className={`bg-white px-4 py-3 ${isReply ? 'py-2 pl-[60px]' : ''}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row">
          <View className="mr-3">
            <Image
              className={`rounded-[12px] ${isReply ? 'h-11 w-11' : 'h-12 w-12'}`}
              source={{ uri: comment.profileImageUrl }}
            />
          </View>
          <View className="mt-[2px] flex-1">
            <View className="flex-row items-center">
              <MyText size="text-sm" className="font-semibold text-[#474747]">
                {t(`universities:universities.${comment.university}`)}
              </MyText>
              <MyText size="text-sm" color="text-textDescription" className="mx-[5px]">
                {'·'}
              </MyText>
              <MyText
                size="text-sm"
                color="text-textDescription"
                className="-ml-[2px] tracking-tighter"
              >
                {getTimeAgo(comment.createdDate)}
              </MyText>
            </View>
            <View className="flex-row items-center">
              <MyText size="text-sm" color="text-[#474747] font-medium">
                {comment.name}
              </MyText>
              <MyText className="ml-[3px]">{getCountryFlag(comment.country as any)}</MyText>
              <CommentLabel
                isFeedOwner={comment.isFeedOwner}
                isCommentOwner={comment.isCommentOwner}
              />
            </View>
            <View className="mt-2 flex-shrink">{renderCommentText(comment)}</View>
            <View className="mt-3 flex-row items-center">
              {commentActions(comment)
                .filter(({ icon }) => !(isReply && icon === MessageSquare))
                .map(({ icon: Icon, isActive, count, onPress }, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={onPress}
                    className="mr-5 h-[20px] w-[30px] flex-row"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon size={16} color={isActive ? '#00A176' : '#797979'} strokeWidth={1.3} />
                    <MyText size="text-[12px]" color="text-textDescription" className="ml-1">
                      {count && count > 0 ? count : ''}
                    </MyText>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
        {!comment.isDeleted && !comment.isBlocked && !comment.isStudentDeleted && (
          <TouchableOpacity
            onPress={() => onOptions(comment)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={20} color="#797977" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CommentItem;
