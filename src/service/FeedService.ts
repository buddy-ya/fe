import { QueryClient } from "@tanstack/react-query";

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
                                likeCount: feed.isLiked
                                    ? feed.likeCount - 1
                                    : feed.likeCount + 1,
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
                        feed.id === id
                            ? { ...feed, isBookmarked: !feed.isBookmarked }
                            : feed
                    ),
                })),
            };
        });
    },

    rollback(
        queryClient: QueryClient,
        queryKey: string[],
        previousData: any
    ) {
        queryClient.setQueryData(queryKey, previousData);
    },
}