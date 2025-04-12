import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, RefreshControlProps } from 'react-native';
import { Feed } from '@/types/FeedDTO';
import { EmptyState } from '../common';
import FeedItem from './FeedItem';

interface FeedListProps {
  feeds: Feed[];
  onLike?: (id: number) => void;
  onBookmark?: (id: number) => void;
  onView?: (id: number) => void;
  onPress: (id: number) => void;
  isLoading: boolean;
  hasMore: boolean;
  className?: string;
  onLoadMore: () => void;
  refreshControl?: RefreshControlProps | null;
  emptyStateMessage?: string;
  emptyStateNamespace?: string;
}

function FeedList({
  feeds,
  onLike,
  onBookmark,
  onView,
  onPress,
  className,
  onLoadMore,
  refreshControl,
  hasMore,
  emptyStateNamespace = 'feed',
}: FeedListProps) {
  const { t } = useTranslation('common');

  if (feeds.length === 0) {
    return (
      <EmptyState
        title={t(`emptyState.${emptyStateNamespace}.title`)}
        description={t(`emptyState.${emptyStateNamespace}.description`)}
      />
    );
  }

  const renderFeedItem = useCallback(
    ({ item }) => (
      <FeedItem feed={item} onLike={onLike} onBookmark={onBookmark} onPress={onPress} />
    ),
    [onLike, onBookmark, onPress]
  );

  return (
    <FlatList
      data={feeds}
      renderItem={renderFeedItem}
      className={`mt-1 pt-3 ${className}`}
      contentContainerStyle={{ paddingBottom: 60 }}
      keyExtractor={(item) => `feed-${item.id}`}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.6}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      maxToRenderPerBatch={8}
      scrollEventThrottle={16}
      refreshControl={refreshControl ? <RefreshControl {...refreshControl} /> : undefined}
    />
  );
}

export default memo(FeedList);
