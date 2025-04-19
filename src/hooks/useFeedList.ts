import { FeedRepository } from '@/api';
import { FeedListResponse } from '@/screens/home/types';
import { FeedService } from '@/service';
import { FeedDTO } from '@/types';
import { useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useTabStore } from '@/store/useTabStore';
import { useUserStore } from '@/store/useUserStore';
import { logError } from '@/utils';

interface UseFeedListProps {
  queryKey: string[];
  fetchFn: (params: FeedDTO) => Promise<FeedListResponse>;
  category?: string;
  keyword?: string;
  staleTime?: number;
  options?: {
    size: number;
  };
}

const LOAD_MORE_SIZE = 8;

export function useFeedList({
  queryKey,
  fetchFn,
  category,
  keyword,
  staleTime = 0,
  options = { size: LOAD_MORE_SIZE },
}: UseFeedListProps) {
  const queryClient = useQueryClient();
  const hydrated = useUserStore((s) => s.hydrated);
  const selectedTab = useTabStore((s) => s.selectedTab);
  const userUniversity = useUserStore((s) => s.university);
  const university = selectedTab === 'myUni' ? userUniversity : 'all';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useSuspenseInfiniteQuery<FeedListResponse, Error, FeedListResponse>({
      queryKey,
      enabled: hydrated,
      staleTime,
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) =>
        fetchFn({
          page: pageParam,
          size: options.size,
          university,
          category,
          keyword,
        }),
      getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.currentPage + 1 : undefined),
    });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  const handleLike = async (id: number) => {
    const previous = queryClient.getQueryData(queryKey);
    FeedService.like(queryClient, queryKey, id);
    try {
      await FeedRepository.toggleLike({ feedId: id });
    } catch (error) {
      logError(error);
      FeedService.rollback(queryClient, queryKey, previous);
      refetch();
    }
  };

  const handleBookmark = async (id: number) => {
    const previous = queryClient.getQueryData(queryKey);
    FeedService.bookmark(queryClient, queryKey, id);
    try {
      await FeedRepository.toggleBookmark({ feedId: id });
    } catch (error) {
      logError(error);
      FeedService.rollback(queryClient, queryKey, previous);
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
}
