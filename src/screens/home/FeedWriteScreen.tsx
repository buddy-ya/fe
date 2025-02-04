import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronDown, ImagePlus, X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import { CATEGORIES } from '@/utils';
import { Layout, InnerLayout, KeyboardLayout, Loading, MyText, CategorySelectModal, ImagePreview } from '@/components';
import { ImageFile } from '@/types';
import { useModalStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FeedStackParamList } from '@/navigation/navigationRef';

const FILTERED_CATEGORIES = CATEGORIES.filter((category) => category.id !== 'popular');

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: false,
  quality: 0.7,
  allowsMultipleSelection: true,
  selectionLimit: 5,
};

type FeedWriteScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedWrite'>;

export default function FeedWriteScreen({ navigation, route }: FeedWriteScreenProps) {
  const feed = route.params?.feed;
  const isEdit = route.params?.isEdit;
  const modalVisible = useModalStore(state => state.visible.category);
  const handleModalOpen = useModalStore(state => state.handleOpen);
  const handleModalClose = useModalStore(state => state.handleClose);

  const [selectedCategory, setSelectedCategory] = useState(
    feed
      ? FILTERED_CATEGORIES.find((c) => c.id === feed.category) || FILTERED_CATEGORIES[0]
      : FILTERED_CATEGORIES[0]
  );
  const [title, setTitle] = useState(feed?.title || '');
  const [content, setContent] = useState(feed?.content || '');
  const isValid = title.trim().length > 0 && content.trim().length > 0;
  const [images, setImages] = useState<ImageFile[]>(
    feed?.imageUrls?.map((uri) => ({
      uri,
      type: 'image/jpeg',
      fileName: uri.split('/').pop() || 'image.jpg',
    })) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('feed');

  const queryClient = useQueryClient();

  const handleCategorySelect = (category: (typeof CATEGORIES)[0]) => {
    setSelectedCategory(category);
    handleModalClose('category');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        ...IMAGE_PICKER_OPTIONS,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image/jpeg',
          fileName: asset.uri.split('/').pop() || 'image.jpg',
          width: asset.width,
          height: asset.height,
        }));

        setImages((prev) => {
          const updatedImages = [...prev, ...newImages];
          return updatedImages.slice(0, 5);
        });
      }
    } catch (error) {
      Alert.alert('오류', '이미지를 불러오는데 실패했습니다.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert(t('studentId.permission.gallery'));
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        ...IMAGE_PICKER_OPTIONS,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          fileName: `camera_${Date.now()}.jpg`,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };

        setImages((prev) => {
          const updatedImages = [...prev, newImage];
          return updatedImages.slice(0, 5);
        });
      }
    } catch (error) {
      Alert.alert('오류', '사진 촬영에 실패했습니다.');
    }
  };

  const handleOpenCategoryModal = () => {
    handleModalOpen('category');
    // const options = FILTERED_CATEGORIES.map((category) => ({
    //   label: `${category.icon} ${category.label}`,
    //   onPress: () => handleCategorySelect(category),
    //   color: category.id === selectedCategory.id ? 'text-textActive' : '#797979',
    //   icon:
    //     category.id === selectedCategory.id ? (
    //       <View className="h-4 w-4 rounded-full bg-primary" />
    //     ) : (
    //       <View className="h-4 w-4 rounded-full border border-gray-300" />
    //     ),
    // }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      if (isEdit && feed) {
        await FeedRepository.update({
          feedId: feed.id,
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory.id,
          images,
        }
        );
        queryClient.invalidateQueries({ queryKey: feedKeys.detail(feed.id) });
        queryClient.invalidateQueries({
          queryKey: feedKeys.lists(selectedCategory.id),
        });
      } else {
        await FeedRepository.create({
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory.id,
          images,
        });
        queryClient.invalidateQueries({
          queryKey: feedKeys.lists(selectedCategory.id),
        });
      }
    } catch (error) {
      Alert.alert('오류', `Feed ${isEdit ? 'Edit' : 'Upload'} Fail.`);
    } finally {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  return (
    <Layout
      showHeader
      isBackgroundWhite
      headerLeft={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color="#797979" />
        </TouchableOpacity>
      }
      headerCenter={
        <TouchableOpacity onPress={handleOpenCategoryModal} className="flex-row items-center">
          <MyText size="text-xl" className="mr-[2px] font-semibold">
            {selectedCategory.icon} {selectedCategory.label}
          </MyText>
          <ChevronDown size={24} color="#282828" />
        </TouchableOpacity>
      }
      headerRight={
        <TouchableOpacity
          className={`rounded-full px-3.5 py-1.5 ${isValid ? 'bg-primary' : 'bg-gray-400'}`}
          onPress={handleUpload}
          disabled={isLoading}
        >
          <MyText color="text-white" className="font-semibold">
            {isLoading ? t('write.loading') : t('write.postButton')}
          </MyText>
        </TouchableOpacity>
      }
    >
      {isLoading ? (
        <Loading />
      ) : (
        <KeyboardLayout
          footer={
            <View>
              <ImagePreview images={images} onRemove={removeImage} />
              <View className="flex-row items-center justify-between border-gray-200 px-4 py-3">
                <View className="ml-1 flex-row items-center">
                  <TouchableOpacity onPress={takePhoto} className="mr-3">
                    <Camera size={24} color="#797979" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickImage}>
                    <ImagePlus size={24} color="#797979" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                  <MyText color="text-textDescription" className="font-semibold">
                    {images.length > 0 && `${images.length}/5`}
                  </MyText>
                </View>
              </View>
            </View>
          }
        >
          <InnerLayout>
            <ScrollView className="mt-8 flex-1 pb-[50px]">
              <TextInput
                className="font-semibold text-[20px]"
                placeholder={t('write.titlePlaceholder')}
                placeholderTextColor="#CBCBCB"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                className="mt-4 font-semibold text-[18px]"
                placeholder={t('write.contentPlaceholder')}
                placeholderTextColor="#CBCBCB"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                style={{ minHeight: 150 }}
              />
            </ScrollView>
          </InnerLayout>
        </KeyboardLayout>
      )}

      <CategorySelectModal visible={modalVisible} onClose={() => handleModalClose('category')} selectedCategory={selectedCategory} onSelect={handleCategorySelect} />
    </Layout>
  );
}
