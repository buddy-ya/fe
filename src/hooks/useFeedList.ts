import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { updateFeedList } from "@/utils/service/optimisticUpdate";
import { logError } from "@/utils/service/error";
import { FeedListResponse } from "@/screens/home/types";
import FeedRepository from "@/api/FeedRepository";

interface UseFeedListProps {
  queryKey: string[];
  fetchFn: (params: {
    page: number;
    size: number;
  }) => Promise<FeedListResponse>;
  staleTime?: number;
  options?: {
    size?: number;
  };
}

export const useFeedList = ({
  queryKey,
  fetchFn,
  staleTime = 0,
  options = { size: 5 },
}: UseFeedListProps) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<
    FeedListResponse,
    Error,
    FeedListResponse,
    string[],
    number
  >({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      return await fetchFn({
        page: pageParam,
        size: options.size,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    staleTime,
  });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  const handleLike = async (id: number) => {
    try {
      updateFeedList.like(queryClient, queryKey, id);
      await FeedRepository.toggleLike(id);
    } catch (error) {
      logError(error);
      refetch();
    }
  };

  const handleBookmark = async (id: number) => {
    try {
      updateFeedList.bookmark(queryClient, queryKey, id);
      await FeedRepository.toggleBookmark(id);
    } catch (error) {
      logError(error);
      refetch();
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    feeds,
    isLoading,
    hasMore: hasNextPage,
    handleLoadMore,
    handleLike,
    handleBookmark,
    handleRefresh: refetch,
  };
};
