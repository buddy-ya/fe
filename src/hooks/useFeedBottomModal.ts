import { CommentType, Feed } from '@/screens/home/types';
import { useModal } from '@/hooks/modal/useModal';
import { bottomModalOptions } from '@/components';

interface UseFeedBottomModalProps {
    feed?: Feed;
    onEditFeed?: () => void;
    onDeleteFeed?: () => void;
    onDeleteComment?: (commentId: number) => void;
    onEditComment?: (comment: CommentType) => void;
}

export const useFeedBottomModal = ({
    feed,
    onEditFeed,
    onDeleteFeed,
    onDeleteComment,
    onEditComment,
}: UseFeedBottomModalProps) => {
    const feedModal = useModal();
    const commentModal = useModal();

    const handleFeedOptions = () => {
        if (!feed) return;

        const options = feed.isFeedOwner
            ? [
                bottomModalOptions.edit(onEditFeed || (() => { })),
                bottomModalOptions.delete(onDeleteFeed || (() => { })),
            ]
            : [bottomModalOptions.report(() => console.log('report comment'))];

        feedModal.openModal(options);
    };

    const handleCommentOptions = (comment: CommentType) => {
        const options = comment.isCommentOwner
            ? [
                bottomModalOptions.edit(() => onEditComment?.(comment)),
                bottomModalOptions.delete(() => onDeleteComment?.(comment.id)),
            ]
            : [bottomModalOptions.report(() => console.log('report comment'))];

        commentModal.openModal(options);
    };

    return {
        feedModal,
        commentModal,
        handleFeedOptions,
        handleCommentOptions,
    };
};
