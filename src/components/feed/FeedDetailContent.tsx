import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import CommentList from '@/components/feed/CommentList';
import FeedItem from '@/components/feed/FeedItem';

interface Props {
  feed: any;
  comments: any[];
  isRefetching: boolean;
  onRefresh: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onCommentOptions: (comment: any) => void;
}

export function FeedDetailContent({
  feed,
  comments,
  isRefetching,
  onRefresh,
  onLike,
  onBookmark,
  onCommentOptions,
}: Props) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="mt-1"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#4AA366" />
      }
    >
      <FeedItem feed={feed} onLike={onLike} onBookmark={onBookmark} showAllContent disablePress />
      <CommentList comments={comments} onCommentOptions={onCommentOptions} />
    </ScrollView>
  );
}
