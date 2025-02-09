import { CommentRepository, feedKeys, FeedRepository } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseFeedDetailProps {
  feedId: number;
  enabled?: boolean;
}

export const useFeedDetail = ({ feedId }: UseFeedDetailProps) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: FeedRepository.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: FeedRepository.toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: number }) => {
      return CommentRepository.create({ feedId, parentId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const CommentLikeMutation = useMutation({
    mutationFn: (commentId: number) => CommentRepository.toggleLike({ feedId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => CommentRepository.delete({ feedId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      CommentRepository.update({ feedId, content, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const handleFeedActions = {
    like: () => likeMutation.mutate({ feedId }),
    bookmark: () => bookmarkMutation.mutate({ feedId }),
  };

  const handleCommentActions = {
    submit: async (content: string, parentId?: number) => {
      if (!content.trim()) return;
      await commentMutation.mutateAsync({ content: content.trim(), parentId });
    },
    delete: async (commentId: number) => {
      await deleteCommentMutation.mutateAsync(commentId);
    },
    update: async (commentId: number, content: string) => {
      await updateCommentMutation.mutateAsync({ commentId, content });
    },
    like: async (commentId: number) => {
      await CommentLikeMutation.mutateAsync(commentId);
    },
  };

  return {
    handleFeedActions,
    handleCommentActions,
  };
};
