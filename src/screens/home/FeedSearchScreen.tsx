import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronLeft, X } from "lucide-react-native";
import { searchFeeds, toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { useFeedActions } from "@/hooks/useFeedActions";
import Layout from "@/components/common/Layout";
import FeedList from "@/components/feed/FeedList";
import InnerLayout from "@/components/common/InnerLayout";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { logError } from "@/utils/service/error";
import MyText from "@/components/common/MyText";

const SearchInput = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFocusChange,
}) => {
  const { t } = useTranslation("feed");

  return (
    <View className="flex-1 flex-row items-center bg-[#E8E9EB] rounded-[12px]">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={t("search.placeholder")}
        placeholderTextColor="#797979"
        returnKeyType="search"
        className="flex-1 px-4 text-[15px]"
        autoFocus
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} className="px-3">
          <X size={18} color="#797979" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function FeedSearchScreen({ navigation }) {
  const { t } = useTranslation("feed");
  const [searchText, setSearchText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const fetchSearchResults = async (
    keyword: string,
    pageNum: number,
    shouldRefresh: boolean = false
  ) => {
    if (!keyword || isLoading) return;

    try {
      setIsLoading(true);
      const response = await searchFeeds({
        category: "free",
        keyword,
        page: pageNum,
        size: 10,
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
    if (!submittedText) return;
    setIsRefreshing(true);
    setPage(0);
    await fetchSearchResults(submittedText, 0, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasNext) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchResults(submittedText, nextPage);
    }
  };

  const handleSubmit = () => {
    if (searchText.trim()) {
      setSubmittedText(searchText.trim());
      setPage(0);
      fetchSearchResults(searchText.trim(), 0, true);
    }
  };

  const handleClear = () => {
    setSearchText("");
    setSubmittedText("");
    setFeeds([]);
    setPage(0);
    setHasNext(true);
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
      fetchSearchResults(submittedText, page, true);
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
      fetchSearchResults(submittedText, page, true);
    }
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  return (
    <Layout
      showHeader
      isSearchLayout
      isBackgroundWhite={false}
      onBack={() => navigation.goBack()}
      headerCenter={
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSubmit}
          onClear={handleClear}
          onFocusChange={setIsFocused}
        />
      }
    >
      <InnerLayout>
        <KeyboardLayout>
          {isFocused || submittedText ? (
            <FeedList
              feeds={feeds}
              className="mt-3"
              onLike={handleLike}
              onBookmark={handleBookmark}
              onPress={handlePressFeed}
              isLoading={isLoading}
              hasMore={hasNext}
              onLoadMore={handleLoadMore}
              emptyStateMessage={
                submittedText
                  ? t("search.empty.result")
                  : t("search.empty.default")
              }
              refreshControl={{
                refreshing: isRefreshing,
                onRefresh: handleRefresh,
                tintColor: "#4AA366",
              }}
            />
          ) : (
            <View className="flex-1 justify-center items-center bg-mainBackground">
              <MyText color="text-textDescription">
                {t("search.empty.default")}
              </MyText>
            </View>
          )}
        </KeyboardLayout>
      </InnerLayout>
    </Layout>
  );
}
