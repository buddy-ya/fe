import { CommentType, Feed } from '@/screens/home/types';
import { useModal } from '@/hooks/modal/useModal';
import { bottomSheetOptions } from '@/components/common/bottomSheet';

interface UseFeedBottomSheetProps {
    feed?: Feed;
    onEditFeed?: () => void;
    onDeleteFeed?: () => void;
    onDeleteComment?: (commentId: number) => void;
    onEditComment?: (comment: CommentType) => void;
}

export const useFeedBottomSheet = ({
    feed,
    onEditFeed,
    onDeleteFeed,
    onDeleteComment,
    onEditComment,
}: UseFeedBottomSheetProps) => {
    const feedModal = useModal();
    const commentModal = useModal();

    const handleFeedOptions = () => {
        if (!feed) return;

        const options = feed.isFeedOwner
            ? [
                bottomSheetOptions.edit(onEditFeed || (() => { })),
                bottomSheetOptions.delete(onDeleteFeed || (() => { })),
            ]
            : [bottomSheetOptions.report(() => console.log('report comment'))];

        feedModal.openModal(options);
    };

    const handleCommentOptions = (comment: CommentType) => {
        const options = comment.isCommentOwner
            ? [
                bottomSheetOptions.edit(() => onEditComment?.(comment)),
                bottomSheetOptions.delete(() => onDeleteComment?.(comment.id)),
            ]
            : [bottomSheetOptions.report(() => console.log('report comment'))];

        commentModal.openModal(options);
    };

    return {
        feedModal,
        commentModal,
        handleFeedOptions,
        handleCommentOptions,
    };
};
