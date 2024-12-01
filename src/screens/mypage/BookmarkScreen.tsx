import React from "react";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import FeedList from "@/components/feed/FeedList";
import {
  getBookmarkedFeeds,
  toggleBookmark,
  toggleLike,
} from "@/api/feed/getFeeds";
import { logError } from "@/utils/service/error";
import { useTranslation } from "react-i18next";
import { Bookmark } from "lucide-react-native";
import MyText from "@/components/common/MyText";
import { View } from "react-native";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { feedKeys } from "@/api/queryKeys";

export default function BookmarkScreen({ navigation }) {
  const { t } = useTranslation("mypage");
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: feedKeys.bookmarks(),
    queryFn: async ({ pageParam = 0 }) => {
      return await getBookmarkedFeeds({
        page: pageParam,
        size: 5,
      });
    },
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
  });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  const handleRefresh = () => {
    return refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleLike = async (id: number) => {
    try {
      queryClient.setQueryData(feedKeys.bookmarks(), (old: any) => {
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

      const response = await toggleLike(id);

      // Update with real data
      queryClient.setQueryData(feedKeys.bookmarks(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            feeds: page.feeds.map((feed: any) =>
              feed.id === id ? { ...feed, likeCount: response.likeCount } : feed
            ),
          })),
        };
      });
    } catch (error) {
      logError(error);
      refetch();
    }
  };

  const handleBookmark = async (id: number) => {
    try {
      queryClient.setQueryData(feedKeys.bookmarks(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            feeds: page.feeds.filter((feed: any) => feed.id !== id),
          })),
        };
      });
      await toggleBookmark(id);
    } catch (error) {
      logError(error);
      refetch();
    }
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <MyText className="mr-1">
            <Bookmark size={19} strokeWidth={2} color={"#282828"} />
          </MyText>
          <MyText size="text-lg" className="font-bold">
            {t("bookmark")}
          </MyText>
        </View>
      }
    >
      <InnerLayout>
        <FeedList
          feeds={feeds}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onPress={handlePressFeed}
          isLoading={isLoading}
          hasMore={hasNextPage}
          onLoadMore={handleLoadMore}
          emptyStateMessage={t("bookmarkEmpty")}
          refreshControl={{
            refreshing: isLoading && feeds.length > 0,
            onRefresh: handleRefresh,
            tintColor: "#4AA366",
          }}
        />
      </InnerLayout>
    </Layout>
  );
}
