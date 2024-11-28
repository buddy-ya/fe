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

interface ImageFile {
  uri: string;
  type: string;
  fileName?: string;
}

const FILTERED_CATEGORIES = CATEGORIES.filter(
  (category) => category.id !== "popular"
);

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
  const [content, setContent] = useState(feed?.content || "");
  const [images, setImages] = useState<ImageFile[]>(
    feed?.imageUrls?.map((uri) => ({
      uri,
      type: "image/jpeg",
      fileName: uri.split("/").pop() || "image.jpg",
    })) || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const categoryModal = useModal();

  const handleCategorySelect = (category: (typeof CATEGORIES)[0]) => {
    setSelectedCategory(category);
    categoryModal.closeModal();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 5,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: "image/jpeg",
          fileName: asset.uri.split("/").pop() || "image.jpg",
        }));

        setImages((prev) => {
          const updatedImages = [...prev, ...newImages];
          return updatedImages.slice(0, 5);
        });
      }
    } catch (error) {
      console.error("ImagePicker Error:", error);
      Alert.alert("오류", "이미지를 불러오는데 실패했습니다.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("권한 필요", "카메라 접근 권한이 필요합니다.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          fileName: `camera_${Date.now()}.jpg`,
        };

        setImages((prev) => {
          const updatedImages = [...prev, newImage];
          return updatedImages.slice(0, 5);
        });
      }
    } catch (error) {
      console.error("Camera Error:", error);
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
      Alert.alert("알림", "제목을 입력해주세요.");
      return false;
    }
    return true;
  };

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
        Alert.alert("알림", "게시물이 수정되었습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
      } else {
        await createFeed({
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory.id,
          images,
        });
        Alert.alert("알림", "게시물이 등록되었습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("오류", `게시물 ${isEdit ? "수정" : "등록"}에 실패했습니다.`);
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
          className={`px-4 py-1.5 rounded-full ${
            isLoading ? "bg-gray-400" : "bg-primary"
          }`}
          onPress={handleUpload}
          disabled={isLoading}
        >
          <MyText color="text-white">{isLoading ? "처리중..." : "게시"}</MyText>
        </TouchableOpacity>
      }
    >
      <KeyboardLayout
        footer={
          <View>
            <ImagePreview images={images} onRemove={removeImage} />
            <View className="flex-row justify-between items-center py-2 px-4 border-t border-gray-200">
              <View className="flex-row items-center">
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
