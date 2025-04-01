import React, { Suspense, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Keyboard,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommentRepository, feedKeys, FeedRepository } from '@/api';
import { CommentList, FeedItem, KeyboardLayout, Layout, Input } from '@/components';
import { useFeedDetail } from '@/hooks';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { FeedService } from '@/service';
import { useModalStore, useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { MoreVertical, Send } from 'lucide-react-native';
import FeedSkeleton from '@/components/feed/FeedSkeleton';

type FeedDetailScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedDetail'>;

export default function FeedDetailScreen({ navigation, route }: FeedDetailScreenProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { feedId, source, searchKeyword } = route.params;
  const { t } = useTranslation('feed');
  const queryClient = useQueryClient();
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const isCertificated = useUserStore((state) => state.isCertificated);
  const [commentInput, setCommentInput] = useState('');
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const commentInputRef = useRef<TextInput | null>(null);

  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: feedKeys.detail(feedId),
        queryFn: () => FeedRepository.get({ feedId }),
      },
      {
        queryKey: ['feedComments', feedId],
        queryFn: () => CommentRepository.getComments({ feedId }),
      },
    ],
  });

  const [
    { data: feed, refetch: refetchFeed, isRefetching: isRefetchingFeed },
    { data: comments, refetch: refetchComments },
  ] = results;

  const updateBookmarkCache = source === 'bookmark';
  const updateMyPostsCache = source === 'myPosts';
  const updateSearchCache = source === 'search';
  const effectiveFeedCategory = updateSearchCache ? undefined : feed.category;

  const { handleFeedActions, handleCommentActions } = useFeedDetail({
    feedId,
    university: feed.university,
    feedCategory: effectiveFeedCategory,
    updateBookmarkCache,
    updateMyPostsCache,
    updateSearchCache,
    searchKeyword,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchFeed(), refetchComments()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    FeedService.incrementViewCount(
      queryClient,
      feedKeys.lists(feed.university || 'all', feed.category || 'free'),
      feedId
    );
  }, [feedId, queryClient]);

  const handleCommentReply = (commentId: number) => {
    setParentCommentId(commentId);
    commentInputRef.current?.focus();
  };

  const handleChatRequest = () => {
    if (isCertificated) {
      handleModalOpen('chatRequest', { data: feed });
    } else {
      handleModalOpen('studentCertification');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    Keyboard.dismiss();
    try {
      if (!isCertificated) {
        handleModalOpen('studentCertification');
        return;
      }
      if (parentCommentId) {
        await handleCommentActions.submit(commentInput, parentCommentId);
      } else {
        await handleCommentActions.submit(commentInput);
      }
      setCommentInput('');
      setParentCommentId(null);
    } catch (error) {
      console.error('Comment submission failed:', error);
    }
  };

  const openFeedOptionModal = () => {
    handleModalOpen('feed', { feed });
  };

  return (
    <>
      <Layout
        showHeader
        disableBottomSafeArea
        onBack={() => navigation.goBack()}
        headerRight={
          <View className="flex-row">
            {!feed.isFeedOwner && (
              <TouchableOpacity onPress={handleChatRequest} hitSlop={{ bottom: 20, left: 10 }}>
                <Send size={24} color="#797979" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={openFeedOptionModal}
              hitSlop={{ bottom: 20, left: 10 }}
              className="ml-4"
            >
              <MoreVertical size={24} color="#797979" />
            </TouchableOpacity>
          </View>
        }
      >
        <KeyboardLayout
          footer={
            <Input
              ref={commentInputRef}
              value={commentInput}
              onChange={setCommentInput}
              onSubmit={handleCommentSubmit}
              placeholder={t('comment.placeholder')}
              maxLength={500}
            />
          }
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="mt-1"
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingFeed}
                onRefresh={handleRefresh}
                tintColor="#4AA366"
              />
            }
          >
            <FeedItem
              feed={feed}
              onLike={handleFeedActions.like}
              onBookmark={handleFeedActions.bookmark}
              showAllContent
              onPress={() => {}}
            />
            <CommentList
              feed={feed}
              comments={comments}
              onReply={handleCommentReply}
              onLike={(commentId) => handleCommentActions.like(commentId)}
            />
          </ScrollView>
        </KeyboardLayout>
      </Layout>
    </>
  );
}

export const SuspendedFeedDetailScreen = (props: FeedDetailScreenProps) => (
  <ErrorBoundary fallback={<></>}>
    <Suspense
      fallback={
        <Layout showHeader disableBottomSafeArea onBack={() => props.navigation.goBack()}>
          <FeedSkeleton />
        </Layout>
      }
    >
      <FeedDetailScreen {...props} />
    </Suspense>
  </ErrorBoundary>
);
