// hooks/useFeedDetail.ts
import { CommentRepository, feedKeys, FeedRepository } from '@/api';
import { CommentService } from '@/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseFeedDetailProps {
  feedId: number;
  university?: string;
  feedCategory?: string;
  updateBookmarkCache?: boolean;
  updateMyPostsCache?: boolean;
  updateSearchCache?: boolean;
  searchKeyword?: string;
}

// 옵티미스틱 업데이트 컨텍스트 타입
interface OptimisticContext {
  previous: Record<string, any>;
  keysToUpdate: string[][];
}

// 댓글 등록 컨텍스트 타입
interface CommentContext {
  keys: string[][];
}

function updateCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  keys: string[][],
  feedId: number,
  updater: (feed: any) => any
) {
  keys.forEach((key) => {
    queryClient.setQueryData(key, (oldData: any) => {
      if (!oldData) return oldData;
      // infinite query pages 구조
      if (oldData.pages) {
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          feeds: page.feeds.map((f: any) => (f.id === feedId ? updater(f) : f)),
        }));
        return { ...oldData, pages: newPages };
      }
      // 단일 객체 구조
      return oldData.id === feedId ? updater(oldData) : oldData;
    });
  });
}

export function useFeedDetail({
  feedId,
  university,
  feedCategory,
  updateBookmarkCache = false,
  updateMyPostsCache = false,
  updateSearchCache = false,
  searchKeyword,
}: UseFeedDetailProps) {
  const queryClient = useQueryClient();
  const effectiveUniversity = university ?? 'all';

  const collectKeys = (): string[][] => {
    const keys: string[][] = [feedKeys.detail(feedId)];
    if (!updateSearchCache && feedCategory) {
      keys.push(feedKeys.lists(effectiveUniversity, feedCategory));
    }
    if (updateBookmarkCache) keys.push(feedKeys.bookmarks());
    if (updateMyPostsCache) keys.push(feedKeys.myPosts());
    if (updateSearchCache && searchKeyword) {
      keys.push(feedKeys.search(searchKeyword));
    }
    return keys;
  };

  // --- 좋아요 옵티미스틱 뮤테이션 ---
  const likeMutation = useMutation<
    unknown, // TData (무시)
    Error, // TError
    { feedId: number }, // TVariables
    OptimisticContext // TContext
  >({
    mutationFn: FeedRepository.toggleLike,
    onMutate: async (vars) => {
      const keysToUpdate = collectKeys();
      await Promise.all(keysToUpdate.map((key) => queryClient.cancelQueries({ queryKey: key })));
      const previous: Record<string, any> = {};
      keysToUpdate.forEach((key) => {
        previous[key.join('-')] = queryClient.getQueryData(key);
      });
      updateCaches(queryClient, keysToUpdate, vars.feedId, (f) => {
        const nextLiked = !f.isLiked;
        return {
          ...f,
          isLiked: nextLiked,
          likeCount: f.likeCount + (nextLiked ? 1 : -1),
        };
      });
      return { previous, keysToUpdate };
    },
    onError: (_err, _vars, context) => {
      if (!context) return;

      context.keysToUpdate.forEach((key) => {
        queryClient.setQueryData(key, context.previous[key.join('-')]);
      });
    },
    // onSettled: invalidate 제거
  });

  // --- 북마크 옵티미스틱 뮤테이션 ---
  const bookmarkMutation = useMutation<unknown, Error, { feedId: number }, OptimisticContext>({
    mutationFn: FeedRepository.toggleBookmark,
    onMutate: async (vars) => {
      const keysToUpdate = collectKeys();
      await Promise.all(keysToUpdate.map((key) => queryClient.cancelQueries({ queryKey: key })));
      const previous: Record<string, any> = {};
      keysToUpdate.forEach((key) => {
        previous[key.join('-')] = queryClient.getQueryData(key);
      });
      updateCaches(queryClient, keysToUpdate, vars.feedId, (f) => ({
        ...f,
        isBookmarked: !f.isBookmarked,
      }));
      return { previous, keysToUpdate };
    },
    onError: (_err, _vars, context) => {
      if (!context) return;

      context.keysToUpdate.forEach((key) => {
        queryClient.setQueryData(key, context.previous[key.join('-')]);
      });
    },
    // onSettled: invalidate 제거
  });

  // --- 댓글 등록 옵티미스틱 뮤테이션 ---
  const commentMutation = useMutation<
    unknown,
    Error,
    { content: string; parentId?: number },
    CommentContext
  >({
    mutationFn: ({ content, parentId }) => CommentRepository.create({ feedId, parentId, content }),
    onMutate: async (vars) => {
      const keys = [feedKeys.detail(feedId)];
      if (feedCategory) {
        keys.push(feedKeys.lists(effectiveUniversity, feedCategory));
      }
      CommentService.updateCommentCount({
        queryClient,
        keys,
        feedId,
        delta: +1,
      });
      return { keys };
    },
    onError: (_err, _vars, context) => {
      if (!context) return;

      CommentService.updateCommentCount({
        queryClient,
        keys: context.keys,
        feedId,
        delta: -1,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
    },
  });

  // --- 댓글 좋아요 뮤테이션 ---
  const commentLikeMutation = useMutation<
    unknown,
    Error,
    number, // commentId
    undefined
  >({
    mutationFn: (commentId) => CommentRepository.toggleLike({ feedId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
    },
  });

  // --- 댓글 삭제 뮤테이션 ---
  const deleteCommentMutation = useMutation<
    unknown,
    Error,
    number, // commentId
    CommentContext
  >({
    mutationFn: (commentId) => CommentRepository.delete({ feedId, commentId }),
    onMutate: async (commentId) => {
      const keys = [feedKeys.detail(feedId)];
      if (feedCategory) {
        keys.push(feedKeys.lists(effectiveUniversity, feedCategory));
      }
      CommentService.updateCommentCount({
        queryClient,
        keys,
        feedId,
        delta: -1,
      });
      return { keys };
    },
    onError: (_err, _vars, context) => {
      if (!context) return;

      CommentService.updateCommentCount({
        queryClient,
        keys: context.keys,
        feedId,
        delta: +1,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
    },
  });

  // --- 댓글 업데이트 뮤테이션 ---
  const updateCommentMutation = useMutation<
    unknown,
    Error,
    { commentId: number; content: string },
    undefined
  >({
    mutationFn: ({ commentId, content }) =>
      CommentRepository.update({ feedId, commentId, content }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments', feedId] });
    },
  });

  return {
    handleFeedActions: {
      like: () => likeMutation.mutate({ feedId }),
      bookmark: () => bookmarkMutation.mutate({ feedId }),
    },
    handleCommentActions: {
      submit: (content: string, parentId?: number) =>
        commentMutation.mutate({ content: content.trim(), parentId }),
      like: (commentId: number) => commentLikeMutation.mutate(commentId),
      delete: (commentId: number) => deleteCommentMutation.mutate(commentId),
      update: (commentId: number, content: string) =>
        updateCommentMutation.mutate({ commentId, content: content.trim() }),
    },
  };
}
