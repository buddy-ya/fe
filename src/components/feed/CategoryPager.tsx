import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Chip } from '@/components/common/Chip';

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

export default function CategoryPager({ categories, onPageChange, children }: CategoryPagerProps) {
  const { t } = useTranslation('feed');
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
    <View className="mt-2 flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-none py-2 pb-1"
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
