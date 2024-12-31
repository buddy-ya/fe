import { useModal } from "@/hooks/useModal";
import { createModalOptions } from "@/utils/constants/modalOptions";
import { CommentType } from "@/screens/home/types";
import { Feed } from "./../screens/home/types";

interface UseFeedModalsProps {
  feed?: Feed;
  onEditFeed?: () => void;
  onDeleteFeed?: () => void;
  onDeleteComment?: (commentId: number) => void;
  onEditComment?: (comment: CommentType) => void;
}

export const useFeedModals = ({
  feed,
  onEditFeed,
  onDeleteFeed,
  onDeleteComment,
  onEditComment,
}: UseFeedModalsProps) => {
  const feedModal = useModal();
  const commentModal = useModal();

  const handleFeedOptions = () => {
    if (!feed) return;

    const options = feed.isFeedOwner
      ? [
          createModalOptions.delete(onDeleteFeed || (() => {})),
          createModalOptions.edit(onEditFeed || (() => {})),
          createModalOptions.cancel(feedModal.closeModal),
        ]
      : [createModalOptions.cancel(feedModal.closeModal)];

    feedModal.openModal(options);
  };

  const handleCommentOptions = (comment: CommentType) => {
    const options = comment.isCommentOwner
      ? [
          createModalOptions.delete(() => onDeleteComment?.(comment.id)),
          createModalOptions.edit(() => onEditComment?.(comment)),
          createModalOptions.cancel(commentModal.closeModal),
        ]
      : [
          createModalOptions.report(() => console.log("report comment")),
          createModalOptions.cancel(commentModal.closeModal),
        ];

    commentModal.openModal(options);
  };

  return {
    feedModal,
    commentModal,
    handleFeedOptions,
    handleCommentOptions,
  };
};
