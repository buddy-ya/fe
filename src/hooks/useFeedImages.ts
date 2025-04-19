import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { ImageFile } from "@/types";

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: false,
  quality: 0.8,
  allowsMultipleSelection: true,
  selectionLimit: 5,
};

interface UseFeedImagesProps {
  initialImages?: ImageFile[];
}

export const useFeedImages = ({
  initialImages = [],
}: UseFeedImagesProps = {}) => {
  const [images, setImages] = useState<ImageFile[]>(initialImages);

  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      Alert.alert("Error", "Failed to load images");
    }
  };

  const takePhoto = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
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
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    images,
    pickImage,
    takePhoto,
    removeImage,
  };
};
