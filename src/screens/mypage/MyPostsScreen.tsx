import React, { useState, useEffect } from "react";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import FeedList from "@/components/feed/FeedList";
import { getMyPosts, toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { logError } from "@/utils/service/error";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react-native";
import MyText from "@/components/common/MyText";

export default function MyPostsScreen({ navigation }) {
  const { t } = useTranslation("mypage");
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const fetchMyPosts = async (
    pageNum: number,
    shouldRefresh: boolean = false
  ) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await getMyPosts({
        page: pageNum,
        size: 5,
      });

      setFeeds((prev) =>
        shouldRefresh ? response.feeds : [...prev, ...response.feeds]
      );
      setHasNext(response.hasNext);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(0);
    await fetchMyPosts(0, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasNext) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMyPosts(nextPage);
    }
  };

  const handleLike = async (id: number) => {
    try {
      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) =>
          feed.id === id
            ? {
                ...feed,
                isLiked: !feed.isLiked,
                likeCount: feed.isLiked
                  ? feed.likeCount - 1
                  : feed.likeCount + 1,
              }
            : feed
        )
      );

      const response = await toggleLike(id);

      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) =>
          feed.id === id ? { ...feed, likeCount: response.likeCount } : feed
        )
      );
    } catch (error) {
      logError(error);
      fetchMyPosts(page, true);
    }
  };

  const handleBookmark = async (id: number) => {
    try {
      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) =>
          feed.id === id ? { ...feed, isBookmarked: !feed.isBookmarked } : feed
        )
      );

      await toggleBookmark(id);
    } catch (error) {
      logError(error);
      fetchMyPosts(page, true);
    }
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  useEffect(() => {
    fetchMyPosts(0, true);
  }, []);

  return (
    <Layout
      showHeader
      headerLeft={
        <ChevronLeft
          color="#000000"
          size={24}
          onPress={() => navigation.goBack()}
        />
      }
      headerCenter={
        <MyText size="text-lg" className="font-bold">
          {t("myPosts")}
        </MyText>
      }
    >
      <InnerLayout>
        <FeedList
          feeds={feeds}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onPress={handlePressFeed}
          isLoading={isLoading}
          hasMore={hasNext}
          onLoadMore={handleLoadMore}
          emptyStateMessage={t("myPostsEmpty")}
          refreshControl={{
            refreshing: isRefreshing,
            onRefresh: handleRefresh,
            tintColor: "#4AA366",
          }}
        />
      </InnerLayout>
    </Layout>
  );
}
