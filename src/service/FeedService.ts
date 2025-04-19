import { QueryClient } from '@tanstack/react-query';

export const FeedService = {
  like(queryClient: QueryClient, queryKey: string[], id: number) {
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          feeds: page.feeds.map((feed: any) =>
            feed.id === id
              ? {
                  ...feed,
                  isLiked: !feed.isLiked,
                  likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
                }
              : feed
          ),
        })),
      };
    });
  },

  bookmark(queryClient: QueryClient, queryKey: string[], id: number) {
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          feeds: page.feeds.map((feed: any) =>
            feed.id === id ? { ...feed, isBookmarked: !feed.isBookmarked } : feed
          ),
        })),
      };
    });
  },

  incrementViewCount(queryClient: any, queryKey: string[], feedId: number) {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      if (oldData.pages) {
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          feeds: page.feeds.map((feed: any) =>
            feed.id === feedId ? { ...feed, viewCount: (feed.viewCount || 0) + 1 } : feed
          ),
        }));
        return { ...oldData, pages: newPages };
      }
      return oldData.id === feedId
        ? { ...oldData, viewCount: (oldData.viewCount || 0) + 1 }
        : oldData;
    });
  },

  rollback(queryClient: QueryClient, queryKey: string[], previousData: any) {
    queryClient.setQueryData(queryKey, previousData);
  },
};
