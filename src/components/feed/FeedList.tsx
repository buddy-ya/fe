import React from "react";
import { FlatList } from "react-native";
import FeedItem from "./FeedItem";
import { Feed } from "@/screens/home/types";

interface FeedListProps {
  feeds: Feed[];
  onEndReached?: () => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onComment: (id: number) => void;
  onPress: (id: number) => void;
}

export default function FeedList({
  feeds,
  onEndReached,
  onLike,
  onBookmark,
  onComment,
  onPress,
}: FeedListProps) {
  return (
    <FlatList
      data={feeds}
      renderItem={({ item }) => (
        <FeedItem
          feed={item}
          onLike={onLike}
          onBookmark={onBookmark}
          onComment={onComment}
          onPress={onPress}
        />
      )}
      className="mt-4"
      keyExtractor={(item) => item.id.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
}
