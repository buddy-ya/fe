import React, { useRef, useState } from "react";
import { View, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { ChevronLeft, MoreVertical } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import { CommentType, Feed } from "./types";
import { mockFeeds } from "./mock/feedData";
import FeedItem from "@/components/feed/FeedItem";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import BottomModal from "@/components/common/BottomModal";
import { mockComments } from "./mock/commentData";
import CommentList from "@/components/feed/CommentList";
import { useModals } from "@/hooks/useModals";
import { CommentInput } from "@/components/feed/CommentInput";

interface FeedDetailScreenProps {
  route: {
    params: {
      feedId: number;
    };
  };
  navigation: any;
}

const fetchFeedDetail = async (feedId: number): Promise<Feed> => {
  const feed = mockFeeds.feeds.find((feed) => feed.id === feedId);
  if (!feed) throw new Error("Feed not found");
  return feed;
};

export default function FeedDetailScreen({
  navigation,
  route,
}: FeedDetailScreenProps) {
  const { feedId } = route.params;
  const [comment, setComment] = useState("");
  const feed = mockFeeds.feeds.find((feed) => feed.id === feedId);

  const {
    isMoreModalVisible,
    isCommentModalVisible,
    setIsMoreModalVisible,
    setIsCommentModalVisible,
    setSelectedComment,
    getFeedModalOptions,
    getCommentModalOptions,
  } = useModals(feed);

  const handleLike = (id: number) => console.log("Like:", id);
  const handleBookmark = (id: number) => console.log("Bookmark:", id);
  const handleComment = (id: number) => console.log("Comment:", id);
  const handleCommentOptions = (comment: CommentType) => {
    setSelectedComment(comment);
    setIsCommentModalVisible(true);
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerRight={
        <TouchableOpacity onPress={() => setIsMoreModalVisible(true)}>
          <MoreVertical size={24} color="#797979" />
        </TouchableOpacity>
      }
    >
      <KeyboardLayout
        footer={<CommentInput value={comment} onChange={setComment} />}
      >
        <ScrollView showsVerticalScrollIndicator={false} className="mt-1">
          {feed && (
            <>
              <FeedItem
                feed={feed}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onComment={handleComment}
                showAllContent
                disablePress
              />
              <CommentList
                comments={mockComments}
                onCommentOptions={handleCommentOptions}
              />
            </>
          )}
        </ScrollView>
      </KeyboardLayout>

      <BottomModal
        visible={isMoreModalVisible}
        onClose={() => setIsMoreModalVisible(false)}
        options={getFeedModalOptions()}
      />

      <BottomModal
        visible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        options={getCommentModalOptions()}
      />
    </Layout>
  );
}
