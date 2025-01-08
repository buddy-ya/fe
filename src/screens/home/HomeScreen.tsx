import LogoIcon from '@assets/icons/logo.svg';
import { Bell, Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFeeds } from '@/api/feed/getFeeds';
import { feedKeys } from '@/api/queryKeys';
import { getModalTexts } from '@/hooks/modal/useAuthModal';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useFeedList } from '@/hooks/useFeedList';
import { CATEGORIES } from '@/utils/constants/categories';
import Button from '@/components/common/Button';
import InnerLayout from '@/components/common/layout/InnerLayout';
import Layout from '@/components/common/layout/Layout';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import CategoryPager from '@/components/feed/CategoryPager';
import FeedList from '@/components/feed/FeedList';

export default function HomeScreen({ navigation }) {
  const STALE_TIME = 1000 * 60;
  const { t: certT } = useTranslation('certification');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const { isModalVisible, setIsModalVisible, currentModalTexts, setCurrentModalTexts, checkAuth } =
    useAuthCheck();

  const feedListData = useFeedList({
    queryKey: feedKeys.lists(activeCategory),
    fetchFn: (params) =>
      getFeeds({
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
    console.log('CLICKED');
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

  const isAndroid = Platform.OS === 'android';
  const insets = useSafeAreaInsets();
  const writeButtonPosition = isAndroid ? insets.bottom + 100 : insets.bottom + 40;

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
        <View className="flex-1">
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
        </View>
        <Button
          type="circle"
          onPress={handleWriteButton}
          className={`absolute right-0`}
          containerStyle={{
            bottom: writeButtonPosition,
          }}
          icon={Plus}
        />
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
