import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { feedKeys, FeedRepository } from '@/api';
import { Button, CategoryPager, FeedList, InnerLayout, Layout } from '@/components';
import { useFeedList, useBackButton } from '@/hooks';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import LogoIcon from '@assets/icons/logo.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, Plus, Search } from 'lucide-react-native';
import { isAndroid, CATEGORIES } from '@/utils';
import Skeleton from '../Skeleton';

type FeedHomeScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedHome'>;

export function HomeScreen({ navigation, route }: FeedHomeScreenProps) {
  const STALE_TIME = 1000 * 60;
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const isCertificated = useUserStore((state) => state.isCertificated);

  const feedListData = useFeedList({
    queryKey: feedKeys.lists(activeCategory),
    fetchFn: (params) =>
      FeedRepository.getAll({
        ...params,
        category: activeCategory,
      }),
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
  const writeButtonPosition = isAndroid ? insets.bottom + 80 : insets.bottom + 40;

  return (
    <Layout
      hasTabBar={true}
      showHeader
      headerLeft={<LogoIcon />}
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.navigate('FeedSearch')} className="mr-4">
            <Search strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Bell strokeWidth={2} size={24} color="#797977" />
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
            className={`absolute right-0`}
            containerStyle={{
              bottom: writeButtonPosition,
            }}
            icon={Plus}
          />
        </View>
      </InnerLayout>
    </Layout>
  );
}

export const SuspendedHomeScreen = (props: FeedHomeScreenProps) => {
  const SkeletonChip = () => {
    return <View className="mr-4 h-10 w-20 animate-pulse rounded-full bg-[#e0e0e0]"></View>;
  };
  return (
    <ErrorBoundary fallback={<></>}>
      <Suspense
        fallback={
          <Layout showHeader disableBottomSafeArea onBack={() => props.navigation.goBack()}>
            <InnerLayout>
              <View className="w-full flex-row">
                {[...Array(3)].map((_, index) => (
                  <SkeletonChip key={index} />
                ))}
              </View>
              <Skeleton />
            </InnerLayout>
          </Layout>
        }
      >
        <HomeScreen {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
