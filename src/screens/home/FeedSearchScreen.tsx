import React, { useState, useCallback } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft, X } from "lucide-react-native";
import { searchFeeds, toggleBookmark, toggleLike } from "@/api/feed/getFeeds";
import { useFeedActions } from "@/hooks/useFeedActions";
import Layout from "@/components/common/Layout";
import FeedList from "@/components/feed/FeedList";
import InnerLayout from "@/components/common/InnerLayout";
import MyText from "@/components/common/MyText";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { logError } from "@/utils/service/error";

const SearchInput = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFocusChange,
}) => {
  const { t } = useTranslation("feed");

  return (
    <View className="flex-1 flex-row items-center bg-[#E8E9EB] rounded-lg">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={t("search.placeholder")}
        placeholderTextColor="#8E8E93"
        returnKeyType="search"
        className="flex-1 px-4"
        autoFocus
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} className="px-3">
          <X size={20} color="#8E8E93" />
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchSearchResults = async (keyword: string) => {
    if (!keyword) return;

    try {
      setIsLoading(true);
      const response = await searchFeeds({
        category: "free",
        keyword,
        page: 0,
        size: 5,
      });
      setFeeds(response.feeds);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (searchText.trim()) {
      setSubmittedText(searchText.trim());
      fetchSearchResults(searchText.trim());
    }
  };

  const handleClear = () => {
    setSearchText("");
    setSubmittedText("");
    setFeeds([]);
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
      fetchSearchResults(submittedText);
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
      fetchSearchResults(submittedText);
    }
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate("FeedDetail", { feedId });
  };

  return (
    <Layout
      showHeader
      isSearchLayout
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
          <View className="flex-1">
            {isFocused || submittedText ? (
              <FeedList
                feeds={feeds}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onPress={handlePressFeed}
                isLoading={isLoading}
                hasMore={false}
                onLoadMore={() => {}}
                emptyStateMessage={
                  submittedText
                    ? t("search.empty.result")
                    : t("search.empty.default")
                }
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <MyText color="text-textDescription">
                  {t("search.empty.default")}
                </MyText>
              </View>
            )}
          </View>
        </KeyboardLayout>
      </InnerLayout>
    </Layout>
  );
}
