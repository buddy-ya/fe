import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { Plus } from "lucide-react-native";
import { logError } from "@/utils/service/error";
import Button from "@/components/common/Button";
import MyText from "@/components/common/MyText";

export default function StudentIdUploadScreen({ navigation }) {
  const { t } = useTranslation("onboarding");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const handleImagePick = async () => {
    try {
      // 권한 요청
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("이미지를 선택하기 위해서는 갤러리 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [3, 4],
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedImage) return;

      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage.uri,
        type: "image/jpeg",
        name: "studentId.jpg",
      } as any);

      // API call here
      // await postStudentIdVerification(formData);

      navigation.navigate("OnboardingNextScreen");
    } catch (error) {
      logError(error);
    }
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <View className="flex-1 px-5">
        <Heading>{t("studentId.title")}</Heading>
        <HeadingDescription>{t("studentId.description")}</HeadingDescription>

        <View className="flex-1 justify-center items-center">
          <TouchableOpacity
            onPress={handleImagePick}
            className="w-[280px] h-[500px] rounded-3xl border-2 border-dashed border-border justify-center items-center bg-background"
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage.uri }}
                className="w-full h-full rounded-3xl"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mb-2">
                  <Plus size={24} color="white" />
                </View>
                <MyText color="text-textDescription">
                  {t("studentId.selectImage")}
                </MyText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Button
          onPress={handleSubmit}
          disabled={!selectedImage}
          className="mb-8"
        >
          {t("studentId.submit")}
        </Button>
      </View>
    </Layout>
  );
}
