import { Feed } from '@/screens/home/types';
import { FlatList, RefreshControl, RefreshControlProps } from 'react-native';
import { memo } from 'react';
import { EmptyState } from '../common';
import FeedItem from './FeedItem';

interface FeedListProps {
  feeds: Feed[];
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onPress: (id: number) => void;
  isLoading: boolean;
  hasMore: boolean;
  className?: string;
  onLoadMore: () => void;
  refreshControl?: RefreshControlProps | null;
  emptyStateMessage?: string;
  showBookmarkButton?: boolean;
  disableActions?: boolean;
}

function FeedList({
  feeds,
  onLike,
  onBookmark,
  onPress,
  className,
  onLoadMore,
  refreshControl,
  hasMore,
  emptyStateMessage,
  showBookmarkButton = true,
  disableActions = false,
}: FeedListProps) {
  if (feeds.length === 0) {
    return <EmptyState message={emptyStateMessage || '게시글이 없습니다'} />;
  }

  return (
    <FlatList
      data={feeds}
      renderItem={({ item }) => (
        <FeedItem
          key={item.id}
          feed={item}
          onLike={disableActions ? undefined : onLike}
          onBookmark={disableActions || !showBookmarkButton ? undefined : onBookmark}
          onPress={onPress}
        />
      )}
      className={`mt-1 pt-3 ${className}`}
      contentContainerStyle={{ paddingBottom: 60 }}
      keyExtractor={(item) => `feed-${item.id}`}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      refreshControl={refreshControl ? <RefreshControl {...refreshControl} /> : undefined}
    />
  );
}

export default memo(FeedList);