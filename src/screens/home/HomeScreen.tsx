import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { feedKeys, FeedRepository } from '@/api';
import { Button, CategoryPager, FeedList, InnerLayout, Layout } from '@/components';
import { useBackButton, useFeedList } from '@/hooks';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pencil, Search } from 'lucide-react-native';
import { useTabStore } from '@/store/useTabStore';
import { isAndroid, CATEGORIES } from '@/utils';
import { FeedHeaderTab } from '@/components/feed/FeedHeaderTab';

type FeedHomeScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedHome'>;

export function HomeScreen({ navigation }: FeedHomeScreenProps) {
  const STALE_TIME = 1000 * 60;
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const isCertificated = useUserStore((state) => state.isCertificated);

  const { selectedTab, setSelectedTab } = useTabStore();
  const userUniversity = useUserStore((state) => state.university);

  const tab = selectedTab === 'myUni' ? userUniversity : 'all';

  const feedListData = useFeedList({
    queryKey: feedKeys.lists(tab, activeCategory),
    fetchFn: async (params) => {
      return FeedRepository.getAll({
        ...params,
        university: tab,
        category: activeCategory,
      });
    },
    staleTime: STALE_TIME,
  });

  const handlePageChange = (index: number) => {
    setActiveCategory(CATEGORIES[index].id);
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate('FeedDetail', { feedId });
  };

  const handleWriteButton = async () => {
    isCertificated ? navigation.navigate('FeedWrite') : handleModalOpen('studentCertification');
  };

  const insets = useSafeAreaInsets();
  const writeButtonPosition = isAndroid ? insets.bottom + 80 : insets.bottom + 50;

  useBackButton();

  return (
    <Layout
      hasTabBar
      showHeader
      headerLeft={
        <FeedHeaderTab selectedTab={selectedTab} onSelectTab={(tab) => setSelectedTab(tab)} />
      }
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.navigate('FeedSearch')} className="mr-1">
            <Search strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
        </View>
      }
    >
      <InnerLayout>
        <View className="flex-1" pointerEvents="box-none">
          <CategoryPager categories={CATEGORIES} onPageChange={handlePageChange}>
            {CATEGORIES.map((category) => (
              <View key={category.id} className="flex-1">
                {category.id === activeCategory && (
                  <FeedList
                    feeds={feedListData.feeds}
                    onLike={feedListData.handleLike}
                    onBookmark={feedListData.handleBookmark}
                    onPress={handlePressFeed}
                    isLoading={feedListData.isLoading}
                    hasMore={feedListData.hasMore}
                    onLoadMore={feedListData.handleLoadMore}
                    refreshControl={{
                      refreshing: feedListData.isLoading && feedListData.feeds.length > 0,
                      onRefresh: feedListData.handleRefresh,
                      tintColor: '#4AA366',
                    }}
                  />
                )}
              </View>
            ))}
          </CategoryPager>
          <Button
            type="circle"
            onPress={handleWriteButton}
            className="absolute right-0"
            containerStyle={{ bottom: writeButtonPosition }}
            icon={Pencil}
            iconSize={20}
          />
        </View>
      </InnerLayout>
    </Layout>
  );
}
