import React from "react";
import { FlatList, RefreshControl, RefreshControlProps } from "react-native";
import FeedItem from "./FeedItem";
import { Feed } from "@/screens/home/types";
import EmptyState from "@/components/common/EmptyState"; // 필요한 경우 생성

interface FeedListProps {
  feeds: Feed[];
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onPress: (id: number) => void;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  refreshControl?: RefreshControlProps | null;
  emptyStateMessage?: string;
  showBookmarkButton?: boolean;
  disableActions?: boolean;
}

export default function FeedList({
  feeds,
  onLike,
  onBookmark,
  onPress,
  onLoadMore,
  refreshControl,
  hasMore,
  emptyStateMessage,
  showBookmarkButton = true,
  disableActions = false,
}: FeedListProps) {
  if (feeds.length === 0) {
    return <EmptyState message={emptyStateMessage || "게시글이 없습니다"} />;
  }

  return (
    <FlatList
      data={feeds}
      renderItem={({ item }) => (
        <FeedItem
          key={item.id}
          feed={item}
          onLike={disableActions ? undefined : onLike}
          onBookmark={
            disableActions || !showBookmarkButton ? undefined : onBookmark
          }
          onPress={onPress}
        />
      )}
      className="mt-4"
      contentContainerStyle={{ paddingBottom: 60 }}
      keyExtractor={(item) => `feed-${item.id}`}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      refreshControl={
        refreshControl ? <RefreshControl {...refreshControl} /> : undefined
      }
    />
  );
}
