import React, { useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Keyboard,
  RefreshControl,
  Alert,
} from "react-native";
import { MoreVertical } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Layout from "@/components/common/Layout";
import FeedItem from "@/components/feed/FeedItem";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import BottomModal from "@/components/common/BottomModal";
import CommentList from "@/components/feed/CommentList";
import { CommentInput } from "@/components/feed/CommentInput";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { getCertificationModalTexts } from "@/utils/constants/ModalTexts";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useFeedDetail } from "@/hooks/useFeedDetail";
import { useFeedModals } from "@/hooks/useFeedModal";
import { deleteFeed } from "@/api/feed/feedAction";

export default function FeedDetailScreen({ navigation, route }) {
  const { feedId } = route.params;
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

  const {
    feed,
    comments,
    isRefetching,
    handleFeedActions,
    handleCommentActions,
    handleRefresh,
  } = useFeedDetail({
    feedId,
  });

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

  const { feedModal, commentModal, handleFeedOptions, handleCommentOptions } =
    useFeedModals({
      feed,
      onEditFeed: () =>
        navigation.navigate("FeedWrite", {
          feed,
          isEdit: true,
        }),
      onDeleteFeed: () => {
        showDeleteAlert(async () => {
          setIsDeleted(true);
          await deleteFeed(feedId);
          feedModal.closeModal();
          navigation.goBack();
        });
      },
      onEditComment: (comment) =>
        navigation.navigate("CommentEdit", {
          feedId,
          commentId: comment.id,
          initialContent: comment.content,
        }),
      onDeleteComment: handleCommentActions.delete,
    });

  const handleCommentSubmit = async () => {
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

      await handleCommentActions.submit(comment);
      setComment("");
    } catch (error) {
      console.error("Comment submission failed:", error);
    }
  };

  if (isDeleted) return null;

  return (
    <>
      <Layout
        showHeader
        disableBottomSafeArea
        onBack={() => navigation.goBack()}
        headerRight={
          feed?.isFeedOwner && (
            <TouchableOpacity
              onPress={handleFeedOptions}
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
              onSubmit={handleCommentSubmit}
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
