import { FeedListResponse } from '@/screens/home/types';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { logError } from '@/utils';
import { FeedService } from '@/service';
import { FeedRepository } from '@/api';

interface UseFeedListProps {
  queryKey: string[];
  fetchFn: (params: { page: number; size: number }) => Promise<FeedListResponse>;
  staleTime?: number;
  options?: {
    size: number;
  };
}

const LOAD_MORE_SIZE = 8;

export const useFeedList = ({
  queryKey,
  fetchFn,
  staleTime = 0,
  options = { size: LOAD_MORE_SIZE },
}: UseFeedListProps) => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery<FeedListResponse, Error, FeedListResponse, string[], number>({
      queryKey,
      queryFn: async ({ pageParam = 0 }) => {
        return fetchFn({
          page: pageParam,
          size: options.size,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.currentPage + 1 : undefined),
      staleTime,
    });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  const handleLike = async (id: number) => {
    try {
      FeedService.like(queryClient, queryKey, id);
      await FeedRepository.toggleLike({ feedId: id });
    } catch (error) {
      logError(error);
      refetch();
    }
  };

  const handleBookmark = async (id: number) => {
    try {
      FeedService.bookmark(queryClient, queryKey, id);
      await FeedRepository.toggleBookmark({ feedId: id });
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
