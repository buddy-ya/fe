import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Chip } from '@/components/common/Chip';

export interface Category {
  id: string | number;
  label: string;
  icon?: string;
}

interface CategoryPagerProps {
  categories: Category[];
  currentTab: string;
  onPageChange?: (page: number) => void;
  children: React.ReactNode;
}

export default function CategoryPager({
  categories,
  currentTab,
  onPageChange,
  children,
}: CategoryPagerProps) {
  const { t } = useTranslation('feed');
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (!isMounted) return;
      setActiveIndex(0);
      pagerRef.current?.setPage(0);
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }, 0);
    return () => {
      isMounted = false;
    };
  }, [currentTab]);

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
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-none pb-2"
      >
        {categories.map((category, index) => (
          <Chip
            key={category.id}
            icon={category.icon}
            label={t(`category.${category.label}`)}
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
