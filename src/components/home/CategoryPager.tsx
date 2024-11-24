// components/home/CategoryPager.tsx
import React, { useState, useRef } from "react";
import { View, ScrollView, Text } from "react-native";
import PagerView from "react-native-pager-view";
import { Chip } from "@/components/common/Chip";
import { useTranslation } from "react-i18next";
import MyText from "../common/MyText";

interface Category {
  id: string;
  label: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: "popular", label: "category.popular", icon: "🔥" },
  { id: "free", label: "category.free", icon: "💭" },
  { id: "info", label: "category.info", icon: "📢" },
];

export default function CategoryPager() {
  const { t } = useTranslation("feed");
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePageSelected = (page: number) => {
    setActiveIndex(page);
    // Chip이 스크롤 뷰 안에서 보이도록 스크롤 조정
    scrollViewRef.current?.scrollTo({
      x: page * 100, // 대략적인 Chip의 너비
      animated: true,
    });
  };

  const handleChipPress = (index: number) => {
    pagerRef.current?.setPage(index);
    setActiveIndex(index);
  };

  return (
    <View className="h-full">
      {/* Chips ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5"
      >
        {CATEGORIES.map((category, index) => (
          <Chip
            key={category.id}
            label={t(category.label)}
            selected={activeIndex === index}
            onPress={() => handleChipPress(index)}
            className="mr-2"
          />
        ))}
      </ScrollView>

      {/* Content PagerView */}

      <PagerView
        ref={pagerRef}
        initialPage={0}
        onPageSelected={(e) => handlePageSelected(e.nativeEvent.position)}
        style={{ flex: 1 }}
      >
        {CATEGORIES.map((category) => (
          <View key={category.id} className="bg-white p-4">
            <MyText size="text-lg">{category.id} 페이지</MyText>
          </View>
        ))}
      </PagerView>
    </View>
  );
}
