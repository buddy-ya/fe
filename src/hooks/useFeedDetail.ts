import { CommentRepository, feedKeys, FeedRepository } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseFeedDetailProps {
  feedId: number;
  feedCategory?: string;
  updateBookmarkCache?: boolean;
  updateMyPostsCache?: boolean;
  updateSearchCache?: boolean;
  searchKeyword?: string;
  enabled?: boolean;
}

function updateCaches(
  queryClient: any,
  keys: string[][],
  feedId: number,
  updater: (feed: any) => any
) {
  keys.forEach((key) => {
    queryClient.setQueryData(key, (oldData: any) => {
      if (!oldData) return oldData;
      if (oldData.pages) {
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          feeds: page.feeds.map((feed: any) => (feed.id === feedId ? updater(feed) : feed)),
        }));
        return { ...oldData, pages: newPages };
      }
      return oldData.id === feedId ? updater(oldData) : oldData;
    });
  });
}

export const useFeedDetail = ({
  feedId,
  feedCategory,
  updateBookmarkCache = false,
  updateMyPostsCache = false,
  updateSearchCache = false,
  searchKeyword,
}: UseFeedDetailProps) => {
  const queryClient = useQueryClient();

  const collectKeys = (): string[][] => {
    const keys = [feedKeys.detail(feedId)];
    if (!updateSearchCache && feedCategory) {
      keys.push(feedKeys.lists(feedCategory));
    }
    if (updateBookmarkCache) {
      keys.push(feedKeys.bookmarks());
    }
    if (updateMyPostsCache) {
      keys.push(feedKeys.myPosts());
    }
    if (updateSearchCache && searchKeyword) {
      keys.push(feedKeys.search(searchKeyword));
    }
    return keys;
  };

  const likeMutation = useMutation({
    mutationFn: FeedRepository.toggleLike,
    onMutate: async () => {
      const keysToUpdate = collectKeys();
      await Promise.all(keysToUpdate.map((key) => queryClient.cancelQueries({ queryKey: key })));
      const previousStates: Record<string, any> = {};
      keysToUpdate.forEach((key) => {
        previousStates[key.join('-')] = queryClient.getQueryData(key);
      });
      updateCaches(queryClient, keysToUpdate, feedId, (feed: any) => {
        const isLiked = !feed.isLiked;
        return { ...feed, isLiked, likeCount: feed.likeCount + (isLiked ? 1 : -1) };
      });
      return { previousStates, keysToUpdate };
    },
    onError: (error, variables, context: any) => {
      if (context && context.keysToUpdate) {
        context.keysToUpdate.forEach((key: string[]) => {
          queryClient.setQueryData(key, context.previousStates[key.join('-')]);
        });
      }
    },
    onSettled: (data, error, variables, context: any) => {
      if (context && context.keysToUpdate) {
        context.keysToUpdate.forEach((key: string[]) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: FeedRepository.toggleBookmark,
    onMutate: async () => {
      const keysToUpdate = collectKeys();
      await Promise.all(keysToUpdate.map((key) => queryClient.cancelQueries({ queryKey: key })));
      const previousStates: Record<string, any> = {};
      keysToUpdate.forEach((key) => {
        previousStates[key.join('-')] = queryClient.getQueryData(key);
      });
      updateCaches(queryClient, keysToUpdate, feedId, (feed: any) => {
        return { ...feed, isBookmarked: !feed.isBookmarked };
      });
      return { previousStates, keysToUpdate };
    },
    onError: (error, variables, context: any) => {
      if (context && context.keysToUpdate) {
        context.keysToUpdate.forEach((key: string[]) => {
          queryClient.setQueryData(key, context.previousStates[key.join('-')]);
        });
      }
    },
    onSettled: (data, error, variables, context: any) => {
      if (context && context.keysToUpdate) {
        context.keysToUpdate.forEach((key: string[]) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: number }) =>
      CommentRepository.create({ feedId, parentId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const commentLikeMutation = useMutation({
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
      await commentLikeMutation.mutateAsync(commentId);
    },
  };

  return {
    handleFeedActions,
    handleCommentActions,
  };
};
