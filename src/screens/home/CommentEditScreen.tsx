import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CommentRepository, feedKeys } from '@/api';
import { MyText, Layout, InnerLayout } from '@/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FeedStackParamList } from '@/navigation/navigationRef';

type CommentEditScreenProps = NativeStackScreenProps<FeedStackParamList, 'CommentEdit'>;

export default function CommentEditScreen({ navigation, route }: CommentEditScreenProps) {
  const { feedId, commentId, initialContent } = route.params;
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation('feed');

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      CommentRepository.update({ feedId, commentId, content }),
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(['feedComments', feedId], (old: any) => {
        const currentComments = old || [];
        return currentComments.map((comment: any) =>
          comment.id === updatedComment.id ? updatedComment : comment
        );
      });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
      navigation.goBack();
    },
  });

  const handleSubmit = async () => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      await updateCommentMutation.mutateAsync({
        commentId,
        content: content.trim(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      showHeader
      headerLeft={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color="#797979" />
        </TouchableOpacity>
      }
      headerCenter={
        <MyText size="text-lg" className="font-semibold">
          댓글 수정
        </MyText>
      }
      headerRight={
        <TouchableOpacity
          className={`rounded-full px-3.5 py-1.5 ${content.trim() && !isLoading ? 'bg-primary' : 'bg-gray-400'}`}
          onPress={handleSubmit}
          disabled={!content.trim() || isLoading}
        >
          <MyText color="text-white" className="font-semibold">
            {isLoading ? t('write.loading') : t('write.postButton')}
          </MyText>
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <ScrollView className="flex-1">
          <View className="mt-4">
            <TextInput
              className="font-semibold text-[18px]"
              value={content}
              onChangeText={setContent}
              placeholder={t('comment.placeholder')}
              placeholderTextColor="#CBCBCB"
              multiline
              autoFocus
            />
          </View>
        </ScrollView>
      </InnerLayout>
    </Layout>
  );
}
