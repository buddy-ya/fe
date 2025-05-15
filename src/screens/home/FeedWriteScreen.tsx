import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, TextInput, Alert, Platform, Switch } from 'react-native';
import { feedKeys, FeedRepository } from '@/api';
import {
  Layout,
  InnerLayout,
  KeyboardLayout,
  Loading,
  MyText,
  CategorySelectModal,
  ImagePreview,
} from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import { ImageFile } from '@/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronDown, ImagePlus, X } from 'lucide-react-native';
import { useTabStore } from '@/store/useTabStore';
import { CATEGORIES, isAndroid, logError } from '@/utils';

const FILTERED_CATEGORIES = CATEGORIES;
const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: false,
  quality: 0.6,
  allowsMultipleSelection: true,
  selectionLimit: 5,
};

type FeedWriteScreenProps = NativeStackScreenProps<FeedStackParamList, 'FeedWrite'>;

export default function FeedWriteScreen({ navigation, route }: FeedWriteScreenProps) {
  const feed = route.params?.feed;
  const isEdit = route.params?.isEdit;
  const initialCategoryId = route.params?.initialCategoryId;
  const modalVisible = useModalStore((s) => s.visible.category);
  const handleModalOpen = useModalStore((s) => s.handleOpen);
  const handleModalClose = useModalStore((s) => s.handleClose);
  const { selectedTab } = useTabStore();
  const userUniversity = useUserStore((s) => s.university);
  const tab = selectedTab === 'myUni' ? userUniversity : 'all';

  const [selectedCategory, setSelectedCategory] = useState(
    feed
      ? FILTERED_CATEGORIES.find((c) => c.id === feed.category)!
      : FILTERED_CATEGORIES.find((c) => c.id === initialCategoryId)!
  );
  const [title, setTitle] = useState(feed?.title || '');
  const [content, setContent] = useState(feed?.content || '');
  const [isProfileVisible, setIsProfileVisible] = useState(feed?.isProfileVisible || false);
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
    if (status !== 'granted') return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image/jpeg',
          fileName: asset.uri.split('/').pop() || 'image.jpg',
          width: asset.width,
          height: asset.height,
        }));
        setImages((prev) => [...prev, ...newImages].slice(0, 5));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        ...IMAGE_PICKER_OPTIONS,
        allowsMultipleSelection: false,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        const newImage = {
          uri: asset.uri,
          type: 'image/jpeg',
          fileName: `camera_${Date.now()}.jpg`,
          width: asset.width,
          height: asset.height,
        };
        setImages((prev) => [...prev, newImage].slice(0, 5));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take a photo');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const footerContent = (
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
        <MyText color="text-textDescription" className="font-semibold">
          {images.length > 0 && `${images.length}/5`}
        </MyText>
        <View className="flex-row items-center">
          <MyText size="text-[15px]" color="text-textDescription" className="mr-2 font-semibold">
            {t('write.profileVisible')}
          </MyText>
          <Switch
            value={isProfileVisible}
            onValueChange={setIsProfileVisible}
            style={isAndroid ? undefined : { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            trackColor={{ false: '#767577', true: '#00A176' }}
          />
        </View>
      </View>
    </View>
  );

  const handleUpload = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      if (isEdit && feed) {
        await FeedRepository.update({
          feedId: feed.id,
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory.id,
          isProfileVisible,
          images,
          university: tab,
        });
        queryClient.refetchQueries({ queryKey: feedKeys.detail(feed.id) });
        queryClient.refetchQueries({ queryKey: feedKeys.lists(tab, selectedCategory.id) });
      } else {
        await FeedRepository.create({
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory.id,
          images,
          university: tab,
          isProfileVisible,
        });
        queryClient.refetchQueries({ queryKey: feedKeys.lists(tab, selectedCategory.id) });
      }
      navigation.goBack();
    } catch (error) {
      logError(error);
      Alert.alert('Error', `Feed ${isEdit ? 'Edit' : 'Upload'} Fail.`);
    } finally {
      setIsLoading(false);
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
        <TouchableOpacity
          onPress={() => handleModalOpen('category')}
          className="flex-row items-center"
        >
          <MyText size="text-lg" className="mr-[2px] font-semibold" numberOfLines={1}>
            {selectedCategory.icon} {t(`category.${selectedCategory.label}`)}
          </MyText>
          <ChevronDown size={24} color="#282828" />
        </TouchableOpacity>
      }
      headerRight={
        <TouchableOpacity
          className={`items-center justify-center rounded-full px-3.5 py-1.5 ${
            isValid ? 'bg-primary' : 'bg-gray-400'
          }`}
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
        <KeyboardLayout footer={footerContent}>
          <InnerLayout className="flex-1">
            <TextInput
              className="mt-3 font-semibold text-[18px]"
              placeholder={t('write.titlePlaceholder')}
              placeholderTextColor="#CBCBCB"
              value={title}
              maxLength={100}
              onChangeText={setTitle}
              style={{ textAlignVertical: 'top', padding: 0 }}
            />
            <TextInput
              className="mt-5 font-medium text-[16px]"
              placeholder={t('write.contentPlaceholder')}
              placeholderTextColor="#CBCBCB"
              value={content}
              onChangeText={setContent}
              style={{
                flex: 1,
                textAlignVertical: 'top',
                paddingTop: Platform.OS === 'android' ? 0 : undefined,
              }}
              multiline
              scrollEnabled
              maxLength={4000}
            />
          </InnerLayout>
        </KeyboardLayout>
      )}

      <CategorySelectModal
        visible={modalVisible}
        onClose={() => handleModalClose('category')}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />
    </Layout>
  );
}
