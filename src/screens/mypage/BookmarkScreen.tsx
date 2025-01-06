import { Bookmark } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { useFeedList } from '@/hooks';
import { FeedList, InnerLayout, Layout, MyText } from '@/components';

export default function BookmarkScreen({ navigation }) {
  const { t } = useTranslation('mypage');

  const feedListData = useFeedList({
    queryKey: feedKeys.bookmarks(),
    fetchFn: FeedRepository.getBookmarkedFeeds,
    staleTime: 1000 * 60 * 5,
  });

  const handlePressFeed = (feedId: number) => {
    navigation.navigate('FeedDetail', { feedId });
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <MyText className="mr-1">
            <Bookmark size={19} strokeWidth={2} color="#282828" />
          </MyText>
          <MyText size="text-lg" className="font-bold">
            {t('bookmark')}
          </MyText>
        </View>
      }
    >
      <InnerLayout>
        <FeedList
          feeds={feedListData.feeds}
          onLike={feedListData.handleLike}
          onBookmark={feedListData.handleBookmark}
          onPress={handlePressFeed}
          isLoading={feedListData.isLoading}
          hasMore={feedListData.hasMore}
          onLoadMore={feedListData.handleLoadMore}
          emptyStateMessage={t('bookmarkEmpty')}
          refreshControl={{
            refreshing: feedListData.isLoading && feedListData.feeds.length > 0,
            onRefresh: feedListData.handleRefresh,
            tintColor: '#4AA366',
          }}
        />
      </InnerLayout>
    </Layout>
  );
}
