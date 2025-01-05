import { X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { searchFeeds } from '@/api/feed/getFeeds';
import { feedKeys } from '@/api/queryKeys';
import { useFeedList } from '@/hooks/useFeedList';
import InnerLayout from '@/components/common/layout/InnerLayout';
import KeyboardLayout from '@/components/common/layout/KeyboardLayout';
import Layout from '@/components/common/layout/Layout';
import FeedList from '@/components/feed/FeedList';

const SearchInput = ({ value, onChangeText, onSubmit, onClear, onFocusChange }) => {
  const { t } = useTranslation('feed');

  return (
    <View className="flex-1 flex-row items-center rounded-[12px] bg-[#E8E9EB]">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={t('search.placeholder')}
        placeholderTextColor="#797979"
        returnKeyType="search"
        className="flex-1 px-4 text-[15px]"
        autoFocus
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} className="px-3">
          <X size={20} color="#797979" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function SearchScreen({ navigation }) {
  const { t } = useTranslation('feed');
  const [searchText, setSearchText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const feedListData = useFeedList({
    queryKey: feedKeys.search(submittedText),
    fetchFn: (params) => {
      if (!submittedText.trim()) return Promise.resolve({ feeds: [] });
      return searchFeeds({
        ...params,
        keyword: submittedText,
        category: 'free',
      });
    },
    staleTime: 1000 * 60 * 3,
  });

  const handleSubmit = () => {
    if (searchText.trim()) {
      setSubmittedText(searchText.trim());
    }
  };

  const handleClear = () => {
    setSearchText('');
    setSubmittedText('');
  };

  const handlePressFeed = (feedId: number) => {
    navigation.navigate('FeedDetail', { feedId });
  };

  return (
    <Layout
      showHeader
      isSearchLayout
      isBackgroundWhite={false}
      onBack={() => navigation.goBack()}
      headerCenter={
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSubmit}
          onClear={handleClear}
          onFocusChange={setIsFocused}
        />
      }
    >
      <InnerLayout className="bg-mainBackground">
        <KeyboardLayout>
          {isFocused ||
            (submittedText.trim() && (
              <FeedList
                feeds={feedListData.feeds}
                onLike={feedListData.handleLike}
                onBookmark={feedListData.handleBookmark}
                onPress={handlePressFeed}
                isLoading={feedListData.isLoading}
                hasMore={feedListData.hasMore}
                onLoadMore={feedListData.handleLoadMore}
                className="mt-3"
                emptyStateMessage={
                  submittedText ? t('search.empty.result') : t('search.empty.default')
                }
                refreshControl={{
                  refreshing: feedListData.isLoading && feedListData.feeds.length > 0,
                  onRefresh: feedListData.handleRefresh,
                  tintColor: '#4AA366',
                }}
              />
            ))}
        </KeyboardLayout>
      </InnerLayout>
    </Layout>
  );
}
