import { Suspense, useRef, useState } from 'react';
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
import { CommentRepository, feedKeys, FeedRepository, RoomRepository } from '@/api';
import { CommentList, FeedItem, KeyboardLayout, Layout, Input } from '@/components';
import { useFeedDetail } from '@/hooks';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQueries } from '@tanstack/react-query';
import { MoreVertical, Send } from 'lucide-react-native';
import FeedSkeleton from '@/components/feed/FeedSkeleton';
import { FeedOptionModal } from '@/components/modal/BottomOption/FeedOptionModal';
import { ChatRequestModal } from '@/components/modal/Common/ChatRequestModal';

type FeedDetailScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedDetail'>;

export default function FeedDetailScreen({ navigation, route }: FeedDetailScreenProps) {
  const { feedId } = route.params;
  const [commentInput, setCommentInput] = useState('');
  const { t } = useTranslation('feed');
  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const isCertificated = useUserStore((state) => state.isCertificated);
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);

  const handleRefresh = async () => {
    await Promise.all([refetchFeed(), refetchComments()]);
  };

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

  const { handleFeedActions, handleCommentActions } = useFeedDetail({
    feedId,
  });

  const showFeedNotFoundAlert = () => {
    Alert.alert(
      t('alert.feedNotFoundTitle'),
      t('alert.feedNotFoundMessage'),
      [
        {
          text: t('alert.confirm'),
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: false }
    );
  };

  const commentInputRef = useRef<TextInput | null>(null);

  const handleCommentReply = (commentId: number) => {
    setParentCommentId(commentId);
    commentInputRef.current?.focus();
  };

  const handleChatRequest = () => {
    isCertificated ? handleModalOpen('chatRequest') : handleModalOpen('studentCertification');
  };
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    Keyboard.dismiss();

    try {
      !isCertificated && handleModalOpen('studentCertification');
      if (parentCommentId) {
        isCertificated && (await handleCommentActions.submit(commentInput, parentCommentId));
      } else {
        isCertificated && (await handleCommentActions.submit(commentInput));
      }
      setCommentInput('');
      setParentCommentId(null);
    } catch (error) {
      console.error('Comment submission failed:', error);
    }
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
              onPress={() => handleModalOpen('feed')}
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
            />
            <CommentList
              feed={feed}
              comments={comments}
              onReply={handleCommentReply}
              onLike={handleCommentActions.like}
            />
          </ScrollView>
        </KeyboardLayout>
      </Layout>

      <FeedOptionModal
        visible={modalVisible.feed}
        feed={feed}
        onClose={() => handleModalClose('feed')}
      />
      <ChatRequestModal
        visible={modalVisible.chatRequest}
        data={feed}
        onClose={() => handleModalClose('chatRequest')}
      />
    </>
  );
}

export const SuspendedFeedDetailScreen = (props: FeedDetailScreenProps) => {
  return (
    <ErrorBoundary fallback={<></>}>
      <Suspense
        fallback={
          <Layout showHeader disableBottomSafeArea onBack={() => props.navigation.goBack()}>
            {/* TODO: InnerLayout or KeyboardLayout 배치 필요 */}
            <FeedSkeleton />
          </Layout>
        }
      >
        <FeedDetailScreen {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
