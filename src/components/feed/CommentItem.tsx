import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { Comment } from '@/types';
import { ThumbsUp, MessageSquare, MoreVertical } from 'lucide-react-native';
import { getCountryFlag, getTimeAgo } from '@/utils';
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
  const handleLike = (commentId: number) => {
    // 좋아요 처리 로직 추가
  };

  const commentActions = (comment: Comment) => [
    {
      icon: ThumbsUp,
      isActive: true,
      count: comment.likeCount || 3,
      onPress: () => handleLike(comment.id),
    },
    {
      icon: MessageSquare,
      onPress: () => onReply(comment.id),
    },
  ];
  return (
    <View className={`bg-white px-4 py-3 pb-1 ${isReply ? 'pl-[60px]' : ''}`}>
      <View className="mb-[14px] flex-row items-start justify-between">
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
                {t(`profile.university.${comment.university}`)}
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
              <MyText size="text-sm" color="text-[#474747]">
                {comment.name}
              </MyText>
              <MyText className="ml-[3px]">{getCountryFlag(comment.country as any)}</MyText>
              <CommentLabel
                isFeedOwner={comment.isFeedOwner}
                isCommentOwner={comment.isCommentOwner}
              />
            </View>
            <MyText className="mt-2 flex-shrink">{comment.content}</MyText>
            <View className="mt-3 flex-row items-center">
              {commentActions(comment)
                .filter(({ icon }) => !(isReply && icon === MessageSquare))
                .map(({ icon: Icon, isActive, count, onPress }, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={onPress}
                    className="mr-5 flex-row"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon size={16} color={isActive ? '#00A176' : '#797979'} />
                    {count && count > 0 && (
                      <MyText size="text-[12px]" color="text-textDescription" className="ml-1">
                        {count}
                      </MyText>
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => onOptions(comment)}>
          <MoreVertical size={20} color="#797977" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentItem;
