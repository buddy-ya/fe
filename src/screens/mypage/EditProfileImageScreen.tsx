import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useProfileStore } from '@/store/profile';
import { UserRepository } from '@/api';
import { InnerLayout, Layout, MyText } from '@/components';

const PROFILE_IMAGES = [
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image1.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image2.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image3.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image4.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image5.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image6.png',
];

export default function EditProfileImageScreen({ navigation }) {
  const { t } = useTranslation('mypage');
  const { profile } = useProfileStore();
  const [selectedImage, setSelectedImage] = useState(profile.profileImageUrl);

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const isChanged = useMemo(() => {
    return selectedImage !== profile.profileImageUrl;
  }, [selectedImage, profile.profileImageUrl]);

  const handleComplete = async () => {
    const imageKey = selectedImage.split('/').pop()?.replace('.png', '');
    if (!imageKey) return;
    await UserRepository.updateProfileImage(imageKey);
    navigation.goBack();
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <MyText size="text-xl" className="font-semibold">
          {t('profile.photo.title')}
        </MyText>
      }
      headerRight={
        <TouchableOpacity onPress={handleComplete}>
          <MyText size="text-xl" color={isChanged ? '' : 'text-textLight'} className="font-semibold">
            {t('common.complete')}
          </MyText>
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <View className="items-center mt-20">
          <Image source={{ uri: selectedImage }} className="w-[240px] h-[240px] rounded-[70px]" resizeMode="cover" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="p-6 mt-10 flex-row flex-wrap justify-between gap-y-4 bg-white rounded-[20px]">
            {PROFILE_IMAGES.map((imageUrl, index) => (
              <TouchableOpacity
                key={imageUrl}
                onPress={() => handleSelectImage(imageUrl)}
                className={`w-[86px] h-[86px] rounded-[27px] overflow-hidden
                    ${selectedImage === imageUrl ? 'border-[1.5px] border-[#004D39]' : ''}`}
              >
                <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </InnerLayout>
    </Layout>
  );
}
