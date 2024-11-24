// screens/home/HomeScreen.tsx
import React from "react";
import { View } from "react-native";
import Layout from "@/components/common/Layout";
import CategoryPager from "@/components/home/CategoryPager";
import InnerLayout from "@/components/common/InnerLayout";

export default function HomeScreen() {
  return (
    <Layout>
      <InnerLayout>
        <View className="border-2">
          <CategoryPager />
        </View>
      </InnerLayout>
    </Layout>
  );
}
