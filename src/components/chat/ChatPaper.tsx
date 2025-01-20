import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Tab } from '../common';

export interface Category {
  id: string | number;
  label: string;
}

interface ChatPagerProps {
  categories: Category[];
  onPageChange?: (page: number) => void;
  children: React.ReactNode;
}

export default function ChatPaper({ categories, onPageChange, children }: ChatPagerProps) {
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
          <Tab
            key={category.id}
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
