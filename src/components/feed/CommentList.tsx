import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useModalStore } from '@/store';
import { Comment, Feed } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
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

  const handleModalOpen = useModalStore((state) => state.handleOpen);

  const handleCommentOptions = (comment: Comment) => {
    setSelectedComment(comment);
    handleModalOpen('comment', { feedId: feed.id, comment });
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
    </>
  );
}
