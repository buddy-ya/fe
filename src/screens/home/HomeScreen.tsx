import React, { useState, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
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
import { getIsCertificated } from "@/api/certification/certification";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useTranslation } from "react-i18next";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation("certification");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [page, setPage] = useState(0);
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModalTexts, setCurrentModalTexts] = useState(null);

  const fetchFeeds = async (
    pageNum: number,
    shouldRefresh: boolean = false
  ) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await getFeeds({
        category: activeCategory,
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

  // 카테고리 변경 시
  const handlePageChange = (index: number) => {
    setFeeds([]);
    setPage(0);
    setActiveCategory(CATEGORIES[index].id);
  };

  // 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(0);
    await fetchFeeds(0, true);
  };

  // 추가 데이터 로드
  const handleLoadMore = () => {
    if (!isLoading && hasNext) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeeds(nextPage);
    }
  };

  // 좋아요 처리
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
      fetchFeeds(page, true);
    }
  };

  // 북마크 처리
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
      fetchFeeds(page, true);
    }
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  const handleWriteButton = async () => {
    try {
      const { isCertificated, isKorean, isStudentIdCardRequested } =
        await getIsCertificated();

      if (isCertificated) {
        navigation.navigate("FeedWrite");
        return;
      }

      const modalTexts = getModalTexts(isKorean, isStudentIdCardRequested);
      setCurrentModalTexts(modalTexts);
      setIsModalVisible(true);
    } catch (error) {
      logError(error);
    }
  };

  const getModalTexts = (
    isKorean: boolean,
    isStudentIdCardRequested: boolean
  ) => {
    if (isStudentIdCardRequested) {
      return {
        title: t("banner.pending.title"),
        description: t("banner.pending.description"),
        confirmText: t("banner.pending.confirm"),
        cancelText: t("banner.pending.cancel"),
        onConfirm: () => navigation.navigate("StudentIdComplete"),
      };
    }

    return {
      title: t("banner.default.title"),
      description: t("banner.default.description"),
      confirmText: t("banner.default.confirm"),
      cancelText: t("banner.default.cancel"),
      onConfirm: () =>
        navigation.navigate(
          isKorean ? "EmailVerification" : "StudentIdVerification"
        ),
    };
  };

  const handleSearch = () => {
    console.log("Search pressed");
  };

  const handleNotification = () => {
    console.log("Notification pressed");
  };

  React.useEffect(() => {
    fetchFeeds(0, true);
  }, [activeCategory]);

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
                  feeds={feeds}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onPress={handlePressFeed}
                  isLoading={isLoading}
                  onLoadMore={handleLoadMore}
                  hasMore={hasNext}
                  refreshControl={{
                    refreshing: isRefreshing,
                    onRefresh: handleRefresh,
                    tintColor: "#4AA366",
                  }}
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
      <ConfirmModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={currentModalTexts?.onConfirm}
        title={currentModalTexts?.title}
        description={currentModalTexts?.description}
        cancelText={currentModalTexts?.cancelText}
        confirmText={currentModalTexts?.confirmText}
      />
    </Layout>
  );
}
