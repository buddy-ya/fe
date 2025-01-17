import { MoreVertical } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { getCountryFlag, getTimeAgo } from '@/utils';
import { CommentOptionModal, MyText } from '../common';
import { useModalStore } from '@/store';
import { useState } from 'react';
import { Comment } from '@/model';

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
  feed: any;
  comments: Comment[];
}

export default function CommentList({ feed, comments }: CommentListProps) {
  const { t } = useTranslation('feed');
  const [comment, setComment] = useState<Comment>({
    id: -1,
    isCommentOwner: false,
    isFeedOwner: false,
    name: '',
    profileImageUrl: '',
    university: '',
    country: '',
    content: '',
    createdDate: '',
  })
  const modalVisible = useModalStore(state => state.visible);
  const handleModalOpen = useModalStore(state => state.handleOpen);
  const handleModalClose = useModalStore(state => state.handleClose);

  const handleCommentOptions = (comment: Comment) => {
    setComment(comment);
    handleModalOpen('comment');
  }

  return (
    <>
      <View className="mb-4 overflow-hidden rounded-[20px] pt-1">
        {comments?.map((item) => (
          <View key={item.id} className="mb-0 bg-white px-4 py-3">
            <View className="mb-[14px] flex-row items-start justify-between">
              <View className="flex-1 flex-row">
                <View className="mr-3">
                  <Image
                    className="h-10 w-10 rounded-[12px]"
                    source={{ uri: item.profileImageUrl }}
                  />
                </View>
                <View className="flex-1">
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
                  <MyText className="mt-[10px] flex-shrink">{item.content}</MyText>
                </View>
              </View>
              <View className="ml-2">
                <TouchableOpacity
                  onPress={() => handleCommentOptions(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 20, right: 10 }}
                >
                  <MoreVertical size={20} color="#797977" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
      <CommentOptionModal
        visible={modalVisible.comment}
        feed={feed}
        comment={comment}
        onClose={() => handleModalClose('comment')}
      />
    </>
  );
}
