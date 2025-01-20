import * as ImagePicker from 'expo-image-picker';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Image } from 'react-native';
import { logError, processImageForUpload } from '@/utils';
import { AuthRepository } from '@/api';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { ImageFile } from '@/types';

export default function StudentIdCardUploadScreen({ navigation }) {
  const { t } = useTranslation('certification');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert(t('studentId.permission.gallery'));
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

      const formData = new FormData();
      // TODO: 테스트 필요
      formData.append("image", processImageForUpload(selectedImage as ImageFile));
      await AuthRepository.uploadStudentIdCard(formData);

      navigation.navigate('StudentIdComplete');
    } catch (error) {
      logError(error);
      alert(t('studentId.error.upload'));
    }
  };

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading>{t('studentId.title')}</Heading>
        <HeadingDescription>{t('studentId.description')}</HeadingDescription>

        <View className="flex-1 items-center justify-center">
          <TouchableOpacity
            onPress={handleImagePick}
            className="mb-10 h-[320px] w-[180px] items-center justify-center overflow-hidden rounded-[12px] border-[1px] border-border bg-background"
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage.uri }}
                className="h-full w-full rounded-[6px]"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Plus size={24} color="white" />
                </View>
                <MyText color="text-textDescription">{t('studentId.select')}</MyText>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Button onPress={handleSubmit} disabled={!selectedImage}>
          <MyText color="text-white">{t('studentId.submit')}</MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
