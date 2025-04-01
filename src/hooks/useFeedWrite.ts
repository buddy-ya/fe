import { useState } from 'react';
import { Alert } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { useQueryClient } from '@tanstack/react-query';
import { ImageFile } from '@/utils';

interface FeedData {
  title: string;
  content: string;
  university: string;
  category: string;
  images: ImageFile[];
}

interface UseFeedWriteProps {
  initialData?: {
    title?: string;
    content?: string;
    feedId?: number;
  };
  onSuccess?: () => void;
}

export const useFeedWrite = ({ initialData = {}, onSuccess }: UseFeedWriteProps = {}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleUpload = async ({
    university,
    category,
    images,
  }: Omit<FeedData, 'title' | 'content'>) => {
    if (!isValid) return;

    try {
      setIsLoading(true);

      if (initialData.feedId) {
        await FeedRepository.update({
          feedId: initialData.feedId,
          title: title.trim(),
          content: content.trim(),
          university,
          category,
          images,
        });
        queryClient.invalidateQueries({
          queryKey: feedKeys.detail(initialData.feedId),
        });
        queryClient.invalidateQueries({
          queryKey: feedKeys.lists(university, category),
        });
      } else {
        await FeedRepository.create({
          title: title.trim(),
          content: content.trim(),
          university,
          category,
          images,
        });
        queryClient.invalidateQueries({
          queryKey: feedKeys.lists(university, category),
        });
      }
      onSuccess?.();
    } catch (error) {
      Alert.alert('Error', `Feed ${initialData.feedId ? 'Edit' : 'Upload'} Failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isLoading,
    isValid,
    handleUpload,
  };
};
