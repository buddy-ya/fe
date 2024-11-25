import React, { useState } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { MoreVertical } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import { CommentType, Feed } from "./types";
import { mockFeeds } from "./mock/feedData";
import FeedItem from "@/components/feed/FeedItem";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import BottomModal from "@/components/common/BottomModal";
import { mockComments } from "./mock/commentData";
import CommentList from "@/components/feed/CommentList";
import { CommentInput } from "@/components/feed/CommentInput";
import { useModal } from "@/hooks/useModal";
import { createModalOptions } from "@/utils/constants/modalOptions";

interface FeedDetailScreenProps {
  route: {
    params: {
      feedId: number;
    };
  };
  navigation: any;
}

export default function FeedDetailScreen({
  navigation,
  route,
}: FeedDetailScreenProps) {
  const { feedId } = route.params;
  const [comment, setComment] = useState("");
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null
  );
  const feed = mockFeeds.feeds.find((feed) => feed.id === feedId);

  const feedModal = useModal();
  const commentModal = useModal();

  const handleLike = (id: number) => console.log("Like:", id);
  const handleBookmark = (id: number) => console.log("Bookmark:", id);
  const handleComment = (id: number) => console.log("Comment:", id);

  const handleMorePress = () => {
    const options = feed?.isFeedOwner
      ? [
          createModalOptions.edit(() => console.log("edit feed")),
          createModalOptions.delete(() => console.log("delete feed")),
          createModalOptions.cancel(feedModal.closeModal),
        ]
      : [
          // createModalOptions.report(() => console.log("report feed")),
          createModalOptions.cancel(feedModal.closeModal),
        ];

    feedModal.openModal(options);
  };

  const handleCommentOptions = (comment: CommentType) => {
    setSelectedComment(comment);
    const options = comment.isCommentOwner
      ? [
          createModalOptions.edit(() => console.log("edit comment")),
          createModalOptions.delete(() => console.log("delete comment")),
          createModalOptions.cancel(() => {
            commentModal.closeModal();
            setSelectedComment(null);
          }),
        ]
      : [
          createModalOptions.report(() => console.log("report comment")),
          createModalOptions.cancel(() => {
            commentModal.closeModal();
            setSelectedComment(null);
          }),
        ];

    commentModal.openModal(options);
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerRight={
        <TouchableOpacity onPress={handleMorePress}>
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
        visible={feedModal.visible}
        onClose={feedModal.closeModal}
        options={feedModal.options}
      />

      <BottomModal
        visible={commentModal.visible}
        onClose={commentModal.closeModal}
        options={commentModal.options}
      />
    </Layout>
  );
}
