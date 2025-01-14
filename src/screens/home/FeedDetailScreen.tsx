import { useQueryClient } from '@tanstack/react-query';
import { MoreVertical } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { getModalTexts, useAuthCheck, useFeedDetail, useFeedBottomModal } from '@/hooks';
import { BottomModal, CommentList, ConfirmModal, FeedItem, KeyboardLayout, Layout, CommentInput } from '@/components';
import { useConfirmModalStore } from '@/store';

export default function FeedDetailScreen({ navigation, route }) {
  const { feedId } = route.params;
  const [comment, setComment] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const { t } = useTranslation('feed');
  const { t: certT } = useTranslation('certification');
  const { currentModalTexts, checkAuth } =
    useAuthCheck();

  const { visible, title, description, cancelText, confirmText, handleOpen, handleClose, handleConfirm, setTitle, setDescription, setCancelText, setConfirmText } = useConfirmModalStore();
  const { feed, comments, isRefetching, handleFeedActions, handleCommentActions, handleRefresh } =
    useFeedDetail({
      feedId,
      enabled: !isDeleted,
    });

  const queryClient = useQueryClient();

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

  const { feedModal, commentModal, handleFeedOptions, handleCommentOptions } = useFeedBottomModal({
    feed,
    onEditFeed: () =>
      navigation.navigate('FeedWrite', {
        feed,
        isEdit: true,
      }),
    onDeleteFeed: () => {
      showDeleteAlert(async () => {
        setIsDeleted(true);
        await FeedRepository.delete({ feedId });
        queryClient.invalidateQueries({ queryKey: feedKeys.all });
        feedModal.closeModal();
        navigation.goBack();
      });
    },
    onEditComment: (comment) =>
      navigation.navigate('CommentEdit', {
        feedId,
        commentId: comment.id,
        initialContent: comment.content,
      }),
    onDeleteComment: handleCommentActions.delete,
  });

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    Keyboard.dismiss();

    try {
      const { isCertificated, isKorean, isStudentIdCardRequested } = await checkAuth();
      if (!isCertificated) {
        const modalTexts = getModalTexts({
          isKorean,
          isStudentIdCardRequested,
          t: certT,
          navigation,
        });
        setTitle(modalTexts.title);
        setDescription(modalTexts.description);
        setCancelText(modalTexts.cancelText);
        setConfirmText(modalTexts.confirmText);
        handleOpen();
        return;
      }
      await handleCommentActions.submit(comment);
      setComment('');
    } catch (error) {
      console.error('Comment submission failed:', error);
    }
  };

  if (isDeleted || !(feed || isRefetching)) return null;

  return (
    <>
      <Layout
        showHeader
        disableBottomSafeArea
        onBack={() => navigation.goBack()}
        headerRight={
          <TouchableOpacity onPress={handleFeedOptions} hitSlop={{ bottom: 20, left: 20 }}>
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
                <CommentList comments={comments} onCommentOptions={handleCommentOptions} />
              </>
            )}
          </ScrollView>
        </KeyboardLayout>
      </Layout>

      <BottomModal
        visible={feedModal.visible}
        onClose={feedModal.closeModal}
        options={feedModal.options}
      />
      <BottomModal
        visible={commentModal.visible}
        onClose={commentModal.closeModal}
        options={commentModal.options}
      />
      <ConfirmModal
        visible={visible}
        onClose={handleClose}
        onConfirm={() => {
          currentModalTexts?.onConfirm();
          handleClose();
        }}
        title={title}
        description={description}
        cancelText={cancelText}
        confirmText={confirmText}
        position="bottom"
        size="default"
      />
    </>
  );
}
