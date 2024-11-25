import React, { useState, useEffect } from "react";
import { TouchableOpacity, ScrollView, View } from "react-native";
import { MoreVertical } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import { CommentType } from "./types";
import FeedItem from "@/components/feed/FeedItem";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import BottomModal from "@/components/common/BottomModal";
import CommentList from "@/components/feed/CommentList";
import { CommentInput } from "@/components/feed/CommentInput";
import { useModal } from "@/hooks/useModal";
import { createModalOptions } from "@/utils/constants/modalOptions";
import { getFeed, getFeedComments } from "@/api/feed/getFeed";
import { updateFeed, deleteFeed } from "@/api/feed/crud";
import { createComment, deleteComment } from "@/api/feed/comment";
import { logError } from "@/utils/service/error";
import { toggleLike, toggleBookmark } from "@/api/feed/getFeeds";

export default function FeedDetailScreen({ navigation, route }) {
  const { feedId } = route.params;
  const [feed, setFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<"feed" | "comment">("feed");

  const feedModal = useModal();
  const commentModal = useModal();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [feedResponse, commentsResponse] = await Promise.all([
        getFeed(feedId),
        getFeedComments(feedId),
      ]);
      setFeed(feedResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [feedId]);

  const handleLike = async () => {
    try {
      const { data } = await toggleLike(feedId);
      setFeed((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: data.likeCount,
      }));
    } catch (error) {
      logError(error);
    }
  };

  const handleBookmark = async () => {
    try {
      await toggleBookmark(feedId);
      setFeed((prev) => ({
        ...prev,
        isBookmarked: !prev.isBookmarked,
      }));
    } catch (error) {
      logError(error);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    try {
      const { data } = await createComment(feedId, comment);
      setComments((prev) => [...prev, data]);
      setComment("");
    } catch (error) {
      logError(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === "feed") {
        await deleteFeed(feedId);
        navigation.goBack();
      } else if (selectedComment) {
        await deleteComment(feedId, selectedComment.id);
        setComments((prev) =>
          prev.filter((comment) => comment.id !== selectedComment.id)
        );
        setSelectedComment(null);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      logError(error);
    }
  };

  const handleMorePress = () => {
    const options = feed?.isFeedOwner
      ? [
          createModalOptions.edit(() => console.log("edit feed")),
          createModalOptions.delete(() => {
            feedModal.closeModal();
            setDeleteType("feed");
            setShowDeleteConfirm(true);
          }),
          createModalOptions.cancel(feedModal.closeModal),
        ]
      : [createModalOptions.cancel(feedModal.closeModal)];

    feedModal.openModal(options);
  };

  const handleCommentOptions = (comment: CommentType) => {
    setSelectedComment(comment);
    const options = comment.isCommentOwner
      ? [
          createModalOptions.edit(() => console.log("edit comment")),
          createModalOptions.delete(() => {
            commentModal.closeModal();
            setDeleteType("comment");
            setShowDeleteConfirm(true);
          }),
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

  if (isLoading) {
    return <View>Loading..</View>;
  }

  return (
    <>
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
          footer={
            <CommentInput
              value={comment}
              onChange={setComment}
              onSubmit={handleSubmitComment}
            />
          }
        >
          <ScrollView showsVerticalScrollIndicator={false} className="mt-1">
            {feed && (
              <>
                <FeedItem
                  feed={feed}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  showAllContent
                  disablePress
                />
                <CommentList
                  comments={comments}
                  onCommentOptions={handleCommentOptions}
                />
              </>
            )}
          </ScrollView>
        </KeyboardLayout>
      </Layout>

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

      <BottomModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        options={[
          createModalOptions.delete(handleDelete),
          createModalOptions.cancel(() => setShowDeleteConfirm(false)),
        ]}
      />
    </>
  );
}
