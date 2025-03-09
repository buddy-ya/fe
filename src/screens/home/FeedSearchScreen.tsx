import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { Layout, InnerLayout, KeyboardLayout, FeedList } from '@/components';
import { useFeedList } from '@/hooks';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { X } from 'lucide-react-native';

const SearchInput = ({ value, onChangeText, onSubmit, onClear, onFocusChange }: any) => {
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

type SearchScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedSearch'>;

export default function SearchScreen({ navigation, route }: SearchScreenProps) {
  const { t } = useTranslation('feed');
  const [searchText, setSearchText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const feedListData = useFeedList({
    queryKey: feedKeys.search(submittedText),
    fetchFn: (params) => {
      if (!submittedText.trim()) return Promise.resolve({ feeds: [] });
      return FeedRepository.searchFeeds({
        ...params,
        keyword: submittedText,
        category: undefined,
      });
    },
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
    navigation.navigate('FeedDetail', { feedId, source: 'search', searchKeyword: submittedText });
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
