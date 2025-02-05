import { useRef, useState } from 'react';
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
import { CommentList, FeedItem, KeyboardLayout, Layout, Input } from '@/components';
import { useFeedDetail } from '@/hooks';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreVertical, Send } from 'lucide-react-native';
import { FeedOptionModal } from '@/components/modal/BottomOption/FeedOptionModal';

type FeedDetailScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedDetail'>;

export default function FeedDetailScreen({ navigation, route }: FeedDetailScreenProps) {
  const { feedId } = route.params;
  const [comment, setComment] = useState('');
  const { t } = useTranslation('feed');
  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const isCertificated = useUserStore((state) => state.isCertificated);
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);

  const { feed, comments, isRefetching, handleFeedActions, handleCommentActions, handleRefresh } =
    useFeedDetail({
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

  const handleCommentReply = (commentId: number) => {
    setParentCommentId(commentId);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    Keyboard.dismiss();

    try {
      !isCertificated && handleModalOpen('studentCertification');
      if (parentCommentId) {
        isCertificated && (await handleCommentActions.submit(comment, parentCommentId));
      } else {
        isCertificated && (await handleCommentActions.submit(comment));
      }
      setComment('');
      setParentCommentId(null);
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
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => handleModalOpen('feed')}
              hitSlop={{ bottom: 20, left: 20 }}
            >
              <Send size={24} color="#797979" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleModalOpen('feed')}
              hitSlop={{ bottom: 20, left: 20 }}
              className="ml-2"
            >
              <MoreVertical size={24} color="#797979" />
            </TouchableOpacity>
          </View>
        }
      >
        <KeyboardLayout
          footer={<Input value={comment} onChange={setComment} onSubmit={handleCommentSubmit} />}
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
                />
                <CommentList
                  feed={feed}
                  comments={comments}
                  onReply={handleCommentReply}
                  onLike={handleCommentActions.like}
                />
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
