// useImageUpload.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { ImageFile } from '@/types';
import {
  ImagePickerOptions,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';

interface UseImageUploadProps {
  options?: Partial<ImagePickerOptions>;
  initialImages?: ImageFile[];
}

export const useImageUpload = ({ options, initialImages = [] }: UseImageUploadProps) => {
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [loading, setLoading] = useState(false);

  const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: options?.allowsEditing ?? false,
    quality: options?.quality ?? 0.8,
    allowsMultipleSelection: options?.allowsMultipleSelection,
    selectionLimit: options?.selectionLimit,
  };

  // handleUpload: 선택한 이미지 배열을 반환하도록 수정
  const handleUpload = async (): Promise<ImageFile[] | null> => {
    setLoading(true);
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', '미디어 라이브러리 권한이 필요합니다.');
      setLoading(false);
      return null;
    }
    try {
      const result = await launchImageLibraryAsync({
        ...IMAGE_PICKER_OPTIONS,
      });
      if (!result.canceled && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image/jpeg',
          fileName: asset.uri.split('/').pop() || 'image.jpg',
          width: asset.width,
          height: asset.height,
        }));
        setImages(newImages.slice(0, options?.selectionLimit));
        return newImages.slice(0, options?.selectionLimit);
      }
      return null;
    } catch (error) {
      Alert.alert('Error', '이미지 로드에 실패했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    handleUpload,
    loading,
  };
};
