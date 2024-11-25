import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Layout from "@/components/common/Layout";
import CategoryPager from "@/components/feed/CategoryPager";
import { Bell, Search } from "lucide-react-native";
import LogoIcon from "@assets/icons/logo.svg";
import FeedList from "@/components/feed/FeedList";
import { mockFeeds } from "./mock/feedData";
import InnerLayout from "@/components/common/InnerLayout";
import Button from "@/components/common/Button";
import { getFeeds } from "@/api/feed/getFeeds";
import { getAccessToken, removeTokens } from "@/utils/service/auth";

const CATEGORIES = [
  { id: "popular", label: "category.popular", icon: "🔥" },
  { id: "free", label: "category.free", icon: "💭" },
  { id: "info", label: "category.info", icon: "📢" },
];

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const handleSearch = () => {
    console.log("Search pressed");
  };

  const handleNotification = () => {
    console.log("Notification pressed");
  };

  const handleLike = (id: number) => {
    console.log("Like:", id);
  };

  const handleBookmark = (id: number) => {
    console.log("Bookmark:", id);
  };

  const handleComment = (id: number) => {
    console.log("Comment:", id);
  };

  const handleLoadMore = () => {
    console.log("Load more feeds");
  };

  const handleWriteButton = () => {
    navigation.navigate("FeedWrite");
    console.log(getFeeds());
  };

  const handlePageChange = (index: number) => {
    setActiveCategory(CATEGORIES[index].id);
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
                  feeds={mockFeeds.feeds}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onComment={handleComment}
                  onPress={handlePressFeed}
                />
              )}
            </View>
          ))}
        </CategoryPager>
        <Button
          type="circle"
          onPress={handleWriteButton}
          className="absolute bottom-5 right-0"
        />
      </InnerLayout>
    </Layout>
  );
}
