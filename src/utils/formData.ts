import { Platform } from 'react-native';
import { API } from '@/api';

export interface ImageFile {
  uri: string;
  type: string;
  fileName?: string;
}

export interface FeedFormData {
  title: string;
  content: string;
  university: string;
  category: string;
  isProfileVisible: boolean;
  images?: ImageFile[];
}

export const processImageForUpload = (image: ImageFile) => {
  const uri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
  const fileName = image.fileName || image.uri.split('/').pop() || 'image.jpg';

  const isValidMimeType = image.type && image.type.includes('/');
  const mimeType = isValidMimeType ? image.type : 'image/jpeg';

  return {
    uri,
    name: fileName,
    type: mimeType,
    originalname: fileName,
  } as any;
};

export const createFeedFormData = ({
  title,
  content,
  university,
  category,
  isProfileVisible = false,
  images = [],
}: FeedFormData): FormData => {
  const formData = new FormData();
  formData.append('title', title.trim());
  formData.append('content', content.trim());
  formData.append('category', category);
  formData.append('university', university);
  formData.append('isProfileVisible', isProfileVisible.toString());
  images.forEach((image) => {
    formData.append('images', processImageForUpload(image));
  });

  return formData;
};

export const getFormDataHeaders = () => {
  const defaultHeaders = { ...API.defaults.headers.common };
  if (Platform.OS === 'android') {
    defaultHeaders['Content-Type'] = 'multipart/form-data';
  }
  return defaultHeaders;
};
