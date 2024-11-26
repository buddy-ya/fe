import React from "react";
import { FlatList, RefreshControl, RefreshControlProps } from "react-native";
import FeedItem from "./FeedItem";
import { Feed } from "@/screens/home/types";

interface FeedListProps {
  feeds: Feed[];
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onPress: (id: number) => void;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  refreshControl?: RefreshControlProps | null;
}

export default function FeedList({
  feeds,
  onLike,
  onBookmark,
  onPress,
  onLoadMore,
  refreshControl,
  hasMore,
}: FeedListProps) {
  return (
    <FlatList
      data={feeds}
      renderItem={({ item }) => (
        <FeedItem
          feed={item}
          onLike={onLike}
          onBookmark={onBookmark}
          onPress={onPress}
        />
      )}
      className="mt-4"
      keyExtractor={(item) => item.id.toString()}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      refreshControl={
        refreshControl ? <RefreshControl {...refreshControl} /> : undefined
      }
    />
  );
}
