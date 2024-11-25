import React from "react";
import { FlatList } from "react-native";
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
}

export default function FeedList({
  feeds,
  onLike,
  onBookmark,
  onPress,
  onLoadMore,
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
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
}
