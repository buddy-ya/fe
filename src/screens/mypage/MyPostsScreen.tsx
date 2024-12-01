import React, { useState, useEffect } from "react";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import FeedList from "@/components/feed/FeedList";
import { getMyPosts, toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { logError } from "@/utils/service/error";
import { useTranslation } from "react-i18next";
import { ChevronLeft, NotebookPen } from "lucide-react-native";
import MyText from "@/components/common/MyText";
import { View } from "react-native";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { feedKeys } from "@/api/queryKeys";
import { updateFeedList } from "@/utils/service/optimisticUpdate";

export default function MyPostsScreen({ navigation }) {
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
    queryKey: feedKeys.myPosts(),
    queryFn: async ({ pageParam = 0 }) => {
      return await getMyPosts({
        page: pageParam,
        size: 5,
      });
    },
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
  });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  const handleLike = async (id: number) => {
    try {
      updateFeedList.like(queryClient, feedKeys.myPosts(), id);
      await toggleLike(id);
    } catch (error) {
      logError(error);
      refetch();
    }
  };

  const handleBookmark = async (id: number) => {
    try {
      updateFeedList.bookmark(queryClient, feedKeys.myPosts(), id);
      await toggleBookmark(id);
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

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <MyText className="mr-[6px]">
            <NotebookPen size={19} strokeWidth={2} color={"#282828"} />
          </MyText>
          <MyText size="text-lg" className="font-bold">
            {t("myPosts")}
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
          emptyStateMessage={t("myPostsEmpty")}
          refreshControl={{
            refreshing: isLoading && feeds.length > 0,
            onRefresh: refetch,
            tintColor: "#4AA366",
          }}
        />
      </InnerLayout>
    </Layout>
  );
}
