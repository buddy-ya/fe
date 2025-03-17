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
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const queryClient = useQueryClient();

  const handleCommentOptions = (comment: Comment) => {
    setSelectedComment(comment);
    handleModalOpen('comment');
  };

  const handleBlock = async () => {
    queryClient.invalidateQueries({ queryKey: ['feedComments', feed.id] });
  };

  return (
    <>
      <View className="mb-4 mt-0 overflow-hidden">
        {comments?.map((c) => (
          <React.Fragment key={c.id}>
            <CommentItem
              comment={c}
              onLike={onLike}
              onReply={onReply}
              onOptions={handleCommentOptions}
            />
            {c.replies.length > 0 &&
              c.replies.map((reply) => (
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
      {selectedComment && (
        <>
          <CommentOptionModal
            visible={modalVisible.comment}
            feedId={feed.id}
            comment={selectedComment}
            onClose={() => handleModalClose('comment')}
          />
          <ChatRequestModal
            visible={modalVisible.chatRequest}
            data={selectedComment}
            onClose={() => handleModalClose('chatRequest')}
          />
          <ReportModal
            visible={modalVisible.report}
            type="COMMENT"
            reportedId={selectedComment.id}
            reportedUserId={selectedComment.userId}
            onClose={() => handleModalClose('report')}
          />
          <BlockModal
            visible={modalVisible.block}
            buddyId={selectedComment.userId}
            onClose={() => handleModalClose('block')}
            onBlockSuccess={handleBlock}
          />
        </>
      )}
    </>
  );
}
