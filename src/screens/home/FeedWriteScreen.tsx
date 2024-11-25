import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { X, ChevronDown, Camera, ImagePlus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Layout from "@/components/common/Layout";
import MyText from "@/components/common/MyText";
import BottomModal from "@/components/common/BottomModal";
import { useModal } from "@/hooks/useModal";
import { CATEGORIES, CategoryID } from "@/utils/constants/categories";
import KeyboardLayout from "@/components/common/KeyboardLayout";
import { CategorySelectModal } from "@/components/feed/CategorySelectModal";
import { ImagePreview } from "@/components/feed/ImagePreview";
import InnerLayout from "@/components/common/InnerLayout";

interface FeedWriteScreenProps {
  navigation: any;
}

interface ImageFile {
  uri: string;
  type?: string;
  fileName?: string;
}

export default function FeedWriteScreen({ navigation }: FeedWriteScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);

  const categoryModal = useModal();

  const handleCategorySelect = (category: (typeof CATEGORIES)[0]) => {
    setSelectedCategory(category);
    categoryModal.closeModal();
  };

  const handleOpenCategoryModal = () => {
    const options = CATEGORIES.map((category) => ({
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
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
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      return;
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const keyboardDismiss = () => (
    <TouchableOpacity onPress={() => Keyboard.dismiss()}>
      <MyText color="text-textDescription" className="font-semibold">
        취소
      </MyText>
    </TouchableOpacity>
  );

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
            {/* {selectedCategory.icon}  */}
            {selectedCategory.label}
          </MyText>
          <ChevronDown size={24} color="#282828" />
        </TouchableOpacity>
      }
      headerRight={
        <TouchableOpacity
          className="bg-primary px-4 py-1.5 rounded-full"
          onPress={() => console.log("게시")}
        >
          <MyText color="text-white">게시</MyText>
        </TouchableOpacity>
      }
    >
      <KeyboardLayout
        footer={
          <View>
            <ImagePreview images={images} onRemove={removeImage} />
            <View className="flex-row justify-between items-center py-2 px-4 border-t border-gray-200">
              <View className="flex-row items-center">
                <TouchableOpacity onPress={pickImage} className="mr-3">
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
          onSelect={(category) => {
            setSelectedCategory(category);
            categoryModal.closeModal();
          }}
        />
      </BottomModal>
    </Layout>
  );
}
