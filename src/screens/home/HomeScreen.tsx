import React, { useState, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import Layout from "@/components/common/Layout";
import CategoryPager from "@/components/feed/CategoryPager";
import { Bell, Plus, Search } from "lucide-react-native";
import LogoIcon from "@assets/icons/logo.svg";
import FeedList from "@/components/feed/FeedList";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import { getFeeds } from "@/api/feed/getFeeds";
import { CATEGORIES } from "@/utils/constants/categories";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useTranslation } from "react-i18next";
import { feedKeys } from "@/api/queryKeys";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { getCertificationModalTexts } from "@/utils/constants/ModalTexts";
import { useFeedList } from "@/hooks/useFeedList";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation("feed");
  const { t: certT } = useTranslation("certification");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const {
    isModalVisible,
    setIsModalVisible,
    currentModalTexts,
    setCurrentModalTexts,
    checkAuth,
  } = useAuthCheck();

  const feedListData = useFeedList({
    queryKey: feedKeys.lists(activeCategory),
    fetchFn: (params) =>
      getFeeds({
        ...params,
        category: activeCategory,
      }),
    staleTime: 1000 * 60,
  });

  const handlePageChange = (index: number) => {
    setActiveCategory(CATEGORIES[index].id);
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

  return (
    <Layout
      hasTabBar={true}
      showHeader
      headerLeft={<LogoIcon />}
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("FeedSearch")}
            className="mr-4"
          >
            <Search strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
          <TouchableOpacity>
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
                    feeds={feedListData.feeds}
                    onLike={feedListData.handleLike}
                    onBookmark={feedListData.handleBookmark}
                    onPress={handlePressFeed}
                    isLoading={feedListData.isLoading}
                    hasMore={feedListData.hasMore}
                    onLoadMore={feedListData.handleLoadMore}
                    className="pt-0"
                    refreshControl={{
                      refreshing:
                        feedListData.isLoading && feedListData.feeds.length > 0,
                      onRefresh: feedListData.handleRefresh,
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
