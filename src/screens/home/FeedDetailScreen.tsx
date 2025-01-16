import { MoreVertical } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthCheck, useFeedDetail } from '@/hooks';
import { CommentList, FeedItem, KeyboardLayout, Layout, CommentInput, CommentOptionModal } from '@/components';
import { FeedOptionModal } from '@/components/modal/BottomOption/FeedOptionModal';
import { useCommentStore } from '@/store/useCommentStore';
import { useModalStore } from '@/store';

export default function FeedDetailScreen({ navigation, route }) {
  const { feedId } = route.params;
  const [comment, setComment] = useState('');
  const { t } = useTranslation('feed');
  const modalVisible = useModalStore(state => state.visible);
  const handleModalOpen = useModalStore(state => state.handleOpen);
  const handleModalClose = useModalStore(state => state.handleClose);
  const { checkAuth } =
    useAuthCheck();

  const { feed, comments, isRefetching, handleFeedActions, handleCommentActions, handleRefresh } =
    useFeedDetail({
      feedId,
    });

  const selectedComment = useCommentStore(state => state.comment);

  const showDeleteAlert = (onConfirm: () => void) => {
    Alert.alert(
      t('delete.title'),
      t('delete.description'),
      [
        { text: t('delete.cancel'), style: 'cancel' },
        { text: t('delete.confirm'), style: 'destructive', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  };

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

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    Keyboard.dismiss();

    try {
      const { isCertificated } = await checkAuth();
      !isCertificated && handleModalOpen('studentCertification');
      isCertificated && await handleCommentActions.submit(comment);
      setComment('');
    } catch (error) {
      console.error('Comment submission failed:', error);
    }
  };

  if (!(feed || isRefetching)) return null;

  return (
    <>
      <Layout
        showHeader
        disableBottomSafeArea
        onBack={() => navigation.goBack()}
        headerRight={
          <TouchableOpacity onPress={() => handleModalOpen('feed')} hitSlop={{ bottom: 20, left: 20 }}>
            <MoreVertical size={24} color="#797979" />
          </TouchableOpacity>
        }
      >
        <KeyboardLayout
          footer={
            <CommentInput value={comment} onChange={setComment} onSubmit={handleCommentSubmit} />
          }
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="mt-1"
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor="#4AA366"
              />
            }
          >
            {feed && (
              <>
                <FeedItem
                  feed={feed}
                  onLike={handleFeedActions.like}
                  onBookmark={handleFeedActions.bookmark}
                  showAllContent
                  disablePress
                />
                <CommentList feed={feed} comments={comments} />
              </>
            )}
          </ScrollView>
        </KeyboardLayout>
      </Layout>

      <FeedOptionModal
        visible={modalVisible.feed}
        feed={feed}
        onClose={() => handleModalClose('feed')}
      />

    </>
  );
}
