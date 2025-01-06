import { CommentType } from '@/screens/home/types';
import { useModal } from '@/hooks/modal/useModal';
import { createModalOptions } from '@/components';
import { Feed } from '../../screens/home/types';

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
        createModalOptions.delete(onDeleteFeed || (() => { })),
        createModalOptions.edit(onEditFeed || (() => { })),
      ]
      : [createModalOptions.report(() => console.log('report comment'))];

    feedModal.openModal(options);
  };

  const handleCommentOptions = (comment: CommentType) => {
    const options = comment.isCommentOwner
      ? [
        createModalOptions.delete(() => onDeleteComment?.(comment.id)),
        createModalOptions.edit(() => onEditComment?.(comment)),
      ]
      : [createModalOptions.report(() => console.log('report comment'))];

    commentModal.openModal(options);
  };

  return {
    feedModal,
    commentModal,
    handleFeedOptions,
    handleCommentOptions,
  };
};
