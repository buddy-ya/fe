export interface UpdateCommentCountParams {
  queryClient: any;
  keys: string[][];
  feedId: number;
  delta: number;
}

export const CommentService = {
  updateCommentCount: ({ queryClient, keys, feedId, delta }: UpdateCommentCountParams) => {
    keys.forEach((key) => {
      queryClient.setQueryData(key, (oldData: any) => {
        if (!oldData) return oldData;
        if (oldData.pages) {
          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            feeds: page.feeds.map((feed: any) =>
              feed.id === feedId
                ? { ...feed, commentCount: (feed.commentCount || 0) + delta }
                : feed
            ),
          }));
          return { ...oldData, pages: newPages };
        }
        return oldData.id === feedId
          ? { ...oldData, commentCount: (oldData.commentCount || 0) + delta }
          : oldData;
      });
    });
  },
};
