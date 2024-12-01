import React, { useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Keyboard,
  RefreshControl,
  Alert,
} from "react-native";
import { MoreVertical } from "lucide-react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/api/feed/comment";
import { toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { deleteFeed } from "@/api/feed/feedAction";
import { feedKeys } from "@/api/queryKeys";
import { useTranslation } from "react-i18next";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { getCertificationModalTexts } from "@/utils/constants/ModalTexts";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function FeedDetailScreen({ navigation, route }) {
  const { feedId } = route.params;
  const feedModal = useModal();
  const commentModal = useModal();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const { t } = useTranslation("feed");
  const { t: certT } = useTranslation("certification");

  const {
    isModalVisible,
    setIsModalVisible,
    currentModalTexts,
    setCurrentModalTexts,
    checkAuth,
  } = useAuthCheck();

  const { data: feed } = useQuery({
    queryKey: feedKeys.detail(feedId),
    queryFn: () => getFeed(feedId),
    enabled: !isDeleted,
  });

  const { data: commentsData } = useQuery({
    queryKey: ["feedComments", feedId],
    queryFn: () => getFeedComments(feedId),
    enabled: !isDeleted,
  });

  const { refetch, isRefetching } = useQuery({
    queryKey: feedKeys.detail(feedId),
    queryFn: () => getFeed(feedId),
    enabled: !isDeleted,
  });

  const { refetch: refetchComments } = useQuery({
    queryKey: ["feedComments", feedId],
    queryFn: () => getFeedComments(feedId),
    enabled: !isDeleted,
  });

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchComments()]);
  };

  const showDeleteAlert = (onConfirm: () => void) => {
    Alert.alert(
      t("delete.title"),
      t("delete.description"),
      [
        {
          text: t("delete.cancel"),
          style: "cancel",
        },
        {
          text: t("delete.confirm"),
          style: "destructive",
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  };

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => createComment(feedId, content),
    onSuccess: (newComment) => {
      queryClient.setQueryData(["feedComments", feedId], (old: any) => ({
        ...old,
        comments: [...old.comments, newComment],
      }));
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
      setComment("");
      Keyboard.dismiss();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(feedId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedComments", feedId] });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(feedId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedComments", feedId] });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const handleFeedActions = {
    like: () => likeMutation.mutate(feedId),
    bookmark: () => bookmarkMutation.mutate(feedId),
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
              showDeleteAlert(async () => {
                setIsDeleted(true);
                await deleteFeed(feedId);
                queryClient.invalidateQueries({ queryKey: feedKeys.all });
                feedModal.closeModal();
                navigation.goBack();
              });
            }),
            createModalOptions.cancel(feedModal.closeModal),
          ]
        : [createModalOptions.cancel(feedModal.closeModal)];

      feedModal.openModal(options);
    },
  };

  const handleCommentActions = {
    submit: async () => {
      if (!comment.trim()) return;

      Keyboard.dismiss();

      try {
        const { isCertificated, isKorean, isStudentIdCardRequested } =
          await checkAuth();
        if (!isCertificated) {
          const modalTexts = getCertificationModalTexts(
            isKorean,
            isStudentIdCardRequested,
            certT,
            navigation
          );
          setCurrentModalTexts(modalTexts);
          setIsModalVisible(true);
          return;
        }

        await commentMutation.mutateAsync(comment.trim());
        setComment("");
      } catch (error) {
        console.error("Comment submission failed:", error);
      }
    },
    delete: async (commentId: number) => {
      await deleteCommentMutation.mutateAsync(commentId);
    },
    update: async (commentId: number, content: string) => {
      await updateCommentMutation.mutateAsync({ commentId, content });
    },
    showOptions: (comment: CommentType) => {
      const options = comment.isCommentOwner
        ? [
            createModalOptions.edit(() =>
              navigation.navigate("CommentEdit", {
                feedId,
                commentId: comment.id,
                initialContent: comment.content,
              })
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
        disableBottomSafeArea
        onBack={() => navigation.goBack()}
        headerRight={
          feed?.isFeedOwner && (
            <TouchableOpacity
              onPress={handleFeedActions.showOptions}
              hitSlop={{ bottom: 20, left: 20 }}
            >
              <MoreVertical size={24} color="#797979" />
            </TouchableOpacity>
          )
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="mt-1"
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor="#4AA366"
              />
            }
          >
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
                  comments={commentsData?.comments || []}
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
      <ConfirmModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          currentModalTexts?.onConfirm();
        }}
        title={currentModalTexts?.title || ""}
        description={currentModalTexts?.description || ""}
        cancelText={currentModalTexts?.cancelText}
        confirmText={currentModalTexts?.confirmText}
        position="bottom"
        size="default"
      />
    </>
  );
}
