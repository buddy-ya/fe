import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/common/Layout";
import CategoryPager from "@/components/feed/CategoryPager";
import { Bell, Plus, Search } from "lucide-react-native";
import LogoIcon from "@assets/icons/logo.svg";
import FeedList from "@/components/feed/FeedList";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import { getFeeds, toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { CATEGORIES } from "@/utils/constants/categories";
import { logError } from "@/utils/service/error";

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["feeds", activeCategory, page],
    queryFn: () =>
      getFeeds({
        category: activeCategory,
        page: page,
        size: 10,
      }),
  });

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onMutate: async (feedId) => {
      queryClient.setQueryData(
        ["feeds", activeCategory, page],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            feeds: oldData.feeds.map((feed) =>
              feed.id === feedId
                ? {
                    ...feed,
                    isLiked: !feed.isLiked,
                    likeCount: feed.isLiked
                      ? feed.likeCount - 1
                      : feed.likeCount + 1,
                  }
                : feed
            ),
          };
        }
      );
    },
    onSuccess: (data, feedId) => {
      queryClient.setQueryData(
        ["feeds", activeCategory, page],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            feeds: oldData.feeds.map((feed) =>
              feed.id === feedId ? { ...feed, likeCount: data.likeCount } : feed
            ),
          };
        }
      );
    },
    onError: (error) => {
      logError(error);
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmark,
    onMutate: async (feedId) => {
      queryClient.setQueryData(
        ["feeds", activeCategory, page],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            feeds: oldData.feeds.map((feed) =>
              feed.id === feedId
                ? { ...feed, isBookmarked: !feed.isBookmarked }
                : feed
            ),
          };
        }
      );
    },
    onError: (error) => {
      logError(error);
    },
  });

  const handleLoadMore = () => {
    if (data?.hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (index: number) => {
    setPage(0);
    setActiveCategory(CATEGORIES[index].id);
  };

  const handleSearch = () => {
    console.log("Search pressed");
  };

  const handleNotification = () => {
    console.log("Notification pressed");
  };

  const handleLike = (id: number) => {
    likeMutation.mutate(id);
  };

  const handleBookmark = (id: number) => {
    bookmarkMutation.mutate(id);
  };

  const handleWriteButton = () => {
    navigation.navigate("FeedWrite");
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  return (
    <Layout
      showHeader
      headerLeft={<LogoIcon width={27} height={30} />}
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleSearch} className="mr-4">
            <Search strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNotification}>
            <Bell strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
        </View>
      }
    >
      <InnerLayout>
        <CategoryPager categories={CATEGORIES} onPageChange={handlePageChange}>
          {CATEGORIES.map((category) => (
            <View key={category.id} className="flex-1">
              {category.id === activeCategory && (
                <FeedList
                  feeds={data?.feeds || []}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onPress={handlePressFeed}
                  isLoading={isLoading}
                  onLoadMore={handleLoadMore}
                  hasMore={data?.hasNext}
                />
              )}
            </View>
          ))}
        </CategoryPager>
        <Button
          type="circle"
          onPress={handleWriteButton}
          className="absolute bottom-5 right-0"
          icon={Plus}
        />
      </InnerLayout>
    </Layout>
  );
}
