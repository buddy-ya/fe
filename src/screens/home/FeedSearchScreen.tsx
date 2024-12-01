import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react-native";
import { searchFeeds, toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import Layout from "@/components/common/Layout";
import FeedList from "@/components/feed/FeedList";
import InnerLayout from "@/components/common/InnerLayout";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { logError } from "@/utils/service/error";
import MyText from "@/components/common/MyText";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { feedKeys } from "@/api/queryKeys";
import { updateFeedList } from "@/utils/service/optimisticUpdate";

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

// @ts-ignore
export default function FeedSearchScreen({ navigation }) {
  const { t } = useTranslation("feed");
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: feedKeys.search(submittedText),
    queryFn: async ({ pageParam = 0 }) => {
      return await searchFeeds({
        category: "free",
        keyword: submittedText,
        page: pageParam,
        size: 5,
      });
    },
    staleTime: 1000 * 60 * 3,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    enabled: !!submittedText,
  });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  const handleSubmit = () => {
    if (searchText.trim()) {
      setSubmittedText(searchText.trim());
    }
  };

  const handleClear = () => {
    setSearchText("");
    setSubmittedText("");
  };

  const handleLike = async (id: number) => {
    try {
      updateFeedList.like(queryClient, feedKeys.search(submittedText), id);
      await toggleLike(id);
    } catch (error) {
      logError(error);
      refetch();
    }
  };

  const handleBookmark = async (id: number) => {
    try {
      updateFeedList.bookmark(queryClient, feedKeys.search(submittedText), id);
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
              hasMore={hasNextPage}
              onLoadMore={handleLoadMore}
              emptyStateMessage={
                submittedText
                  ? t("search.empty.result")
                  : t("search.empty.default")
              }
              refreshControl={{
                refreshing: isLoading && feeds.length > 0,
                onRefresh: refetch,
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
