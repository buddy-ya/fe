import React, { useState, useCallback, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Layout from "@/components/common/Layout";
import CategoryPager from "@/components/feed/CategoryPager";
import { Bell, Plus, Search } from "lucide-react-native";
import LogoIcon from "@assets/icons/logo.svg";
import FeedList from "@/components/feed/FeedList";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import { getFeeds, toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { CATEGORIES } from "@/utils/constants/categories";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useTranslation } from "react-i18next";
import { feedKeys } from "@/api/queryKeys";
import { FeedListResponse } from "./types";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { getCertificationModalTexts } from "@/utils/constants/ModalTexts";
import { updateFeedList } from "@/utils/service/optimisticUpdate";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation("feed");
  const { t: certT } = useTranslation("certification");
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const {
    isModalVisible,
    setIsModalVisible,
    currentModalTexts,
    setCurrentModalTexts,
    checkAuth,
  } = useAuthCheck();

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
    queryKey: feedKeys.lists(activeCategory),
    queryFn: async ({ pageParam }) => {
      return await getFeeds({
        category: activeCategory,
        page: pageParam,
        size: 5,
      });
    },
    staleTime: 1000 * 60,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
  });

  const feeds = useMemo(
    () => data?.pages.flatMap((page) => page.feeds) ?? [],
    [data]
  );

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onMutate: async (feedId) => {
      await queryClient.cancelQueries({
        queryKey: feedKeys.lists(activeCategory),
      });

      const previousData = queryClient.getQueryData(
        feedKeys.lists(activeCategory)
      );

      updateFeedList.like(queryClient, feedKeys.lists(activeCategory), feedId);
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        feedKeys.lists(activeCategory),
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: feedKeys.lists(activeCategory),
      });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmark,
    onMutate: async (feedId) => {
      await queryClient.cancelQueries({
        queryKey: feedKeys.lists(activeCategory),
      });
      const previousData = queryClient.getQueryData(
        feedKeys.lists(activeCategory)
      );
      updateFeedList.bookmark(
        queryClient,
        feedKeys.lists(activeCategory),
        feedId
      );
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        feedKeys.lists(activeCategory),
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: feedKeys.lists(activeCategory),
      });
    },
  });

  const handlePageChange = (index: number) => {
    setActiveCategory(CATEGORIES[index].id);
  };

  const handleRefresh = () => {
    return refetch();
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLike = async (id: number) => {
    await likeMutation.mutateAsync(id);
  };

  const handleBookmark = async (id: number) => {
    await bookmarkMutation.mutateAsync(id);
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  const handleWriteButton = async () => {
    const { isCertificated, isKorean, isStudentIdCardRequested } =
      await checkAuth();

    if (isCertificated) {
      navigation.navigate("FeedWrite");
      return;
    }

    const modalTexts = getCertificationModalTexts(
      isKorean,
      isStudentIdCardRequested,
      certT,
      navigation
    );
    setCurrentModalTexts(modalTexts);
    setIsModalVisible(true);
  };

  const handleSearch = () => {
    navigation.navigate("FeedSearch");
  };

  const handleNotification = () => {
    console.log("Notification pressed");
  };

  return (
    <Layout
      hasTabBar={true}
      showHeader
      headerLeft={<LogoIcon />}
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
        <View className="flex-1">
          <CategoryPager
            categories={CATEGORIES}
            onPageChange={handlePageChange}
          >
            {CATEGORIES.map((category) => (
              <View key={category.id} className="flex-1">
                {category.id === activeCategory && (
                  <FeedList
                    feeds={feeds}
                    className="pt-0"
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onPress={handlePressFeed}
                    isLoading={isLoading}
                    onLoadMore={handleLoadMore}
                    hasMore={!!hasNextPage}
                    refreshControl={{
                      refreshing: isLoading && feeds.length > 0,
                      onRefresh: handleRefresh,
                      tintColor: "#4AA366",
                    }}
                  />
                )}
              </View>
            ))}
          </CategoryPager>
        </View>
        <Button
          type="circle"
          onPress={handleWriteButton}
          className="absolute bottom-20 right-0"
          icon={Plus}
        />
      </InnerLayout>
      <ConfirmModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          currentModalTexts?.onConfirm();
        }}
        title={currentModalTexts?.title || ""}
        description={currentModalTexts?.description || ""}
        cancelText={currentModalTexts?.cancelText}
        confirmText={currentModalTexts?.confirmText}
        position="bottom"
        size="default"
      />
    </Layout>
  );
}
