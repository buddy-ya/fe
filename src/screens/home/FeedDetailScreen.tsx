import React, { useState, useEffect } from "react";
import { TouchableOpacity, ScrollView, View } from "react-native";
import { MoreVertical } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import { CommentType, Feed } from "./types";
import FeedItem from "@/components/feed/FeedItem";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import BottomModal from "@/components/common/BottomModal";
import CommentList from "@/components/feed/CommentList";
import { CommentInput } from "@/components/feed/CommentInput";
import { useModal } from "@/hooks/useModal";
import { createModalOptions } from "@/utils/constants/modalOptions";
import { getFeed, getFeedComments } from "@/api/feed/getFeed";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/api/feed/comment";
import { logError } from "@/utils/service/error";
import MyText from "@/components/common/MyText";
import { toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { deleteFeed } from "@/api/feed/feedAction";

export default function FeedDetailScreen({ navigation, route }) {
  const { feedId } = route.params;
  const feedModal = useModal();
  const commentModal = useModal();

  const [feed, setFeed] = useState<Feed | null>(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로딩
  useEffect(() => {
    loadFeedData();
  }, [feedId]);

  const loadFeedData = async () => {
    try {
      setIsLoading(true);
      const [feedData, commentsData] = await Promise.all([
        getFeed(feedId),
        getFeedComments(feedId),
      ]);
      setFeed(feedData);
      setComments(commentsData.comments);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 피드 인터랙션
  const handleFeedActions = {
    like: async () => {
      try {
        const { isLiked, likeCount } = await toggleLike(feedId);
        setFeed((prev) => prev && { ...prev, isLiked, likeCount });
      } catch (error) {
        logError(error);
      }
    },
    bookmark: async () => {
      try {
        await toggleBookmark(feedId);
        setFeed(
          (prev) => prev && { ...prev, isBookmarked: !prev.isBookmarked }
        );
      } catch (error) {
        logError(error);
      }
    },
    showOptions: () => {
      const options = feed?.isFeedOwner
        ? [
            createModalOptions.edit(() =>
              navigation.navigate("FeedWrite", {
                feed,
                isEdit: true,
              })
            ),
            createModalOptions.delete(() => {
              deleteFeed(feedId);
              feedModal.closeModal();
            }),
            createModalOptions.cancel(feedModal.closeModal),
          ]
        : [createModalOptions.cancel(feedModal.closeModal)];

      feedModal.openModal(options);
    },
  };

  // 댓글 관련 기능
  const handleCommentActions = {
    submit: async () => {
      if (!comment.trim()) return;
      try {
        const newComment = await createComment(feedId, comment);
        setComments((prev) => [...prev, newComment]);
        setComment("");
      } catch (error) {
        logError(error);
      }
    },
    delete: async (commentId: number) => {
      try {
        await deleteComment(feedId, commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } catch (error) {
        logError(error);
      }
    },
    update: async (commentId: number, content: string) => {
      try {
        await updateComment(feedId, commentId, content);
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, content } : c))
        );
      } catch (error) {
        logError(error);
      }
    },
    showOptions: (comment: CommentType) => {
      const options = comment.isCommentOwner
        ? [
            createModalOptions.edit(() =>
              handleCommentActions.update(comment.id, comment.content)
            ),
            createModalOptions.delete(() =>
              handleCommentActions.delete(comment.id)
            ),
            createModalOptions.cancel(commentModal.closeModal),
          ]
        : [
            createModalOptions.report(() => console.log("report comment")),
            createModalOptions.cancel(commentModal.closeModal),
          ];

      commentModal.openModal(options);
    },
  };

  return (
    <>
      <Layout
        showHeader
        onBack={navigation.goBack}
        headerRight={
          <TouchableOpacity onPress={handleFeedActions.showOptions}>
            <MoreVertical size={24} color="#797979" />
          </TouchableOpacity>
        }
      >
        <KeyboardLayout
          footer={
            <CommentInput
              value={comment}
              onChange={setComment}
              onSubmit={handleCommentActions.submit}
            />
          }
        >
          <ScrollView showsVerticalScrollIndicator={false} className="mt-1">
            {feed && (
              <>
                <FeedItem
                  feed={feed}
                  onLike={handleFeedActions.like}
                  onBookmark={handleFeedActions.bookmark}
                  showAllContent
                  disablePress
                />
                <CommentList
                  comments={comments}
                  onCommentOptions={handleCommentActions.showOptions}
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
    </>
  );
}
