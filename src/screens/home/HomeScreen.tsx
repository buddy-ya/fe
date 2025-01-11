import LogoIcon from '@assets/icons/logo.svg';
import { Bell, Plus, Search } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { feedKeys, FeedRepository } from '@/api';
import { useAuthCheck, useFeedList, getModalTexts } from '@/hooks';
import { CATEGORIES } from '@/utils/constants/categories';
import { Button, CategoryPager, ConfirmModal, FeedList, InnerLayout, Layout } from '@/components';
import { isAndroid } from '@/utils';

export default function HomeScreen({ navigation }) {
  const STALE_TIME = 1000 * 60;
  const { t: certT } = useTranslation('certification');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const { isModalVisible, setIsModalVisible, currentModalTexts, setCurrentModalTexts, checkAuth } =
    useAuthCheck();

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
    const { isCertificated, isKorean, isStudentIdCardRequested } = await checkAuth();

    if (isCertificated) {
      navigation.navigate('FeedWrite');
      return;
    }

    const modalTexts = getModalTexts({
      isKorean,
      isStudentIdCardRequested,
      t: certT,
      navigation,
    });
    setCurrentModalTexts(modalTexts);
    setIsModalVisible(true);
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
      <ConfirmModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          currentModalTexts?.onConfirm();
        }}
        title={currentModalTexts?.title || ''}
        description={currentModalTexts?.description || ''}
        cancelText={currentModalTexts?.cancelText}
        confirmText={currentModalTexts?.confirmText}
        position="bottom"
        size="default"
      />
    </Layout>
  );
}
