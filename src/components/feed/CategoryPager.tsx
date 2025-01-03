import React, { useState, useRef } from "react";
import { View, ScrollView } from "react-native";
import PagerView from "react-native-pager-view";
import { Chip } from "@/components/common/Chip";
import { useTranslation } from "react-i18next";

export interface Category {
  id: string;
  label: string;
  icon: string;
}

interface CategoryPagerProps {
  categories: Category[];
  onPageChange?: (page: number) => void;
  children: React.ReactNode;
}

export default function CategoryPager({
  categories,
  onPageChange,
  children,
}: CategoryPagerProps) {
  const { t } = useTranslation("feed");
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePageSelected = (page: number) => {
    setActiveIndex(page);
    scrollViewRef.current?.scrollTo({
      x: page * 100,
      animated: true,
    });
    onPageChange?.(page);
  };

  const handleChipPress = (index: number) => {
    pagerRef.current?.setPage(index);
    setActiveIndex(index);
  };

  return (
    <View className="flex-1 mt-2">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-2 pb-1 flex-none"
      >
        {categories.map((category, index) => (
          <Chip
            key={category.id}
            icon={category.icon}
            label={t(category.label)}
            selected={activeIndex === index}
            onPress={() => handleChipPress(index)}
            className="mr-2 bg-white"
          />
        ))}
      </ScrollView>

      <PagerView
        ref={pagerRef}
        initialPage={0}
        onPageSelected={(e) => handlePageSelected(e.nativeEvent.position)}
        style={{ flex: 1 }}
      >
        {children}
      </PagerView>
    </View>
  );
}
