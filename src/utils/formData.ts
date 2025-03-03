import { Platform } from 'react-native';

export interface ImageFile {
  uri: string;
  type: string;
  fileName?: string;
}

export interface FeedFormData {
  title: string;
  content: string;
  category: string;
  images?: ImageFile[];
}

export const processImageForUpload = (image: ImageFile) => {
  const uri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
  const fileName = image.fileName || image.uri.split('/').pop() || 'image.jpg';
  return {
    uri,
    name: fileName,
    type: image.type || 'image/jpeg',
    originalname: fileName,
  } as any;
};

export const createFeedFormData = ({
  title,
  content,
  category,
  images = [],
}: FeedFormData): FormData => {
  const formData = new FormData();
  formData.append('title', title.trim());
  formData.append('content', content.trim());
  formData.append('category', category);

  images.forEach((image) => {
    formData.append('images', processImageForUpload(image));
  });

  return formData;
};
