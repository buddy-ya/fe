import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import Layout from "@/components/common/Layout";
import CategoryPager from "@/components/home/CategoryPager";
import InnerLayout from "@/components/common/InnerLayout";
import { Bell, Search } from "lucide-react-native";
import LogoIcon from "@assets/icons/logo.svg";

export default function HomeScreen() {
  const handleSearch = () => {};

  const handleNotification = () => {};

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
        <CategoryPager />
      </InnerLayout>
    </Layout>
  );
}
