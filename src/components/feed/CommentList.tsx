import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useModalStore } from '@/store';
import { Comment, Feed } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { BlockModal, CommentOptionModal, ReportModal } from '../common';
import { ChatRequestModal } from '../modal/Common/ChatRequestModal';
import CommentItem from './CommentItem';

interface CommentListProps {
  feed: Feed;
  comments: Comment[];
  onLike: (commentId: number) => void;
  onReply: (commentId: number) => void;
}

export default function CommentList({ feed, comments, onLike, onReply }: CommentListProps) {
  const { t } = useTranslation('feed');
  const [comment, setComment] = useState<Comment>({
    id: -1,
    userId: 0,
    content: '',
    name: '',
    country: '',
    university: '',
    profileImageUrl: '',
    likeCount: 0,
    createdDate: '',
    isDeleted: false,
    isLiked: false,
    isBlocked: false,
    isFeedOwner: false,
    isCommentOwner: false,
    isProfileImageUpload: false,
    replies: [],
  });

  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);

  const queryClient = useQueryClient();

  const handleCommentOptions = (comment: Comment) => {
    setComment(comment);
    console.log(comment);
    handleModalOpen('comment');
  };

  const handleBlock = async () => {
    queryClient.invalidateQueries({ queryKey: ['feedComments', feed.id] });
  };

  return (
    <>
      <View className="mb-4 mt-2 overflow-hidden rounded-[20px]">
        {comments?.map((comment) => (
          <React.Fragment key={comment.id}>
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={onLike}
              onReply={onReply}
              onOptions={handleCommentOptions}
            />
            {comment.replies.length > 0 &&
              comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply
                  onLike={onLike}
                  onReply={onReply}
                  onOptions={handleCommentOptions}
                />
              ))}
          </React.Fragment>
        ))}
      </View>
      {comment.id !== -1 && (
        <>
          <CommentOptionModal
            visible={modalVisible.comment}
            feed={feed}
            comment={comment}
            onClose={() => handleModalClose('comment')}
          />
          <ChatRequestModal
            visible={modalVisible.chatRequest}
            data={comment}
            onClose={() => handleModalClose('chatRequest')}
          />
          <ReportModal
            visible={modalVisible.report}
            type="COMMENT"
            reportedId={comment.id}
            reportedUserId={comment.userId}
            onClose={() => handleModalClose('report')}
          />
          <BlockModal
            visible={modalVisible.block}
            buddyId={comment.userId}
            onClose={() => handleModalClose('block')}
            onBlockSuccess={handleBlock}
          />
        </>
      )}
    </>
  );
}
