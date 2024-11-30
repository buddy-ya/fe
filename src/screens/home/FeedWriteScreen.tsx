import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { X, ChevronDown, Camera, ImagePlus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Layout from "@/components/common/Layout";
import MyText from "@/components/common/MyText";
import BottomModal from "@/components/common/BottomModal";
import { useModal } from "@/hooks/useModal";
import { CATEGORIES } from "@/utils/constants/categories";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { CategorySelectModal } from "@/components/feed/CategorySelectModal";
import { ImagePreview } from "@/components/feed/ImagePreview";
import InnerLayout from "@/components/common/InnerLayout";
import { createFeed, updateFeed } from "@/api/feed/feedAction";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { feedKeys } from "@/api/queryKeys";

interface ImageFile {
  uri: string;
  type: string;
  fileName?: string;
  width?: number;
  height?: number;
}

const FILTERED_CATEGORIES = CATEGORIES.filter(
  (category) => category.id !== "popular"
);

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: false,
  quality: 0.8,
  allowsMultipleSelection: true,
  selectionLimit: 5,
};

export default function FeedWriteScreen({ navigation, route }) {
  const feed = route.params?.feed;
  const isEdit = route.params?.isEdit;

  const [selectedCategory, setSelectedCategory] = useState(
    feed
      ? FILTERED_CATEGORIES.find((c) => c.id === feed.category) ||
          FILTERED_CATEGORIES[0]
      : FILTERED_CATEGORIES[0]
  );
  const [title, setTitle] = useState(feed?.title || "");
  const [isNotValid, setIsNotValid] = useState(title.trim().length > 1);
  const [content, setContent] = useState(feed?.content || "");
  const [images, setImages] = useState<ImageFile[]>(
    feed?.imageUrls?.map((uri) => ({
      uri,
      type: "image/jpeg",
      fileName: uri.split("/").pop() || "image.jpg",
    })) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("feed");

  const queryClient = useQueryClient();
  const categoryModal = useModal();

  const handleCategorySelect = (category: (typeof CATEGORIES)[0]) => {
    setSelectedCategory(category);
    categoryModal.closeModal();
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
          type: "image/jpeg",
          fileName: asset.uri.split("/").pop() || "image.jpg",
          width: asset.width,
          height: asset.height,
        }));

        setImages((prev) => {
          const updatedImages = [...prev, ...newImages];
          return updatedImages.slice(0, 5);
        });
      }
    } catch (error) {
      Alert.alert("오류", "이미지를 불러오는데 실패했습니다.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    try {
      const result = await ImagePicker.launchCameraAsync({
        ...IMAGE_PICKER_OPTIONS,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
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
      Alert.alert("오류", "사진 촬영에 실패했습니다.");
    }
  };

  const handleOpenCategoryModal = () => {
    const options = FILTERED_CATEGORIES.map((category) => ({
      label: `${category.icon} ${category.label}`,
      onPress: () => handleCategorySelect(category),
      color:
        category.id === selectedCategory.id ? "text-textActive" : "#797979",
      icon:
        category.id === selectedCategory.id ? (
          <View className="w-4 h-4 rounded-full bg-primary" />
        ) : (
          <View className="w-4 h-4 rounded-full border border-gray-300" />
        ),
    }));

    categoryModal.openModal(options);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!title.trim()) {
      return false;
    }
    return true;
  };

  // FeedWriteScreen.tsx
  const handleUpload = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (isEdit && feed) {
        await updateFeed(feed.id, {
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory.id,
          images,
        });
        queryClient.invalidateQueries({ queryKey: feedKeys.detail(feed.id) });
        queryClient.invalidateQueries({
          queryKey: feedKeys.lists(selectedCategory.id),
        });
      } else {
        await createFeed({
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
      Alert.alert("오류", `게시물 ${isEdit ? "수정" : "등록"}에 실패했습니다.`);
    } finally {
      setIsLoading(false);
      navigation.goBack();
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
        <TouchableOpacity
          onPress={handleOpenCategoryModal}
          className="flex-row items-center"
        >
          <MyText size="text-xl" className="mr-[2px] font-semibold">
            {selectedCategory.icon} {selectedCategory.label}
          </MyText>
          <ChevronDown size={24} color="#282828" />
        </TouchableOpacity>
      }
      headerRight={
        <TouchableOpacity
          className={`px-3.5 py-1.5 rounded-full ${
            isLoading ? "bg-gray-400" : "bg-primary"
          }`}
          onPress={handleUpload}
          disabled={isLoading}
        >
          <MyText color="text-white" className="font-semibold">
            {isLoading ? "처리중..." : "게시"}
          </MyText>
        </TouchableOpacity>
      }
    >
      <KeyboardLayout
        footer={
          <View>
            <ImagePreview images={images} onRemove={removeImage} />
            <View className="flex-row justify-between items-center py-3 px-4 border-gray-200">
              <View className="flex-row items-center ml-1">
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
          <ScrollView className="flex-1 mt-8 pb-[50px]">
            <TextInput
              className="text-[20px] font-semibold"
              placeholder="제목을 입력해주세요."
              placeholderTextColor="#CBCBCB"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="text-[18px] mt-4 font-semibold"
              placeholder="내용을 입력해주세요."
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

      <BottomModal
        visible={categoryModal.visible}
        onClose={categoryModal.closeModal}
      >
        <CategorySelectModal
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </BottomModal>
    </Layout>
  );
}
