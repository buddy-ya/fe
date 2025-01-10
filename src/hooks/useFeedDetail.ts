import { CommentRepository, feedKeys, FeedRepository } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface UseFeedDetailProps {
  feedId: number;
  enabled?: boolean;
}

export const useFeedDetail = ({ feedId, enabled = true }: UseFeedDetailProps) => {
  const queryClient = useQueryClient();

  const {
    data: feed,
    refetch: refetchFeed,
    isRefetching: isRefetchingFeed,
  } = useQuery({
    queryKey: feedKeys.detail(feedId),
    queryFn: () => FeedRepository.get({ feedId }),
    enabled,
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["feedComments", feedId],
    queryFn: () => CommentRepository.getCommentsByFeedId({ feedId }),
    enabled,
  });

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
    mutationFn: (content: string) => CommentRepository.create({ feedId, content }),
    onSuccess: (newComment) => {
      queryClient.setQueryData(['feedComments', feedId], (old: any) => {
        const currentComments = old || [];
        return [...currentComments, newComment];
      });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
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
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => CommentRepository.update({ feedId, content, commentId }),
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
    submit: async (content: string) => {
      if (!content.trim()) return;
      await commentMutation.mutateAsync(content.trim());
    },
    delete: async (commentId: number) => {
      await deleteCommentMutation.mutateAsync(commentId);
    },
    update: async (commentId: number, content: string) => {
      await updateCommentMutation.mutateAsync({ commentId, content });
    },
  };

  const handleRefresh = async () => {
    await Promise.all([refetchFeed(), refetchComments()]);
  };

  return {
    feed,
    comments: comments || [],
    isRefetching: isRefetchingFeed,
    handleFeedActions,
    handleCommentActions,
    handleRefresh,
  };
};
