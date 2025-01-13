import { useState } from "react";
import { Alert } from "react-native";
import { ImageFile } from "@/types";
import { ImagePickerOptions, launchCameraAsync, launchImageLibraryAsync, requestCameraPermissionsAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";


interface UseImageUploadProps {
  options?: ImagePickerOptions
  initialImages?: ImageFile[];
}

export const useImageUpload = ({
  options,
  initialImages = [],
}: UseImageUploadProps) => {
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [loading, setLoading] = useState(false);

  const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: options?.allowsEditing ?? false,
    quality: options?.quality ?? 0.8,
    allowsMultipleSelection: options?.allowsMultipleSelection ?? true,
    selectionLimit: options?.selectionLimit ?? 5,
  };

  const handleUpload = async () => {
    setLoading(true);
    await requestMediaLibraryPermissionsAsync();
    try {
      const result = await launchImageLibraryAsync({
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
      Alert.alert("Error", "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoto = async () => {
    setLoading(true);
    await requestCameraPermissionsAsync();
    try {
      const result = await launchCameraAsync({
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
      Alert.alert("Error", "Failed to take photo");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    images,
    handleUpload,
    handlePhoto,
    removeImage,
    loading,
  };
};
