import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { FeedList, InnerLayout, Layout, MyText } from '@/components';
import { useFeedList } from '@/hooks';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bookmark } from 'lucide-react-native';

type BookmarkScreenProps = NativeStackScreenProps<MyPageStackParamList, 'Bookmark'>;

export default function BookmarkScreen({ navigation, route }: BookmarkScreenProps) {
  const { t } = useTranslation('mypage');

  const feedListData = useFeedList({
    queryKey: feedKeys.bookmarks(),
    fetchFn: FeedRepository.getBookmarkedFeeds,
  });

  const handlePressFeed = (feedId: number) => {
    navigation.navigate('FeedDetail', { feedId, source: 'bookmark' });
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <View className="mr-1">
            <Bookmark size={19} strokeWidth={2} color="#282828" />
          </View>
          <View>
            <MyText size="text-lg" className="font-semibold">
              {t('quickMenu.bookmark')}
            </MyText>
          </View>
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
          emptyStateNamespace="bookmark"
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
