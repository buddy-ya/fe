import React, { useState, useEffect } from "react";
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
import { Bookmark, ChevronLeft } from "lucide-react-native";
import MyText from "@/components/common/MyText";
import { View } from "react-native";

export default function BookmarkScreen({ navigation }) {
  const { t } = useTranslation("mypage");
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const fetchBookmarks = async (
    pageNum: number,
    shouldRefresh: boolean = false
  ) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await getBookmarkedFeeds({
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
    await fetchBookmarks(0, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasNext) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBookmarks(nextPage);
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
      fetchBookmarks(page, true);
    }
  };

  const handleBookmark = async (id: number) => {
    try {
      setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== id));
      await toggleBookmark(id);
    } catch (error) {
      logError(error);
      fetchBookmarks(page, true);
    }
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  useEffect(() => {
    fetchBookmarks(0, true);
  }, []);

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
          hasMore={hasNext}
          onLoadMore={handleLoadMore}
          emptyStateMessage={t("bookmarkEmpty")}
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
