import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Image } from 'react-native';
import { AuthRepository } from '@/api';
import { Button, Heading, HeadingDescription, InnerLayout, Layout, MyText } from '@/components';
import { FeedStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import { ImageFile } from '@/types';
import ImageBox from '@assets/icons/imageBox.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Upload } from 'lucide-react-native';
import { logError, processImageForUpload } from '@/utils';

type EmailVerificationScreenProps = NativeStackScreenProps<
  FeedStackParamList,
  'StudentIdVerification'
>;

export default function StudentIdCardUploadScreen({ navigation }: EmailVerificationScreenProps) {
  const { t } = useTranslation('certification');
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const isStudentIdCardRequested = useUserStore((state) => state.isStudentIdCardRequested);
  const update = useUserStore((state) => state.update);

  useEffect(() => {
    async function fetchStudentIdCard() {
      if (isStudentIdCardRequested) {
        const { studentIdCardUrl } = await AuthRepository.getStudentIdCard();
        if (studentIdCardUrl) {
          setInitialImage(studentIdCardUrl);
        }
      }
    }
    fetchStudentIdCard();
  }, [isStudentIdCardRequested]);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert(t('studentId.permission.gallery'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
      if (!result.canceled) {
        // 여기서는 새로 선택한 이미지를 ImagePicker.ImagePickerAsset 타입으로 저장합니다.
        setSelectedAsset(result.assets[0]);
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleSubmit = async () => {
    try {
      // submit 버튼은 사용자가 새 이미지를 선택한 경우에만 활성화됩니다.
      if (!selectedAsset) return;
      const formData = new FormData();
      formData.append('image', processImageForUpload(selectedAsset as ImageFile));
      await AuthRepository.uploadStudentIdCard(formData);
      if (!isStudentIdCardRequested) {
        update({ isStudentIdCardRequested: true });
      }
      navigation.navigate('StudentIdComplete');
    } catch (error) {
      logError(error);
      alert(t('studentId.error.upload'));
    }
  };

  // 렌더링 시에는 새로 선택한 이미지(selectedAsset)가 있으면 그것의 uri를, 없으면 initialImage를 사용합니다.
  const imageUri = selectedAsset ? selectedAsset.uri : initialImage;
  // 제출 버튼은 새 이미지가 선택되지 않았다면(즉, imageUri가 초기값과 동일하다면) 비활성화.
  const isSubmitDisabled = selectedAsset === null;

  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <Heading>{t('studentId.title')}</Heading>
        <HeadingDescription>{t('studentId.description')}</HeadingDescription>
        <View className="mt-14 flex-1 items-center">
          <TouchableOpacity
            onPress={handleImagePick}
            className={`h-[320px] w-full items-center justify-center bg-background`}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="contain" />
            ) : (
              <ImageBox className="h-full w-full" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleImagePick}
            className="mt-8 flex flex-row items-center rounded-2xl bg-[#E8F8F4] px-16 py-[8px]"
          >
            <Upload size={18} color={'#00A176'} />
            <MyText color="text-primary" className="ml-3 font-semibold">
              {t('studentId.upload')}
            </MyText>
          </TouchableOpacity>
        </View>
        <Button onPress={handleSubmit} disabled={isSubmitDisabled}>
          <MyText color="text-white">{t('studentId.submitButton')}</MyText>
        </Button>
      </InnerLayout>
    </Layout>
  );
}
