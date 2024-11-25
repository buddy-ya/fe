import { CommentType, Feed } from "@/screens/home/types";
import { useState } from "react";

export const useModals = (feed: Feed | undefined) => {
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null
  );

  const getFeedModalOptions = () =>
    feed?.isFeedOwner
      ? [
          { label: "수정하기", onPress: () => {} },
          { label: "삭제하기", onPress: () => {}, color: "text-red-500" },
          { label: "취소", onPress: () => setIsMoreModalVisible(false) },
        ]
      : [
          { label: "신고하기", onPress: () => {}, color: "text-red-500" },
          { label: "취소", onPress: () => setIsMoreModalVisible(false) },
        ];

  const getCommentModalOptions = () =>
    selectedComment?.isCommentOwner
      ? [
          { label: "수정하기", onPress: () => {} },
          { label: "삭제하기", onPress: () => {}, color: "text-red-500" },
          {
            label: "취소",
            onPress: () => {
              setIsCommentModalVisible(false);
              setSelectedComment(null);
            },
          },
        ]
      : [
          { label: "신고하기", onPress: () => {}, color: "text-red-500" },
          {
            label: "취소",
            onPress: () => {
              setIsCommentModalVisible(false);
              setSelectedComment(null);
            },
          },
        ];

  return {
    isMoreModalVisible,
    isCommentModalVisible,
    selectedComment,
    setIsMoreModalVisible,
    setIsCommentModalVisible,
    setSelectedComment,
    getFeedModalOptions,
    getCommentModalOptions,
  };
};
