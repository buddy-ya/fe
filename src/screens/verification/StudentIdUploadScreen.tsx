import React, { useState } from "react";
import { View, TouchableOpacity, Image, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import Layout from "@/components/common/Layout";
import Heading from "@/components/onboarding/Heading";
import HeadingDescription from "@/components/onboarding/HeadingDescription";
import { Plus } from "lucide-react-native";
import { logError } from "@/utils/service/error";
import Button from "@/components/common/Button";
import MyText from "@/components/common/MyText";
import InnerLayout from "@/components/common/InnerLayout";
import { postStudentIdVerification } from "@/api/certification/certification";
import { getAccessToken, getRefreshToken } from "@/utils/service/auth";

export default function StudentIdCardUploadScreen({ navigation }) {
  const { t } = useTranslation("certification");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(t("studentId.permission.gallery"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
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

      await postStudentIdVerification({
        selectedImage,
      });

      navigation.navigate("StudentIdComplete");
    } catch (error) {
      logError(error);
      alert(t("studentId.error.upload"));
    }
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading>{t("studentId.title")}</Heading>
        <HeadingDescription>{t("studentId.description")}</HeadingDescription>

        <View className="flex-1 justify-center items-center">
          <TouchableOpacity
            onPress={handleImagePick}
            className="mb-10 w-[180px] h-[320px] rounded-[12px] border-[1px] border-border justify-center items-center bg-background"
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage.uri }}
                className="w-full h-full rounded-[6px]"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mb-2">
                  <Plus size={24} color="white" />
                </View>
                <MyText color="text-textDescription">
                  {t("studentId.select")}
                </MyText>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Button onPress={handleSubmit} disabled={!selectedImage}>
          <MyText color="text-white">{t("studentId.submit")}</MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
